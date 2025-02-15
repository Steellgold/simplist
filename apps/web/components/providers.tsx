"use client"

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
      {children}
    </NextThemesProvider>
  )
}
