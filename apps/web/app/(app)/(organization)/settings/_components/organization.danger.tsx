"use client";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { ReactElement, useState } from "react";
import { Trash2 } from "lucide-react";
import { PasswordConfirmationDialog } from "@/components/password-confirmation-dialog";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "@workspace/ui/hooks/use-toast";
import { useRouter } from "next/navigation";

export const OrganizationSettingsDeleteForm = (): ReactElement => {
  const { data, refetch, isPending, isRefetching } = authClient.useActiveOrganization();
  const [isDeleting, setDeleting] = useState(false);

  const router = useRouter();

  if (isPending || isRefetching || isDeleting || !data) {
    return (
      <Skeleton className="h-full" />
    )
  }

  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="text-red-600">Delete Organization</CardTitle>
        <CardDescription>
          All data associated with this organization will be permanently deleted and cannot be recovered.
        </CardDescription>
      </CardHeader>

      <CardFooter vercelStyle right>
        <PasswordConfirmationDialog
          action={async() => {
            await authClient.organization.delete({
              organizationId: data?.id,
              fetchOptions: {
                onRequest: () => {
                  setDeleting(true);
                  toast({
                    title: "Deleting organization...",
                    description: "Request to delete organization has been sent."
                  })
                },
                onError: (error) => {
                  setDeleting(false);
                  toast({
                    title: "Failed to delete organization",
                    description: error.error.message ?? "An error occurred while deleting organization.",
                    variant: "destructive"
                  })
                },
                onSuccess: () => {
                  setDeleting(false);
                  toast({
                    title: "Organization deleted",
                    description: "Organization has been successfully deleted."
                  })

                  refetch();
                  router.push("/");
                }
              }
            })
          }}
          additionalRewrite={data?.name}
          actionType="delete"
        >
          <Button
            type="submit"
            variant="destructive"
            className="flex items-center gap-2"
            size="sm"
          >
            <Trash2 className="h-4 w-4" />
            Delete Organization
          </Button>
        </PasswordConfirmationDialog>
      </CardFooter>
    </Card>
  );
};