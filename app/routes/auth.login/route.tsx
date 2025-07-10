import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Page, Text } from "@shopify/polaris";
import { authenticate } from "../../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("authenticate keys:", Object.keys(authenticate));
  console.log("request:", request);
  try {
    const { session } = await authenticate.admin(request);
    return json({ ok: true });
  } catch (error) {
    console.error("AUTH ERROR:", error);
    throw new Response("Auth failed", { status: 500 });
  }
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
