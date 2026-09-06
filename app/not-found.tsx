import Image from "next/image";
import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.current} aria-hidden="true" />
      <div className={styles.bubbles} aria-hidden="true">
        <span /><span /><span /><span />
      </div>

      <section className={styles.card}>
        <div className={styles.mascot}>
          <Image
            src="/assets/mascot.webp"
            alt=""
            width={420}
            height={420}
            priority
          />
        </div>

        <div className={styles.copy}>
          <p className={styles.kicker}>Wrong fishing hole</p>
          <p className={styles.code}>404</p>
          <h1>This shrimp’s already been sucked.</h1>
          <p className={styles.message}>
            Whatever you were fishing for isn’t in these waters.
          </p>
          <Link className={styles.home} href="/">
            Back to the boat
          </Link>
        </div>
      </section>
    </main>
  );
}
