import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { getStoreProduct, storeProducts } from "../products";
import { PurchasePanel } from "./purchase-panel";
import styles from "./product.module.css";

export function generateStaticParams(){ return storeProducts.map((product)=>({slug:product.slug})); }
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{ const {slug}=await params; const product=getStoreProduct(slug); return product?{title:`${product.name} | Suck My Shrimp`,description:product.short}:{}; }

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const product=getStoreProduct(slug); if(!product) notFound();
  return <main className={styles.page}>
    <nav className={styles.nav}><Link href="/shop"><ArrowLeft size={18}/> All products</Link><Link href="/" className={styles.brand}>SUCK MY SHRIMP</Link><Link href="/#launch-list">Early access</Link></nav>
    <section className={styles.product}>
      <div className={styles.media}><Image src={product.image} alt={`${product.name} concept mockup`} fill priority sizes="(max-width: 820px) 100vw, 55vw"/><span>Concept preview</span></div>
      <div className={styles.details}>
        <p className={styles.kind}>{product.kind}</p><h1>{product.name}</h1>
        <div className={styles.price}><span>Target price</span><strong>{product.price}</strong></div>
        <p className={styles.description}>{product.description}</p>
        <ul className={styles.features}>{product.features.map((feature)=><li key={feature}><Check size={17}/> {feature}</li>)}</ul>
        <PurchasePanel handle={product.shopifyHandle} plannedSizes={product.sizes}/>
        <p className={styles.note}>Shopify supplies live pricing and availability once this product is approved for sale.</p>
      </div>
    </section>
  </main>;
}
