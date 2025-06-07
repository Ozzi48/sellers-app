import {
  reactExtension,
  AdminBlock,
  BlockStack,
  Text,
  Select,
} from "@shopify/ui-extensions-react/admin";
import { useState, useEffect } from "react";

export default reactExtension("admin.product-details.block.render", () => (
  <App />
));

function App() {
  const [selected, setSelected] = useState("");
  const options = [
    { label: "Alice Ok(alice@example.com)", value: "seller_1" },
    { label: "Bob (bob@example.com)", value: "seller_2" },
    { label: "Charlie (charlie@example.com)", value: "seller_3" },
  ];

  // NOTE: this value will NOT be persisted to metafield unless paired with hidden input
  const handleChange = (value: string) => {
    setSelected(value);
  };

  return (
    <AdminBlock title="Assign Seller">
      <BlockStack>
        <Text>OOOOOOK Select a seller:</Text>
        <Select
          label="Seller"
          options={options}
          value={selected}
          onChange={handleChange}
        />

        {/* This hidden input makes Shopify Admin save the value */}
        <input
          type="hidden"
          name="metafields[custom.seller_id]"
          value={selected}
        />
      </BlockStack>
    </AdminBlock>
  );
}
