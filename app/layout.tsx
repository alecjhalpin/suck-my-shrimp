import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Suck My Shrimp | Saltwater Fishing Gear",
  description:
    "Premium saltwater fishing apparel with a ridiculous name. Join the list for the first drop.",
  icons: {
    icon: [{ url: "/favicon.svg?v=2", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
