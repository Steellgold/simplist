"use client";

import Link from "next/link";
import type { ReactElement } from "react";
import { useProjectStore } from "@/store/project.store";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export const SidebarHeader = (): ReactElement => {
  const { active, projects, setActive } = useProjectStore();
  const url = usePathname();
  const router = useRouter();

  if (!active || url === "/") return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 select-none">
      <Link href="/">
        <Image src="/_static/logos/simplist-light.png" alt="Logo" width={120} height={17.81} />
      </Link>
    </div>
  );

  return (
    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 select-none">
      <Link href="/">
        <Image src="/_static/logos/simple-light.png" alt="Logo" width={20} height={17.81} />
      </Link>

      <span className="text-muted-foreground/80 mx-2 lg:mx-4 select-none">/</span>

      <Select defaultValue={active.id} onValueChange={(value) => {
        router.push(url.replace(active.id, value));
        setActive(value);
      }}>
        <SelectTrigger className="items-center border-b px-4 lg:px-6">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};