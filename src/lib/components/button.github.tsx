"use client";

import { createClient } from "@/utils/supabase/client";
import type { ReactElement } from "react";
import { Button } from "./ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export const ButtonGitHub = (): ReactElement => {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { push } = useRouter();

  const signInWithGitHub = async(): Promise<void> => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_APP_URL,
        skipBrowserRedirect: true
      }
    });

    if (data) push(data.url!);
    if (error) console.error("Error signing in with GitHub", error);
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Button onClick={signInWithGitHub}>
      <GitHubLogoIcon className="h-5 w-5 mr-2" />
      Sign in with GitHub
    </Button>
  );
};

export const ButtonLogout = (): ReactElement => {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { refresh } = useRouter();

  const signOut = async(): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (!error) return refresh();
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <DropdownMenuItem onClick={signOut}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign out
    </DropdownMenuItem>
  );
};