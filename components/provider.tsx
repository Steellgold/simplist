import type { PropsWithChildren, ReactElement } from "react";
import type { Component } from "./component";
import { TanStackQuery } from "./providers/query-provider";
import { HydrationBoundary } from "./providers/hydration-boundary";
import { Toaster } from "sonner";
import { ThemeProvider } from "./providers/theme-provider";

export const Providers: Component<PropsWithChildren> = ({ children }): ReactElement => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Toaster />

      <TanStackQuery>
        {/* @ts-expect-error Tg stp */}
        <HydrationBoundary queries={[]}>
          {children}
        </HydrationBoundary>
      </TanStackQuery>
    </ThemeProvider>
  );
};