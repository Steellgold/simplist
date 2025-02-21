"use client";

import { PasswordConfirmationDialog } from "@/components/password-confirmation-dialog";
import { authClient } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { BreadcrumbSetter } from "@workspace/ui/components/setter-breadcrumb";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "@workspace/ui/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

const userSchema = z.object({
  first_name: z.string()
    .min(2, {
      message: "The first name must be at least 2 characters long."
    })
    .max(75, {
      message: "The first name must be at most 75 characters long."
    })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/, {
      message: "The first name must only contain letters."
    }),
  last_name: z.string()
    .min(2, {
      message: "The last name must be at least 2 characters long."
    })
    .max(75, {
      message: "The last name must be at most 75 characters long."
    })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/, {
      message: "The last name must only contain letters."
    })
})


const AccountSettingsPage = () => {
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [isPending, setPending] = useState(false);

  const [formData, setFormData] = useState<z.infer<typeof userSchema>>({
    first_name: "",
    last_name: "",
  });

  useEffect(() => {
    if (!session) return;

    setFormData({
      first_name: session.user.name.split(' ')[0]!,
      last_name: session.user.name.split(' ')[1]!,
    });
  }, [session]);

  if (!session || isSessionPending) {
    return <Skeleton className="h-96" />;
  }

  const user = session.user;

  return (
    <>
      <BreadcrumbSetter items={[ { label: "Account" }, { label: "Settings" } ]} />
      
      <Card>
        <CardHeader>
          <CardTitle>Account information</CardTitle>
          <CardDescription className="mt-1 text-sm">
            Update your account information.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  name="ffirst-name"
                  defaultValue={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
              </div>
              
              <div className="flex-1">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  name="last-name"
                  defaultValue={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                disabled
              />
            </div>
          </div>
        </CardContent>
            
        <CardFooter className="flex justify-end">
          <PasswordConfirmationDialog action={() => {
            const result = userSchema.safeParse(formData);
              if (result.error) {
                toast({
                  title: "Oops!",
                  description: result.error.errors[0]?.message ?? "An error occurred",
                  variant: "destructive"
                })
                return;
              }

              authClient.updateUser({
                name: `${formData.first_name} ${formData.last_name}`,
                fetchOptions: {
                  onError: (error) => {
                    setPending(false);
                    toast({
                      title: "Error updating user",
                      description: error.error.message ?? "An error occurred",
                      variant: "destructive"
                    });
                  },
                  onRequest: () => {
                    setPending(true);
                    toast({
                      title: "Updating user",
                      description: "Please wait while we update your user"
                    });
                  },
                  onSuccess: () => {
                    setPending(false);
                    toast({
                      title: "User updated",
                      description: `You have successfully updated your user.`
                    });
                  }
                }
              });
            }}>
              <Button size="sm" disabled={
                isPending
                || (
                  formData.first_name === session.user.name.split(' ')[0] && formData.last_name === session.user.name.split(' ')[1]
                )
              }>
                {isPending
                  ? <Loader2 className="animate-spin" />
                  : "Save changes"
                }
              </Button>
            </PasswordConfirmationDialog>
          </CardFooter>
        </Card>

        {/* TODO: Avatar settings */}
    </>
  );
};

export default AccountSettingsPage;