import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { getStoreProduct, storeProducts } from "../products";
import styles from "./product.module.css";

export function generateStaticParams() {
  return storeProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getStoreProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Suck My Shrimp`,
    description: product.short,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getStoreProduct(slug);
  if (!product) notFound();

  return (
    <main className={styles.page}>
      <nav className={styles.nav}>
        <Link href="/shop"><ArrowLeft size={18} /> All products</Link>
        <Link href="/" className={styles.brand}>SUCK MY SHRIMP</Link>
        <Link href="/#launch-list">Early access</Link>
      </nav>

      <section className={styles.product}>
        <div className={styles.media}>
          <Image src={product.image} alt={`${product.name} concept mockup`} fill priority sizes="(max-width: 820px) 100vw, 55vw" />
          <span>Concept preview</span>
        </div>
        <div className={styles.details}>
          <p className={styles.kind}>{product.kind}</p>
          <h1>{product.name}</h1>
          <div className={styles.price}><span>Target price</span><strong>{product.price}</strong></div>
          <p className={styles.description}>{product.description}</p>

          <ul className={styles.features}>
            {product.features.map((feature) => <li key={feature}><Check size={17} /> {feature}</li>)}
          </ul>

          {product.sizes && (
            <div className={styles.sizes}>
              <span>Planned sizes</span>
              <div>{product.sizes.map((size) => <button disabled key={size}>{size}</button>)}</div>
            </div>
          )}

          <div className={styles.status}>
            <span>{product.status}</span>
            <p>Ordering stays locked until the production sample and final landed cost are approved.</p>
          </div>

          <Link className={styles.notify} href="/#launch-list">Get notified when it drops <ArrowUpRight size={20} /></Link>
          <p className={styles.note}>Target pricing and specifications may change after sampling.</p>
        </div>
      </section>
    </main>
  );
}
