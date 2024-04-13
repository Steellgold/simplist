import type { PropsWithChildren } from "react";
import { ThemeProvider } from "./theme";
import type { Component } from "@/components/utils/component";
import { Toaster } from "@/components/ui/toaster";

export const Providers: Component<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <Toaster />

      {children}
    </ThemeProvider>
  );
};