"use client";

import { ReactElement } from "react";
import { BreadcrumbItem } from "../types/breadcrumb.types.js";
import { useBreadcrumb } from "../hooks/use-breadcrumb.js";

type BreadcrumbSetterProps = {
  items: (string | BreadcrumbItem)[];
}

export const BreadcrumbSetter = ({ items }: BreadcrumbSetterProps): ReactElement | null => {
  useBreadcrumb(items);
  return null;
};