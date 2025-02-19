"use client";

import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { RadioPlanSelector } from "@workspace/ui/components/radio-plan-selector"
import { Building, Loader2 } from "lucide-react"
import { PropsWithChildren, useState } from "react"
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "@workspace/ui/hooks/use-toast";
import { Component } from "@workspace/ui/components/utils/component";

export const NewOrganization: Component<PropsWithChildren> = ({ children }) => {
  const [plan, setPlan] = useState<"hobby" | "pro" | "business">("hobby");
  const [isPending, setPending] = useState(false);

  const router = useRouter();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent>
        <div className="mb-2 flex flex-col items-center gap-2">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border" aria-hidden="true">
            <Building className="h-5 w-5 text-primary" />
          </div>

          <DialogHeader>
            <DialogTitle className="sm:text-center">
              {isPending ? "Creating organization" : "Create a new organization"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-center">
              Organizations are a way to group your projects and teams together in one place.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={async (event) => {
          event.preventDefault();

          const organizationName = event.currentTarget["organization-name"].value;

          await authClient.organization.create({
            name: organizationName,
            slug: organizationName.toLowerCase().replace(/\s/g, "-"),
            metadata: {
              plan
            },
            fetchOptions: {
              onError: (error) => {
                setPending(false);
                toast({
                  title: "Error creating organization",
                  description: error.error.message || "An error occurred while creating the organization.",
                  variant: "destructive"
                })
              },
              onRequest: () => {
                setPending(true);
                toast({
                  title: "Creating organization",
                  description: "Please wait while we create your organization."
                })
              },
              onSuccess: async () => {
                toast({
                  title: "Organization created",
                  description: "Your organization has been created successfully.",
                })

                if (plan === "hobby") {
                  await authClient.organization.setActive({
                    organizationSlug: organizationName.toLowerCase().replace(/\s/g, "-"),
                    fetchOptions: {
                      onError: (error) => {
                        setPending(false);
                        toast({
                          title: "Error setting active organization",
                          description: error.error.message || "An error occurred while setting the active organization.",
                          variant: "destructive"
                        })
                      },
                      onRequest: () => {
                        setPending(true);
                        toast({
                          title: "Setting active organization",
                          description: "Please wait while we set your organization as active."
                        })
                      },
                      onSuccess: () => {
                        router.refresh();
                      }
                    }
                  })
                } else {
                  // createOrganization(formData);
                }
              }
            }
          })
        }}>
          <div className="space-y-2">
            <div className="relative">
              <Input
                id="organization-name"
                className="peer ps-9"
                placeholder="Organization Name"
                name="organization-name"
                type="text"
                aria-label="Organization Name"
              />

              <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                <Building size={16} strokeWidth={2} aria-hidden="true" />
              </div>
            </div>
          </div>

          <RadioPlanSelector onChange={(value: string) => setPlan(
            value === "1" ? "hobby" :
            value === "2" ? "pro" :
            "business"
          )} />

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? <Loader2 className="animate-spin" /> : (
              <>
                {
                  plan === "hobby" ? "Create organization" :
                  "Continue with" + (plan === "pro" ? " Pro" : " Business")
                }
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          By creating a organization, you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Terms of Service
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  )
}