import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Suck My Shrimp | Saltwater Fishing Gear", description: "Premium saltwater fishing apparel with a ridiculous name. Join the list for the first drop.", other: { "codex-preview": "development" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
