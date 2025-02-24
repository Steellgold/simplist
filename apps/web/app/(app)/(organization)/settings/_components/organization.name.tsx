"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Component } from "@workspace/ui/components/utils/component";
import { toast } from "@workspace/ui/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

type OrganizationSettingsNameFormProps = {
  organizationId: string;
  initialName: string;
};

export const OrganizationSettingsNameForm: Component<OrganizationSettingsNameFormProps> = ({ organizationId, initialName }) => {
  const [name, setName] = useState(initialName);
  const [pending, setPending] = useState(false);

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await authClient.organization.update({
      data: { name: name },
      organizationId: organizationId,
      fetchOptions: {
        onRequest: () => setPending(true),
        onSuccess: () => {
          setPending(false);
          toast({
            title: "Organization name updated",
            description: "Your organization name has been updated successfully 🎉"
          })
        },
        onError: (error: any) => {
          setPending(false);
          toast({
            title: "Error updating organization name",
            description: error.message || "An error occurred while updating your organization name. Please try again later.",
          })
        }
      }
    })
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Organization Name</CardTitle>
          <CardDescription>The display name of your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter organization name"
            disabled={pending}
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button size={"sm"} type="submit" variant="secondary" disabled={pending}>
            {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Name"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};