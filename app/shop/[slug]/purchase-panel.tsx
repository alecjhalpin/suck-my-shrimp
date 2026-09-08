"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import styles from "./product.module.css";

type Variant = { id: string; title: string; availableForSale: boolean; price: { amount: string; currencyCode: string }; selectedOptions: Array<{ name: string; value: string }> };
type Product = { availableForSale: boolean; variants: { nodes: Variant[] } };

export function PurchasePanel({ handle, plannedSizes = [] }: { handle: string; plannedSizes?: string[] }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedId, setSelectedId] = useState("");
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`/api/shopify/product?handle=${encodeURIComponent(handle)}`)
      .then((response) => response.ok ? response.json() : { product: null })
      .then(({ product: nextProduct }) => {
        setProduct(nextProduct);
        const first = nextProduct?.variants?.nodes?.find((variant: Variant) => variant.availableForSale);
        if (first) setSelectedId(first.id);
      })
      .finally(() => setLoading(false));
  }, [handle]);

  const variants = useMemo(() => product?.variants.nodes || [], [product]);
  const selected = variants.find((variant) => variant.id === selectedId);

  if (loading) return <div className={styles.status}><span>Checking the bait well…</span><p>Loading current availability from Shopify.</p></div>;

  if (!product || !product.availableForSale || !variants.some((variant) => variant.availableForSale)) {
    return <>
      {plannedSizes.length > 0 && <div className={styles.sizes}><span>Planned sizes</span><div>{plannedSizes.map((size) => <button disabled key={size}>{size}</button>)}</div></div>}
      <div className={styles.status}><span>Awaiting sample approval</span><p>Ordering stays locked until the production sample and final landed cost are approved.</p></div>
      <Link className={styles.notify} href="/#launch-list">Get notified when it drops <ArrowUpRight size={20} /></Link>
    </>;
  }

  async function addToCart() {
    if (!selected) return;
    setAdding(true); setMessage("");
    try {
      const cartId = localStorage.getItem("sms-shopify-cart") || undefined;
      const response = await fetch("/api/shopify/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ merchandiseId: selected.id, quantity: 1, cartId }) });
      const cart = await response.json();
      if (!response.ok) throw new Error(cart.error || "Cart unavailable.");
      localStorage.setItem("sms-shopify-cart", cart.id);
      localStorage.setItem("sms-shopify-checkout", cart.checkoutUrl);
      setCheckoutUrl(cart.checkoutUrl);
      setMessage(`Added to cart — ${cart.totalQuantity} item${cart.totalQuantity === 1 ? "" : "s"}.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Cart unavailable."); }
    finally { setAdding(false); }
  }

  return <div className={styles.buyBox}>
    <div className={styles.sizes}><span>Choose an option</span><div>{variants.map((variant) => <button type="button" disabled={!variant.availableForSale} aria-pressed={selectedId === variant.id} className={selectedId === variant.id ? styles.selected : ""} onClick={() => setSelectedId(variant.id)} key={variant.id}>{variant.selectedOptions.map((option) => option.value).join(" / ")}</button>)}</div></div>
    {selected && <p className={styles.livePrice}>{new Intl.NumberFormat("en-US", { style: "currency", currency: selected.price.currencyCode }).format(Number(selected.price.amount))}</p>}
    <button className={styles.addToCart} onClick={addToCart} disabled={!selected || adding}><ShoppingBag size={19} /> {adding ? "Adding…" : "Add to cart"}</button>
    {message && <p className={styles.cartMessage}>{message}</p>}
    {checkoutUrl && <a className={styles.notify} href={checkoutUrl}>Secure Shopify checkout <ArrowUpRight size={20} /></a>}
  </div>;
}
