"use client";

import { useBreadcrumbStore } from "@/hooks/use-breadcrumb";
import { ReactElement, useEffect } from "react";

const Page = (): ReactElement => {
  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);

  useEffect(() => {
    setBreadcrumb([], "Overview");
  }, [setBreadcrumb]);

  return (
    <div className="container">
      <h1>Overview</h1>
      <p>...</p>
    </div>
  )
}

export default Page;