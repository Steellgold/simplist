/* eslint-disable max-len */
"use client";

import { env } from "@/env.mjs";
import { cn } from "@/utils";
import { Folders, KeySquare, MessagesSquare, Settings2Icon, StickyNote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactElement } from "react";
import { Badge } from "./ui/badge";

type Link = {
  href: string;
  label: string;
  icon?: ReactElement;
  disabled?: boolean;
  isNew?: boolean;
}

const links: Link[] = [
  { href: "/[cuid]/posts", label: "Posts", icon: <StickyNote className="h-4 w-4" /> },
  { href: "/[cuid]/keys", label: "API Keys", icon: <KeySquare className="h-4 w-4" /> },
  { href: "/[cuid]/comments", label: "Comments", icon: <MessagesSquare className="h-4 w-4" />, isNew: true },
  { href: "/[cuid]/settings", label: "Settings", icon: <Settings2Icon className="h-4 w-4" /> }
];

const homeLink: Link[] = [{ href: "/", label: "Projects", icon: <Folders className="h-4 w-4" /> }];

const validLink = (link: string, cuid: string): string => {
  return link.replace("[cuid]", cuid);
};

type getSidebarLinksProps= {
  type: "sidebar-mobile" | "sidebar-desktop";
  user?: boolean;
}

export const SidebarLinks = ({ type }: getSidebarLinksProps): ReactElement => {
  const url = usePathname();
  const baseURL = env.NEXT_PUBLIC_APP_URL;
  const cuid = url.split("/")[1];

  if (url == "/") {
    return (
      <>
        {homeLink.map((link, index) => (
          <Link
            href={link.href}
            className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
            key={index}
            prefetch
          >
            {link.icon}
            {link.label}
            {link.isNew && <Badge>New</Badge>}
          </Link>
        ))}
      </>
    );
  }

  const getLinkStyle = (linkHref: string, type: "sidebar-mobile" | "sidebar-desktop"): string => {
    const resolvedLink = validLink(linkHref, cuid);
    const isBaseLink = resolvedLink === `/${cuid}`;
    const isActive = url === resolvedLink || (!isBaseLink && url.startsWith(resolvedLink + "/"));

    return cn({
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground": type === "sidebar-mobile" && isActive,
      "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary": type === "sidebar-desktop" && isActive,
      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground": type === "sidebar-mobile" && !isActive,
      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary": type === "sidebar-desktop" && !isActive
    });
  };

  return (
    <>
      {type === "sidebar-mobile" && (
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4" prefetch>
          <Image src="/_static/logos/simplist-light.png" alt="Simplist" width={120} height={17.81} />
        </Link>
      )}

      {links.map((link, index) => (
        <Link
          href={baseURL + "/" + validLink(link.href, cuid)}
          className={getLinkStyle(validLink(link.href, cuid), type)}
          key={index}
          prefetch
        >
          {link.icon}
          {link.label}
          {link.isNew && <Badge>New</Badge>}
        </Link>
      ))}
    </>
  );
};