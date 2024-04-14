import type { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme";
import type { Component } from "@/components/utils/component";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "./query-provider";

export const Providers: Component<PropsWithChildren> = ({ children }) => {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <Toaster />

        {children}
      </ThemeProvider>
    </QueryProvider>
  );
};