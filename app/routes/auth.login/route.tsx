import { json } from "@remix-run/node";
import { Page, Text } from "@shopify/polaris";

export const loader = async () => {
  return json({});
};

export default function Auth() {
  return (
    <Page>
      <Text variant="headingMd" as="h2">
        You should not see this page. Authentication happens automatically.
      </Text>
    </Page>
  );
}
