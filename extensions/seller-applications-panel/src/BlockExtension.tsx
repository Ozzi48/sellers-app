import {
  reactExtension,
  useApi,
  AdminBlock,
  BlockStack,
  Text,
  Divider,
  Image,
  Badge,
  ChoiceList,
} from "@shopify/ui-extensions-react/admin";
import { useState } from "react";

// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = "admin.product-details.block.render";

export default reactExtension(TARGET, () => <App />);

function App() {
  // The useApi hook provides access to several useful APIs like i18n and data.
  const { i18n, data } = useApi(TARGET);
  console.log({ data });

  const mockApplications = [
    {
      id: "app1",
      sellerEmail: "alice@example.com",
      status: "PENDING",
      stripeAccountId: "acct_123abc",
      items: [
        {
          imageUrl: "https://placekitten.com/150/150",
          defect: true,
          description: "Small tear on the left sleeve",
        },
        {
          imageUrl: "https://placekitten.com/140/140",
          defect: false,
          description: "No visible damage",
        },
      ],
    },
    {
      id: "app2",
      sellerEmail: "bob@example.com",
      status: "CONTACTED",
      stripeAccountId: "acct_456def",
      items: [
        {
          imageUrl: "https://placekitten.com/120/120",
          defect: true,
          description: "Stain on front",
        },
      ],
    },
  ];

  const [applications, setApplications] = useState(mockApplications);

  const handleStatusChange = (id: string, newStatus: string) => {
    const updated = applications.map((app) =>
      app.id === id ? { ...app, status: newStatus } : app,
    );
    setApplications(updated);
  };

  return (
    <AdminBlock title="Seller Applications">
      <BlockStack spacing="loose">
        {applications.map((app) => (
          <BlockStack key={app.id} spacing="loose" border="base" padding="base">
            <Text size="medium" emphasis="bold">
              {app.sellerEmail}
            </Text>{" "}
            <Text size="small" tone="subdued">
              ({app.stripeAccountId})
            </Text>
            <Badge tone="info">{app.status}</Badge>
            <ChoiceList
              name={`status-${app.id}`}
              title="Change Status"
              choices={[
                { label: "PENDING", value: "PENDING" },
                { label: "CONTACTED", value: "CONTACTED" },
                { label: "COMPLETED", value: "COMPLETED" },
                { label: "REJECTED", value: "REJECTED" },
              ]}
              selected={[app.status]}
              onChange={(selected) => handleStatusChange(app.id, selected[0])}
            />
            <BlockStack spacing="base">
              {app.items.map((item, idx) => (
                <BlockStack
                  key={idx}
                  spacing="tight"
                  inlineAlignment="start"
                  border="base"
                  padding="tight"
                >
                  <Image
                    source={item.imageUrl}
                    description="Clothing photo"
                    border="base"
                    borderRadius="loose"
                    width="120px"
                    height="120px"
                  />
                  <Text>Defect: {item.defect ? "Yes" : "No"}</Text>
                  <Text>Description: {item.description}</Text>
                </BlockStack>
              ))}
            </BlockStack>
            <Divider />
          </BlockStack>
        ))}
      </BlockStack>
    </AdminBlock>
  );
}
