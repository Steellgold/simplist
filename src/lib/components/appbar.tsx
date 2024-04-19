import type { ReactElement } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { CircleUser, Menu, Search } from "lucide-react";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { createClient } from "@/utils/supabase/server";
import { ButtonGitHub, ButtonLogout } from "./button.github";
import Image from "next/image";
import { SidebarLinks } from "./links";
import { FeedbackDialog } from "./feedback.dialog";

export const Appbar = async(): Promise<ReactElement> => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
            {/* <form action={async(e) => {
              "use server";

              // e is a FormData
              console.log("searching...", e.get("search"));

              const result = await db.post.findMany({
                where: {
                  title: {
                    contains: "search"
                  }
                }
              });

              console.log("result", result);
            }}> */}
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Search a post..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <FeedbackDialog />
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