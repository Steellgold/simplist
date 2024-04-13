import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import type { Component } from "@/components/utils/component";
import type { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Simplist - The simplest way to integrate a blog into your website",
  description: "Simplist is a simple, fast. Post your content in the simplest way possible, and just get your content back with an API."
};

const Layout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
};

export default Layout;