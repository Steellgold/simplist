import { Component } from "@workspace/ui/components/utils/component";
import { PropsWithChildren } from "react";

const Layout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <div className="space-y-6 max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  )
}

export default Layout;