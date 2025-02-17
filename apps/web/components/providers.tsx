"use client"

import { Toaster } from "@workspace/ui/components/toaster"
import { Component } from "@workspace/ui/components/utils/component"
import { BreadcrumbProvider } from "@workspace/ui/contexts/breadcrumb-context"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { PropsWithChildren } from "react"

export const Providers: Component<PropsWithChildren> = ({ children }) => {
  return (
    <BreadcrumbProvider>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        enableColorScheme
      >
        <Toaster />

        {children}
      </NextThemesProvider>
    </BreadcrumbProvider>
  )
}
