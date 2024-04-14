import type { ReactElement } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { CircleUser, Menu, Search } from "lucide-react";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { createClient } from "@/utils/supabase/server";
import { ButtonGitHub, ButtonLogout } from "./button.github";
import Image from "next/image";
import { SidebarLinks } from "./links";

export const Appbar = async(): Promise<ReactElement> => {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  console.log("user", user);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <SidebarLinks type="sidebar-mobile" />
          </nav>
        </SheetContent>
      </Sheet>
      {user ? (
        <>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                {user.user_metadata.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url as string}
                    alt="User avatar"
                    className="h-8 w-8 rounded-full"
                    width={32}
                    height={32}
                  />
                ) : (
                  <CircleUser className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <ButtonLogout />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <div className="w-full flex-1"></div>
          <ButtonGitHub />
        </>
      )}
    </header>
  );
};