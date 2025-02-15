import { Component } from "@workspace/ui/components/utils/component"
import { Nunito, Nunito_Sans } from "next/font/google"
import { Providers } from "@/components/providers"
import { PropsWithChildren } from "react"
import "@workspace/ui/globals.css"

const fontSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Nunito({
  subsets: ["latin"],
  variable: "--font-mono",
})

const Layout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default Layout;