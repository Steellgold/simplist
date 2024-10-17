"use client";

import { ReactElement } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { CircleUser, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signOut } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

export const UserDropdown = (): ReactElement => {
  const { data, isPending } = useSession();

  const router = useRouter();

  const handleSignOut = async (event: React.FormEvent) => {
    event.preventDefault();
    await signOut();
    router.refresh();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full h-8 w-8" disabled={isPending}>
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {!isPending && data?.user.image && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={data.user.image} />
              <AvatarFallback>{data.user.name}</AvatarFallback>
            </Avatar>
          ) }

          {!isPending && !data?.user.image && <CircleUser className="h-4 w-4" />}
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{data?.user.name}</DropdownMenuLabel>
        <DropdownMenuLabel className="text-muted-foreground font-normal -mt-3 text-xs">{data?.user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}