"use client";

import { ReactElement } from "react";
import { BreadcrumbItem } from "@workspace/ui/types/breadcrumb.types";
import { useBreadcrumb } from "@workspace/ui/hooks/use-breadcrumb";

type BreadcrumbSetterProps = {
  items: (string | BreadcrumbItem)[];
}

export const BreadcrumbSetter = ({ items }: BreadcrumbSetterProps): ReactElement | null => {
  useBreadcrumb(items);
  return null;
};