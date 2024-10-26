"use client";

import { useBreadcrumbStore } from "@/hooks/use-breadcrumb";
import type { FC } from "react";
import { useEffect } from "react";

type BreadcrumbUpdaterProps = {
  links: { href: string; label: string }[];
  title: string;
};

export const BreadcrumbUpdater: FC<BreadcrumbUpdaterProps> = ({ links, title }) => {
  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);

  useEffect(() => {
    setBreadcrumb([], "Overview");
  }, [setBreadcrumb]);

  useEffect(() => {
    setBreadcrumb(links, title);
  }, [links, title, setBreadcrumb]);

  return null;
};