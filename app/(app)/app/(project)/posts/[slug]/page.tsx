"use client";

import { Component } from "@/components/component";
import { useBreadcrumbStore } from "@/hooks/use-breadcrumb";
import { useEffect } from "react";

const Page: Component<{ params: { slug: string } }> = ({ params }) => {
  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb([{ label: "Posts", href: '/app/posts' }], params.slug);
  }, [setBreadcrumb, params.slug]);

  return (
    <div className="container mx-auto p-4 mt-16">
      <h1>{params.slug}</h1>
    </div>
  )
}

export default Page;