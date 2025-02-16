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
import { PasswordInputRequirements } from "@workspace/ui/components/requirements-input-password"
import { useToast } from "@workspace/ui/hooks/use-toast";
import { OAuthsButtons } from "./oauths-buttons"
import { z } from "zod"
import { ToastAction } from "@workspace/ui/components/toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const schema = z.object({
  firstName: z.string(),
  lastName: z.string(),

  email: z.string().email(),
  password: z.string()
})

export const RegisterForm: Component<React.ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => {
  const { toast } = useToast();

  const [form, setForm] = useState<"user" | "organization">("user");

	const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (form === "organization") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create an organization</CardTitle>
            <CardDescription>Set up your organization</CardDescription>
          </CardHeader>
          <CardContent>
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

              router.push("/");
            }}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" placeholder="My organization" required name="name" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input id="slug" type="text" placeholder="my-organization" required name="slug" />
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Create organization"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
          By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Sign up with your email or use a social account</CardDescription>
        </CardHeader>
        <CardContent>
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

            await authClient.signUp.email({
              email: result.data.email,
              password: result.data.password,
              name: `${result.data.firstName} ${result.data.lastName}`,
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
                    title: "Error",
                    description: ctx.error.message,
                    action: <ToastAction altText="Close">Close</ToastAction>,
                  })
                },
                onSuccess: async () => {
                  toast({
                    title: "Account created",
                    description: "Now you can create your organization"
                  })

                  setForm("organization");
                },
              },
            });
          }}>
            <div className="grid gap-6">
              <OAuthsButtons />
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">Or sign up with email</span>
              </div>
              <div className="grid gap-3">
                <div className="flex gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" type="text" placeholder="John" required name="firstName" />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" type="text" placeholder="Doe" required name="lastName" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required name="email" />
                </div>
                
                <PasswordInputRequirements  />
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Create an account"
                  )}
                </Button>
              </div>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/auth" className="underline underline-offset-4">
                  Log in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}