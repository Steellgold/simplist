import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import type { Component } from "@/components/utils/component";
import type { PropsWithChildren } from "react";

const nunito = Nunito({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Simplist - The simplest way to integrate a blog into your website",
  description: "Simplist is a simple, fast. Post your content in the simplest way possible, and just get your content back with an API."
};

const Layout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body className={nunito.className}>{children}</body>
    </html>
  );
};

export default Layout;