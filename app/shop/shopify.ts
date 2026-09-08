import { env } from "cloudflare:workers";

type ShopifyEnv = {
  SHOPIFY_STORE_DOMAIN?: string;
  SHOPIFY_STOREFRONT_PRIVATE_TOKEN?: string;
};

const API_VERSION = "2026-07";

export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}) {
  const bindings = env as unknown as ShopifyEnv;
  const domain = bindings.SHOPIFY_STORE_DOMAIN?.trim().toLowerCase();
  const token = bindings.SHOPIFY_STOREFRONT_PRIVATE_TOKEN?.trim();

  if (!domain || !token || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain)) {
    throw new Error("Shopify storefront is not configured.");
  }

  const response = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Shopify-Storefront-Private-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) throw new Error(`Shopify returned ${response.status}.`);
  const payload = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };
  if (payload.errors?.length || !payload.data) {
    throw new Error(payload.errors?.map((error) => error.message).join("; ") || "Shopify returned no data.");
  }
  return payload.data;
}
