"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FaGoogle } from "react-icons/fa";
import { Fingerprint, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { signIn } from "@/lib/auth/client";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingSocial, setLoadingSocial] = useState<null | "passkey" | "github" | "google">(null);
  
  const router = useRouter();

  return (
    <div className="flex items-center justify-center mt-8">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="password"
                required
              />
            </div>

            <div className="flex items-center p-3 border rounded-md gap-1.5">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={() => setRememberMe(!rememberMe)}
                className="rounded-[5px]"
              />

              <Label htmlFor="rememberMe" className="text-sm">Remember me</Label>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              onClick={async () => {
                await signIn.email({
                    email: email,
                    password: password,
                    callbackURL: "/app",
                    dontRememberMe: !rememberMe,
                  }, {
                    onRequest: () => {
                      setLoading(true);
                    },
                    onResponse: () => {
                      setLoading(false);
                    },
                    onError: (ctx) => {
                      toast.error(ctx.error.message);
                    },
                  },
                );
              }}
            >
              {loading && loadingSocial === null ? <Loader2 size={16} className="animate-spin" /> : "Login"}
            </Button>

            <div className="flex items-center justify-center">
              <Separator className="w-[90%]" />
            </div>

            <div className="grid gap-2">
              <Button variant="outline" className="w-full"
                onClick={() => {
                  signIn.social({
                    provider: "github",
                    callbackURL: "/app"
                  }, {
                    onRequest: () => {
                      setLoading(true);
                      setLoadingSocial("github");
                    },
                    onError: (ctx) => {
                      toast.error(ctx.error.message);
                      setLoadingSocial(null);
                      setLoading(false);
                    },
                  });
                }}
                disabled={loading}
              >
                {loading && loadingSocial === "github" ? <Loader2 size={16} className="animate-spin" /> : <GitHubLogoIcon className="w-6 h-6" />}
                Login with GitHub
              </Button>

              <Button variant="outline" className="w-full"
                onClick={() => {
                  signIn.social({
                    provider: "google",
                    callbackURL: "/app"
                  }, {
                    onRequest: () => {
                      setLoading(true);
                      setLoadingSocial("google");
                    },
                    onError: (ctx) => {
                      toast.error(ctx.error.message);
                      setLoadingSocial(null);
                      setLoading(false);
                    },
                  });
                }}
                disabled={loading}
              >
                {loading && loadingSocial === "google" ? <Loader2 size={16} className="animate-spin" /> : <FaGoogle className="w-6 h-6" />}
                Login with Google
              </Button>

              <Button variant="outline" className="w-full"
                onClick={() => {
                  signIn.passkey({
                    autoFill: true,
                  }, {
                    onRequest: () => {
                      setLoading(true);
                      setLoadingSocial("passkey");
                    },
                    onResponse: (context) => {
                      if (context.response.ok) {
                        router.push("/app");
                      }
                    },
                    onError: (ctx) => {
                      toast.error(ctx.error.message);
                      setLoadingSocial(null);
                      setLoading(false);
                    },
                  });
                }}
                disabled={loading}
              >
                {loading && loadingSocial === "passkey" ? <Loader2 size={16} className="animate-spin" /> : <Fingerprint className="w-6 h-6" />}
                Login with Passkey
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center">
            <Separator className="w-[90%]" />
          </div>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page;