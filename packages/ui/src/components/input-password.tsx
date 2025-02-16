"use client";

import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

export const PasswordInput = () => {
  const id = useId();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="space-y-2">

      <div className="flex items-center">
        <Label htmlFor={id}>Password</Label>
        
        <a
          href="/auth/forgot-password"
          className="ml-auto text-sm underline-offset-4 hover:underline"
        >
          Forgot your password?
        </a>
      </div>

      <div className="relative">
        <Input
          id={id}
          className="pe-9"
          placeholder="Password"
          type={isVisible ? "text" : "password"}
        />
        <button
          className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          onClick={toggleVisibility}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          aria-controls="password"
        >
          {isVisible ? (
            <EyeOff size={16} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Eye size={16} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
