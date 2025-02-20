"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Component } from "@workspace/ui/components/utils/component"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { PasswordInput } from "@workspace/ui/components/input-password"
import { OAuthsButtons } from "./oauths-buttons"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useToast } from "@workspace/ui/hooks/use-toast"
import { Fingerprint, Loader2 } from "lucide-react";
import { z } from "zod";
import { ToastAction } from "@workspace/ui/components/toast";
import { authClient } from "@/lib/auth-client";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { useIsPasskeyAvailable } from "@/hooks/use-passkey-avaible";

const schema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberme: z.string(),
})

export const LoginForm: Component<React.ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const { toast } = useToast();

	const [loading, setLoading] = useState(false);
  
  const [pkLoading, setPkLoading] = useState(false);

  const pkAvaible = useIsPasskeyAvailable();

  const router = useRouter();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your GitHub or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OAuthsButtons />
          
          <div className="my-3 relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>

          <form onSubmit={async(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            const formData = Object.fromEntries(new FormData(e.currentTarget).entries());
            const result = schema.safeParse(formData);

            if (!result.success) {
              toast({
                title: "Data validation error",
                description: "Please check the form fields and try again",
                action: <ToastAction altText="Try again">Try again</ToastAction>,      
              })
              return;
            }

            await authClient.signIn.email({
              email: result.data.email,
              password: result.data.password,
              rememberMe: result.data.rememberme === "on",
              callbackURL: "/",
              fetchOptions: {
                onResponse: () => {
                  setLoading(false);
                },
                onRequest: () => {
                  setLoading(true);
                },
                onError: (ctx) => {
                  toast({
                    title: "Error signing in",
                    description: ctx.error.message,
                    action: <ToastAction altText="Close">Close</ToastAction>,
                  })
                },
                onSuccess: async () => {
                  toast({
                    title: "Welcome back",
                    description: "You have successfully signed in to your account",
                    action: <ToastAction altText="Close">Close</ToastAction>,
                  });

                  router.push("/");
                },
              },
            });
          }}>
            <div className="grid gap-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" name="email" required />
                </div>

                <div className="grid gap-2">
                  <PasswordInput />
                </div>

                <div
                  className="flex items-center gap-2 p-3.5 rounded-md border border-border"
                  style={
                    {
                      "--primary": "47.9 95.8% 53.1%",
                      "--ring": "47.9 95.8% 53.1%"
                    } as React.CSSProperties
                  }
                >
                  <Checkbox id="rememberme" defaultChecked name="rememberme" />
                  <Label htmlFor="rememberme">Remember me on this device</Label>
                </div>

                <div className="grid gap-2 grid-cols-12">
                  <Button type="submit" className={cn({
                    "w-full col-span-10": pkAvaible,
                    "w-full col-span-12": !pkAvaible
                  })} disabled={loading}>
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Continue"}
                  </Button>

                  {pkAvaible && (
                    <Button
                      type="button"
                      variant="secondary"
                      className="col-span-2"
                      disabled={pkLoading}
                      onClick={
                        async() => {
                          await authClient.signIn.passkey({
                            fetchOptions: {
                              onSuccess: () => {
                                console.log("Successfully signed in using Passkey");
                                router.push("/");
                                toast({
                                  title: "Welcome back",
                                  description: "You have successfully signed in to your account using Passkey"
                                });
                              },
                              onError: (ctx) => {
                                toast({
                                  title: "Error signing in",
                                  description: ctx.error.message,
                                  action: <ToastAction altText="Close">Close</ToastAction>,
                                })

                                setPkLoading(false);
                              },
                              onRequest: () => {
                                setPkLoading(true);
                              },
                            }
                          })
                        }
                      }
                    >
                      {
                        pkLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Fingerprint className="w-6 h-6" />
                      }
                    </Button>
                  )}
                </div>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/auth/register" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}