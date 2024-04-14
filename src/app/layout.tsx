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
import { WelcomeDialog } from "@/components/welcome.dialog";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const nunito = Nunito({ subsets: ["latin"] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Simplist - The simplest way to integrate a blog into your website",
  description: "Simplist is a simple, fast. Post your content in the simplest way possible, and just get your content back with an API.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    siteName: "Simplist",
    title: "Simplist - The simplest way to integrate a blog into your website",
    description: "Simplist is a simple, fast. Post your content in the simplest way possible, and just get your content back with an API.",
    images: [
      {
        url: new URL("/_static/opengraph-image.png", defaultUrl).href,
        width: 1200,
        height: 630,
        alt: "Simplist - The simplest way to integrate a blog into your website"
      }
    ]
  },
  twitter: {
    site: "@simplistmt",
    card: "summary_large_image",
    creator: "@simplistmt",
    creatorId: "1779571985149820928",
    description: "Simplist is a simple, fast. Post your content in the simplest way possible, and just get your content back with an API.",
    images: [
      {
        url: new URL("/_static/opengraph-image.png", defaultUrl).href,
        width: 1200,
        height: 630,
        alt: "Simplist - The simplest way to integrate a blog into your website"
      }
    ],
    title: "Simplist - The simplest way to integrate a blog into your website"
  }
};

const Layout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body className={cn(nunito.className, "bg-white dark:bg-[#131313]")}>
        <Analytics />
        <SpeedInsights />
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
              <WelcomeDialog />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default Layout;