import { shopifyFetch } from "../../../shop/shopify";

type Cart = { id: string; checkoutUrl: string; totalQuantity: number };
type CartPayload = { cart?: Cart; userErrors: Array<{ message: string }> };
type CartCreateResponse = { cartCreate: CartPayload };
type CartAddResponse = { cartLinesAdd: CartPayload };

const CART_CREATE = `mutation CreateCart($lines: [CartLineInput!]!) { cartCreate(input: { lines: $lines }) { cart { id checkoutUrl totalQuantity } userErrors { message } } }`;
const CART_ADD = `mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { id checkoutUrl totalQuantity } userErrors { message } } }`;

function result(payload: CartPayload) {
  if (payload.userErrors.length || !payload.cart) throw new Error(payload.userErrors.map((error) => error.message).join("; ") || "Cart unavailable.");
  return payload.cart;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { merchandiseId?: unknown; quantity?: unknown; cartId?: unknown };
    const merchandiseId = typeof body.merchandiseId === "string" ? body.merchandiseId : "";
    const cartId = typeof body.cartId === "string" ? body.cartId : "";
    const quantity = Number.isInteger(body.quantity) ? Number(body.quantity) : 1;
    if (!merchandiseId.startsWith("gid://shopify/ProductVariant/") || quantity < 1 || quantity > 20) {
      return Response.json({ error: "Invalid cart item." }, { status: 400 });
    }
    const lines = [{ merchandiseId, quantity }];
    let cart: Cart;
    if (cartId.startsWith("gid://shopify/Cart/")) {
      try {
        cart = result((await shopifyFetch<CartAddResponse>(CART_ADD, { cartId, lines })).cartLinesAdd);
      } catch {
        cart = result((await shopifyFetch<CartCreateResponse>(CART_CREATE, { lines })).cartCreate);
      }
    } else {
      cart = result((await shopifyFetch<CartCreateResponse>(CART_CREATE, { lines })).cartCreate);
    }
    return Response.json(cart);
  } catch (error) {
    console.error("Shopify cart failed", error);
    return Response.json({ error: "Cart is temporarily unavailable." }, { status: 503 });
  }
}
