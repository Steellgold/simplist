"use client";

import { ImageUpload } from "@/components/image-uploader";
import { authClient } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Component } from "@workspace/ui/components/utils/component";
import { toast } from "@workspace/ui/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";

type OrganizationSettingsLogoFormProps = {
  organizationId: string;
  initialLogo: string;
};

export const OrganizationSettingsLogoForm: Component<OrganizationSettingsLogoFormProps> = ({ organizationId, initialLogo }) => {
  const { refetch } = authClient.useActiveOrganization();

  const [slug, setSlug] = useState(initialLogo);
  const [pending, setPending] = useState(false);

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitting form");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div className="space-y-1.5">
            <CardTitle>Organization Logo</CardTitle>
            <CardDescription>The logo for your organization that appears in the header</CardDescription>
          </div>

          <>
            <ImageUpload defaultImageUrl={initialLogo} />
          </>
        </CardHeader>

        <CardFooter vercelStyle>
          <p className="text-sm text-muted-foreground">
            An avatar is optional but strongly recommended to help if you have multiple organizations.
          </p>
          <Button size={"sm"} type="submit" disabled={pending}>
            {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};