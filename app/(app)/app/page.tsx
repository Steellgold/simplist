"use client";

import { useBreadcrumbStore } from "@/hooks/use-breadcrumb";
import type { ReactElement } from "react";
import { useEffect } from "react";

const Page = (): ReactElement => {
  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);

  useEffect(() => {
    setBreadcrumb([], "Overview");
  }, [setBreadcrumb]);

  return (
    <div>
      <h1>Overview</h1>
      <p>...</p>
    </div>
  );
};

export default Page;