import { redirect } from "@remix-run/react";
import { Page, Text } from "@shopify/polaris";

export const loader = async () => {
  return redirect("/app");
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
