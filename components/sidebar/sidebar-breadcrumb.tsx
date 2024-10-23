"use client";

import { useBreadcrumbStore } from "@/hooks/use-breadcrumb";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import type { ReactElement } from "react";
import Link from "next/link";

const SidebarBreadcrumb = (): ReactElement => {
  const { breadcrumbs, title } = useBreadcrumbStore();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <BreadcrumbItem key={index} className="hidden md:block">
            <BreadcrumbLink asChild>
              <Link href={breadcrumb.href}>
                {breadcrumb.label}
              </Link>
            </BreadcrumbLink>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </BreadcrumbItem>
        ))}

        {breadcrumbs.length > 0 && <BreadcrumbSeparator className="hidden md:block" />}

        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default SidebarBreadcrumb;