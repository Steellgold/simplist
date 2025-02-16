"use client"

import { SidebarProvider } from "@workspace/ui/components/sidebar"
import { Toaster } from "@workspace/ui/components/toaster"
import { Component } from "@workspace/ui/components/utils/component"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { PropsWithChildren } from "react"

export const Providers: Component<PropsWithChildren> = ({ children }) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
    >
      <SidebarProvider>
        <Toaster />

        {children}
      </SidebarProvider>
    </NextThemesProvider>
  )
}
