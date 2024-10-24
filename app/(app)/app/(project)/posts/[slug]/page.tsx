"use client";

import type { Component } from "@/components/component";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useBreadcrumbStore } from "@/hooks/use-breadcrumb";
import { Calendar, CalendarIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";

const Page: Component<{ params: { slug: string } }> = ({ params }) => {
  const setBreadcrumb = useBreadcrumbStore((state) => state.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb([
      { label: "Overview", href: "/app" },
      { label: "Posts", href: "/app/posts" }
    ], params.slug);
  }, [setBreadcrumb, params.slug]);

  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [publishDate, setPublishDate] = useState<Date>();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index: number): void => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <></>
  );
};

export default Page;