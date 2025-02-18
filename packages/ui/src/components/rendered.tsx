import { Skeleton } from "@workspace/ui/components/skeleton";
import { Component } from "@workspace/ui/components/utils/component";
import { PropsWithChildren, useEffect, useState } from "react";

export const Rendered: Component<PropsWithChildren & { loadingComponent?: React.ReactNode, delay?: number }> = ({
  children,
  loadingComponent = <Skeleton className="h-12 w-full" />,
  delay = 0
}) => {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRendered(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!rendered) {
    return loadingComponent;
  }

  return children;
};