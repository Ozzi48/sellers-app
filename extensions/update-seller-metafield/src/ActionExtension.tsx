import {
  reactExtension,
  useApi,
  AdminAction,
  BlockStack,
  Button,
  ChoiceList,
  Text,
} from "@shopify/ui-extensions-react/admin";
import { useState } from "react";

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

  const handleSave = async () => {
    console.log(selected);
    if (!selected[0]) return;

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
            value: selected[0],
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

    if (res.ok) {
      close();
    } else {
      console.error("Metafield save failed");
    }

    setSaving(false);
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
        <ChoiceList
          name="seller_id"
          choices={sellers}
          value={selected ? [selected] : []}
          onChange={(value) => {
            console.log(value);
            setSelected(Array.isArray(value) ? value[0] : value);
          }}
        />
      </BlockStack>
    </AdminAction>
  );
}
