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
          <div key={index} className="flex items-center gap-2">
            <BreadcrumbItem key={index} className="hidden md:flex">
              <BreadcrumbLink asChild>
                <Link href={breadcrumb.href}>
                  {breadcrumb.label}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </div>
        ))}

        {breadcrumbs.length > 0 && <BreadcrumbSeparator className="hidden md:flex" />}

        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default SidebarBreadcrumb;