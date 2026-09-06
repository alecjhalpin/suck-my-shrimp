import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { storeProducts } from "./products";
import styles from "./shop.module.css";

export const metadata: Metadata = {
  title: "Shop the Founders Drop | Suck My Shrimp",
  description:
    "Preview the first Suck My Shrimp saltwater apparel collection and get early access to launch.",
};

export default function ShopPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Store navigation">
        <Link href="/" className={styles.back}><ArrowLeft size={18} /> Home</Link>
        <Link href="/" className={styles.brand}>SUCK MY SHRIMP</Link>
        <Link href="/#launch-list" className={styles.early}>Get early access</Link>
      </nav>

      <header className={styles.hero}>
        <p>Founders Drop 001</p>
        <h1>Fish hard.<br /><span>Dress accordingly.</span></h1>
        <div className={styles.heroBottom}>
          <p>Four launch pieces currently moving through sourcing and sample approval. Target pricing is shown so you know what we’re building toward.</p>
          <span>Checkout opens after the gear earns it.</span>
        </div>
      </header>

      <section className={styles.collection} aria-labelledby="collection-title">
        <div className={styles.collectionHead}>
          <div><span>01</span><p>Opening lineup</p></div>
          <h2 id="collection-title">The first four</h2>
        </div>
        <div className={styles.grid}>
          {storeProducts.map((product, index) => (
            <Link className={styles.card} href={`/shop/${product.slug}`} key={product.slug}>
              <div className={styles.media}>
                <Image src={product.image} alt={`${product.name} concept mockup`} fill sizes="(max-width: 760px) 100vw, 50vw" />
                <span className={styles.number}>0{index + 1}</span>
                <span className={styles.status}>Sample stage</span>
              </div>
              <div className={styles.info}>
                <div>
                  <p>{product.kind}</p>
                  <h3>{product.name}</h3>
                  <span>{product.short}</span>
                </div>
                <div className={styles.price}>
                  <small>Target price</small>
                  <strong>{product.price}</strong>
                  <ArrowUpRight size={22} />
                </div>
              </div>
            </Link>
          ))}
        </div>
        <p className={styles.disclaimer}>Concept imagery and target prices shown. Final specifications, colors, sizing, and prices may change after sample approval and landed-cost review.</p>
      </section>

      <section className={styles.cta}>
        <p>Want first crack at the drop?</p>
        <h2>Get on the list before we open the cooler.</h2>
        <Link href="/#launch-list">Get early access <ArrowUpRight size={20} /></Link>
      </section>
    </main>
  );
}
