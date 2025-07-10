import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Page, Text } from "@shopify/polaris";
import { authenticate } from "../../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  console.log("Authenticated session for:", session.shop);
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
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
