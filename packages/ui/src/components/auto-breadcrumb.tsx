"use client";

import React, { useContext } from "react";
import { BreadcrumbContext } from "@workspace/ui/contexts/breadcrumb-context";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@workspace/ui/components/breadcrumb";
import { Skeleton } from "@workspace/ui/components/skeleton";
// @ts-ignore
import Link from "next/link";

interface BreadcrumbProps {
  className?: string;
}

export const AutoBreadcrumb: React.FC<BreadcrumbProps> = ({ className }) => {
  const context = useContext(BreadcrumbContext);
  
  if (!context) {
    throw new Error("Breadcrumb must be used within a BreadcrumbProvider");
  }

  const { items } = context;

  if (!items || items.length === 0) return (
    <>
      <Skeleton className="w-[70px] h-6" />
      <Skeleton className="w-[20px] h-5" />
      <Skeleton className="w-[70px] h-6" />
    </>
  );

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem className={isLast ? "" : "hidden md:block"}>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink>{item.label}</BreadcrumbLink>
                  )
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}