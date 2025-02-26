"use client";

import { useContext, useEffect } from "react";
import { BreadcrumbItem } from "@workspace/ui/types/breadcrumb.types";
import { BreadcrumbContext } from "@workspace/ui/contexts/breadcrumb-context";

export function useBreadcrumb(items: (string | BreadcrumbItem)[]) {
  const context = useContext(BreadcrumbContext);
  
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }

  const { setItems } = context;

  useEffect(() => {
    const formattedItems: BreadcrumbItem[] = items.map(item => 
      typeof item === "string" ? { label: item } : item
    );
    
    setItems(formattedItems);
    
    return () => setItems([]);
  }, [setItems, items]);
}