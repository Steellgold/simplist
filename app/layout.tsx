import { ThemeProvider } from "@/components/providers/theme-provider";
import type { Component } from "@/components/component";
import { Providers } from "@/components/provider";
import type { PropsWithChildren } from "react";
import localFont from "next/font/local";
import type { Metadata } from "next";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900"
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900"
});

export const metadata: Metadata = {
  title: "Simplist",
  description: "Generated by create next app"
};

const RootLayout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;