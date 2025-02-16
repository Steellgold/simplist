import { Component } from "@workspace/ui/components/utils/component"
import { Nunito, Nunito_Sans } from "next/font/google"
import { Providers } from "@/components/providers"
import { PropsWithChildren } from "react"
import "@workspace/ui/globals.css"
import { ToggleTheme } from "@/components/toggle-theme"
import { SidebarInset } from "@workspace/ui/components/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarHeader } from "@/components/sidebar/nav-header"

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
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        <Providers>
          <AppSidebar />
          <SidebarInset >
            <SidebarHeader />

            {children}
          </SidebarInset>

          <ToggleTheme />
        </Providers>
      </body>
    </html>
  )
}

export default Layout;