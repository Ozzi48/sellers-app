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
  const { close, data } = useApi(TARGET);
  const [selected, setSelected] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);

  const sellers = [
    { label: "Alice (alice@example.com)", value: "seller_1" },
    { label: "Bob (bob@example.com)", value: "seller_2" },
    { label: "Charlie (charlie@example.com)", value: "seller_3" },
  ];

  useEffect(() => {
    const productId = data.selected[0].id;

    const query = {
      query: `
        query GetMetafields($id: ID!) {
          product(id: $id) {
            metafields(first: 10, namespace: "custom") {
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

    (async () => {
      const res = await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify(query),
      });

      const json = await res.json();

      const sellerMetafield = json?.data?.product?.metafields?.edges?.find(
        (edge: any) => edge.node.key === "seller_id",
      );

      if (sellerMetafield?.node?.value) {
        setSelected(sellerMetafield.node.value);
      }
    })();
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
