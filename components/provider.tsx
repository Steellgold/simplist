import type { PropsWithChildren, ReactElement } from "react";
import type { Component } from "./component";
import { TanStackQuery } from "./providers/query-provider";
import { HydrationBoundary } from "./providers/hydration-boundary";
import { Toaster } from "sonner";

export const Providers: Component<PropsWithChildren> = ({ children }): ReactElement => {
  return (
    <TanStackQuery>
      <HydrationBoundary queries={[]}>
        <Toaster richColors={true} />

        {children}
      </HydrationBoundary>
    </TanStackQuery>
  );
};