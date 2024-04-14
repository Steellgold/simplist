import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import type { Component } from "@/components/utils/component";
import type { PropsWithChildren } from "react";
import { cn } from "@/utils";
import { Providers } from "@/providers/providers";
import { SidebarHeader } from "@/components/sidebar.header";
import { SidebarLinks } from "@/components/links";
import { Appbar } from "@/components/appbar";

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
      <body className={cn(nunito.className, "bg-white dark:bg-[#131313]")}>
        <Providers>
          <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
              <div className="flex h-full max-h-screen flex-col gap-2">
                <SidebarHeader />
                <div className="flex-1">
                  <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    <SidebarLinks type="sidebar-desktop" />
                  </nav>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <Appbar />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default Layout;