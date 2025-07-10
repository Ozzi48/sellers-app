import {
  reactExtension,
  useApi,
  AdminAction,
  BlockStack,
  Button,
  Text,
  Select,
} from "@shopify/ui-extensions-react/admin";
import { useEffect, useState } from "react";

const TARGET = "admin.product-details.action.render";

export default reactExtension(TARGET, () => <App />);

function App() {
  const { close, data, extension } = useApi(TARGET);
  const [selected, setSelected] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [sellers, setSellers] = useState<{ label: string; value: string }[]>(
    [],
  );

  useEffect(() => {
    const productId = data.selected[0].id;

    const fetchData = async () => {
      const resShop = await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify({
          query: `
            query GetShopInfo {
              shop {
                name
                myshopifyDomain
                primaryDomain {
                  host
                  sslEnabled
                  url
                }
              }
            }
          `,
        }),
      });

      const jsonShop = await resShop.json();

      // const prodUrl =
      //   jsonShop.data.shop.primaryDomain.url + "/api/admin/sellers";
      const devUrl = "https://dev.thriftys.online/api/admin/sellers";
      const sellersRes = await fetch(devUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const sellerJson = await sellersRes.json();

      const sellerOptions = sellerJson.map((s: any) => ({
        label: s.stripeId ? `${s.label} (Stripe: ${s.stripeId})` : s.label,
        value: s.value,
      }));
      setSellers(sellerOptions || []);

      const metafieldQuery = {
        query: `
          query GetMetafields($id: ID!) {
            product(id: $id) {
              metafields(first: 250, namespace: "custom") {
                edges {
                  node {
                    key
                    value
                  }
                }
              }
            }
          }
        `,
        variables: { id: productId },
      };

      const res = await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify(metafieldQuery),
      });

      const json = await res.json();

      const sellerMetafield = json?.data?.product?.metafields?.edges?.find(
        (edge: any) => edge.node.key === "seller_id",
      );

      if (sellerMetafield?.node?.value) {
        setSelected(sellerMetafield.node.value);
      }
    };

    fetchData();
  }, [data]);

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);

    const mutation = {
      query: `
        mutation SetMetafield($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              key
              value
              type
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        metafields: [
          {
            namespace: "custom",
            key: "seller_id",
            value: selected,
            type: "single_line_text_field",
            ownerId: data.selected[0].id,
          },
        ],
      },
    };

    const res = await fetch("shopify:admin/api/graphql.json", {
      method: "POST",
      body: JSON.stringify(mutation),
    });

    setSaving(false);
    if (res.ok) {
      close();
    } else {
      console.error("Metafield save failed");
    }
  };

  console.log("Last: ", sellers, selected);

  return (
    <AdminAction
      title="Assign Seller"
      primaryAction={
        <Button onPress={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Seller"}
        </Button>
      }
    >
      <BlockStack>
        <Text>Select seller to assign:</Text>
        <Select
          label="Seller"
          options={sellers}
          value={selected}
          onChange={(value) => setSelected(value)}
        />
      </BlockStack>
    </AdminAction>
  );
}
