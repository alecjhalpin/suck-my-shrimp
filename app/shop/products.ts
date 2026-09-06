export type StoreProduct = {
  slug: string;
  name: string;
  kind: string;
  price: string;
  image: string;
  short: string;
  description: string;
  features: string[];
  sizes?: string[];
  status: string;
};

export const storeProducts: StoreProduct[] = [
  {
    slug: "first-cast-performance-shirt",
    name: "The First Cast",
    kind: "UPF performance long sleeve",
    price: "$49.99",
    image: "/assets/performance-shirt.webp",
    short: "The flagship fishing shirt—premium first, funny second.",
    description:
      "A relaxed-fit saltwater performance shirt being developed for hot decks, hard sun, sweat, and long days on the water. Final production begins only after the fabric, print, fit, and UPF documentation pass our sample testing.",
    features: [
      "UPF 50+ production target",
      "Lightweight moisture-wicking polyester",
      "Full-sublimation artwork target",
      "Saltwater and five-wash sample testing",
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    status: "Awaiting sample approval",
  },
  {
    slug: "clean-hook-rope-cap",
    name: "The Clean Hook",
    kind: "Navy and cream rope cap",
    price: "$29.99",
    image: "/assets/navy-rope-cap.webp",
    short: "A clean everyday cap with the shrimp-hook mark up front.",
    description:
      "A structured navy-and-cream rope cap designed to work on the boat without screaming novelty merch. Embroidery, crown shape, closure, and sweatband comfort will be finalized after sampling.",
    features: [
      "Embroidered shrimp-hook mark",
      "Structured crown target",
      "Contrast rope detail",
      "Adjustable closure",
    ],
    status: "Awaiting sample approval",
  },
  {
    slug: "old-salt-heritage-trucker",
    name: "The Old Salt",
    kind: "Coral and navy heritage trucker",
    price: "$28.99",
    image: "/assets/heritage-trucker.webp",
    short: "A vintage fishing patch with enough personality for the boat ramp.",
    description:
      "A coral-and-navy mesh-back trucker built around the heritage Suck My Shrimp patch. We’re sampling patch construction, mesh comfort, fit, and color accuracy before opening the Founders Drop.",
    features: [
      "Woven heritage patch target",
      "Breathable mesh back",
      "Adjustable snap closure",
      "Coral and navy colorway",
    ],
    status: "Awaiting sample approval",
  },
  {
    slug: "stick-it-anywhere-decal-pack",
    name: "Stick It Anywhere",
    kind: "Three-piece decal pack",
    price: "$9.99",
    image: "/assets/decal-pack.webp",
    short: "Three marks for coolers, boats, trucks, and questionable decisions.",
    description:
      "A three-piece pack featuring the hooked mascot, modern hook mark, and heritage badge. Final decals will be tested for water resistance, UV exposure, and clean adhesion before release.",
    features: [
      "Three die-cut designs",
      "Waterproof production target",
      "UV-resistant production target",
      "Built for coolers, boats, and trucks",
    ],
    status: "Awaiting sample approval",
  },
];

export function getStoreProduct(slug: string) {
  return storeProducts.find((product) => product.slug === slug);
}
