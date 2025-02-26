"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button"
import { toast } from "@workspace/ui/hooks/use-toast";
import { GitHub } from "@workspace/ui/icons/github";
import { Google } from "@workspace/ui/icons/google";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export const OAuthsButtons = () => {
  const [loading, setLoading] = useState<"github" | "google" | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" className="w-full" onClick={async(e) => {
        e.preventDefault();
        await authClient.signIn.social({
          provider: "github",
          fetchOptions: {
            onRequest: () => setLoading("github"),
            onSuccess: () => setLoading(null),
            onError: (error) => {
              setLoading(null);
              toast({
                title: "Error signing in with GitHub",
                description: error.error.message || "An error occurred while signing in with GitHub",
                variant: "destructive"
              })
            }
          }
        })
      }} disabled={loading !== null}>
        {loading !== null && loading === "github" ? (
          <>
            <Loader2 className="animate-spin" />
            Signing up with GitHub...
          </>
        ) : (
          <>
            <GitHub />
            Sign up with GitHub
          </>
        )}
      </Button>

      <Button variant="outline" className="w-full" onClick={async(e) => {
        e.preventDefault();
        await authClient.signIn.social({
          provider: "google",
          fetchOptions: {
            onRequest: () => setLoading("google"),
            onSuccess: () => setLoading(null),
            onError: (error) => {
              setLoading(null);
              toast({
                title: "Error signing in with Google",
                description: error.error.message || "An error occurred while signing in with Google",
                variant: "destructive"
              })
            }
          }
        })
      }} disabled={loading !== null}>
        {loading !== null && loading === "google" ? (
          <>
            <Loader2 className="animate-spin" />
            Signing up with Google...
          </>
        ) : (
          <>
            <Google />
            Sign up with Google
          </>
        )}
      </Button>
    </div>
  )
}