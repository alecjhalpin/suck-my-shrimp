import { shopifyFetch } from "../../../shop/shopify";

type ProductResponse = {
  productByHandle: null | {
    id: string;
    handle: string;
    title: string;
    availableForSale: boolean;
    variants: { nodes: Array<{ id: string; title: string; availableForSale: boolean; quantityAvailable: number | null; price: { amount: string; currencyCode: string }; selectedOptions: Array<{ name: string; value: string }> }> };
  };
};

const PRODUCT_QUERY = `query ProductForPurchase($handle: String!) {
  productByHandle(handle: $handle) {
    id handle title availableForSale
    variants(first: 50) {
      nodes { id title availableForSale quantityAvailable price { amount currencyCode } selectedOptions { name value } }
    }
  }
}`;

export async function GET(request: Request) {
  const handle = new URL(request.url).searchParams.get("handle")?.trim() || "";
  if (!/^[a-z0-9-]{1,120}$/.test(handle)) return Response.json({ error: "Invalid product." }, { status: 400 });
  try {
    const data = await shopifyFetch<ProductResponse>(PRODUCT_QUERY, { handle });
    return Response.json({ product: data.productByHandle }, { headers: { "Cache-Control": "public, max-age=60" } });
  } catch (error) {
    console.error("Shopify product lookup failed", error);
    return Response.json({ product: null }, { status: 503 });
  }
}
