import { AppLayout } from "@/components/app-layout";
import type { Component } from "@/components/component";
import type { PropsWithChildren } from "react";

const Layout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
};

export default Layout;