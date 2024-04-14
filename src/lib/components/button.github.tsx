"use client";

import { createClient } from "@/utils/supabase/client";
import type { ReactElement } from "react";
import { Button } from "./ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";

export const ButtonGitHub = (): ReactElement => {
  const supabase = createClient();

  const signInWithGitHub = async(): Promise<void> => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github"
    });

    console.log("data", data);

    if (error) {
      console.error("Error signing in with GitHub", error);
    }
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

  const signOut = async(): Promise<void> => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <DropdownMenuItem onClick={signOut}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign out
    </DropdownMenuItem>
  );
};