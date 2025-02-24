"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Component } from "@workspace/ui/components/utils/component";
import { toast } from "@workspace/ui/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

type OrganizationSettingsSlugFormProps = {
  organizationId: string;
  initialSlug: string;
};

export const OrganizationSettingsSlugForm: Component<OrganizationSettingsSlugFormProps> = ({ organizationId, initialSlug }) => {
  const { refetch } = authClient.useActiveOrganization();

  const [slug, setSlug] = useState(initialSlug);
  const [pending, setPending] = useState(false);

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await authClient.organization.update({
      data: { slug },
      organizationId: organizationId,
      fetchOptions: {
        onRequest: () => setPending(true),
        onSuccess: () => {
          setPending(false);
          toast({
            title: "Organization slug updated",
            description: "Your organization slug has been updated successfully 🎉"
          })

          refetch();
        },
        onError: (error: any) => {
          setPending(false);
          toast({
            title: "Error updating organization slug",
            description: error.message || "An error occurred while updating your organization slug. Please try again later."
          })
        }
      }
    })
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Organization Slug</CardTitle>
          <CardDescription>The unique identifier for your organization</CardDescription>
        </CardHeader>

        <CardContent>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Enter organization name"
            className="w-72"
            disabled={pending}
          />
        </CardContent>

        <CardFooter vercelStyle>
          <p className="text-sm text-muted-foreground">Please use 32 characters at maximum.</p>
          <Button size={"sm"} type="submit" disabled={pending || slug === initialSlug || slug.length > 32 || slug.length < 1}>
            {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};