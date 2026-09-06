import Image from "next/image";
import { ArrowDownRight, ArrowUpRight, Check, Sun, Waves } from "lucide-react";
import { LaunchForm } from "./launch-form";

const products = [
  { name: "The First Cast", kind: "Performance long sleeve", copy: "Seafoam performance gear built for hot decks, hard sun, and the fish story afterward.", tags: ["UPF 50+ target", "Moisture-wicking", "Full-sublimation concept"], image: "/assets/performance-shirt.webp", className: "product-card product-card-shirt" },
  { name: "The Clean Hook", kind: "Navy rope cap", copy: "A crisp everyday cap with the shrimp-hook mark up front and zero wasted motion.", tags: ["Embroidered icon", "Structured crown", "Contrast rope"], image: "/assets/navy-rope-cap.webp", className: "product-card product-card-hat" },
  { name: "The Old Salt", kind: "Heritage trucker", copy: "Coral, navy, and a vintage oval patch that looks like it has stories already.", tags: ["Woven patch", "Mesh back", "Adjustable snap"], image: "/assets/heritage-trucker.webp", className: "product-card product-card-trucker" },
  { name: "Stick It Anywhere", kind: "Decal pack", copy: "The mascot, modern hook, and heritage mark—ready for coolers, boats, and questionable decisions.", tags: ["Waterproof target", "Die-cut", "Three-mark set"], image: "/assets/decal-pack.webp", className: "product-card product-card-decals" },
];

export default function Home() {
  return <main>
    <nav className="nav-shell" aria-label="Main navigation">
      <a className="nav-brand" href="#top" aria-label="Suck My Shrimp home"><span className="wordmark-crop"><Image src="/assets/modern-wordmark.webp" alt="Suck My Shrimp" width={1774} height={887} priority /></span></a>
      <div className="nav-links"><a href="/shop">Shop</a><a href="#drop">First drop</a><a href="#story">Our story</a></div>
      <a className="nav-cta" href="#launch-list">Get first dibs <ArrowDownRight size={17} /></a>
    </nav>

    <section id="top" className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><Waves size={16} /> Born for saltwater</div>
        <h1>Serious gear.<br/><span>Ridiculous name.</span></h1>
        <p>Premium fishing apparel for anglers who can land a redfish and take a joke.</p>
        <div className="hero-actions"><a className="button button-coral" href="/shop">Shop the first drop <ArrowDownRight size={20} /></a><a className="text-link" href="#launch-list">Join the launch list <ArrowUpRight size={18} /></a></div>
        <div className="hero-proof"><span><Check size={15}/> Built for the water</span><span><Check size={15}/> Small-batch first drop</span><span><Check size={15}/> No boring fishing shirts</span></div>
      </div>
      <div className="hero-art" aria-label="Suck My Shrimp mascot illustration">
        <div className="sunburst" /><Image src="/assets/mascot.webp" alt="Cocky orange shrimp mascot holding a fishing hook" width={820} height={820} priority />
        <div className="sticker sticker-one">FIRST DROP<br/>COMING SOON</div><div className="sticker sticker-two">APPAREL<br/>WITH BITE</div>
      </div>
    </section>

    <div className="ticker" aria-hidden="true"><div>FISH HARD • LAUGH HARDER • SALTWATER READY • FISH HARD • LAUGH HARDER • SALTWATER READY •</div></div>

    <section id="drop" className="drop-section">
      <div className="section-heading"><div><span className="section-number">01</span><span className="eyebrow">The opening lineup</span></div><h2>First drop.<br/>No filler.</h2><p>Four pieces. Three marks. One very loud shrimp. Explore the Founders Drop with target pricing while the gear moves through sample approval.</p></div>
      <div className="product-grid">{products.map((product, index) => <article className={product.className} key={product.name}>
        <div className="product-media"><Image src={product.image} alt={`${product.name} concept mockup`} fill sizes="(max-width: 800px) 100vw, 50vw" /><span className="coming-soon">Sample stage</span><span className="product-index">0{index + 1}</span></div>
        <div className="product-info"><span>{product.kind}</span><h3>{product.name}</h3><p>{product.copy}</p><ul>{product.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></div>
      </article>)}</div>
      <p className="concept-note">Concept previews shown. Explore target pricing and full product details in the shop.</p>
    </section>

    <section id="story" className="story-section">
      <div className="story-art"><Image src="/assets/heritage-patch.webp" alt="Suck My Shrimp heritage fishing patch" fill sizes="(max-width: 800px) 100vw, 45vw" /></div>
      <div className="story-copy"><span className="section-number light">02</span><div className="eyebrow cream"><Sun size={16}/> Why we exist</div><h2>Built to fish. Made to stand out.</h2><p>Suck My Shrimp is a fishing apparel brand for saltwater anglers who want gear with real quality and enough personality to stand out at the ramp.</p><p>The name gets the laugh. The apparel has to earn the spot in your rotation—on the boat, at the dock, and everywhere after.</p><div className="story-signoff">FISHING APPAREL WITH SOME DAMN PERSONALITY.</div></div>
    </section>

    <section id="launch-list" className="launch-section">
      <div className="launch-top"><span className="section-number">03</span><div className="eyebrow"><Waves size={16}/> Get on the boat</div></div>
      <div className="launch-grid"><div><h2>Get first dibs.</h2><p>Be first to see launch colors, sizing, pricing, and the exact second the first drop goes live.</p></div><LaunchForm /></div>
    </section>

    <footer><span className="wordmark-crop footer-wordmark"><Image src="/assets/modern-wordmark.webp" alt="Suck My Shrimp" width={1774} height={887} /></span><p>© 2026 Suck My Shrimp. Built for saltwater and bad influences.</p><a href="#top">Back to top ↑</a></footer>
  </main>;
}
