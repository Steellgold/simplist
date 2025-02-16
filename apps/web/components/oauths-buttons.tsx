"use client";

import { Button } from "@workspace/ui/components/button"
import { GitHub } from "@workspace/ui/icons/github";
import { Google } from "@workspace/ui/icons/google";

export const OAuthsButtons = () => {
  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" className="w-full" onClick={(e) => {
        e.preventDefault()
        console.log("Sign up with GitHub");
      }}>
        <GitHub />
        Sign up with GitHub
      </Button>

      <Button variant="outline" className="w-full" onClick={(e) => {
        e.preventDefault()
        console.log("Sign up with Google");
      }}>
        <Google />
        Sign up with Google
      </Button>
    </div>
  )
}