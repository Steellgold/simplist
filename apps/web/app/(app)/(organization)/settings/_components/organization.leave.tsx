"use client";
// TODO: Implement leave organization feature when Members feature is implemented

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { ReactElement } from "react";
import { Trash2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const OrganizationSettingsLeaveForm = (): ReactElement => {
  const { data, refetch, isPending, isRefetching } = authClient.useActiveOrganization();

  if (isPending || isRefetching) {
    return (
      <Skeleton className="h-full" />
    )
  }

  return (
    <form>
      <Card className="border-yellow-200/60 dark:border-yellow-500/60">
        <CardHeader>
          <CardTitle className="text-yellow-500">Leave Organization</CardTitle>
          <CardDescription>
            {
              data?.members.length === 1
                ? "If you want leave this organization transfer the ownership to another member or delete the organization."
                : "By leaving this organization, you will lose access to all of its resources and data."
            }
          </CardDescription>
        </CardHeader>

        <CardFooter vercelStyle right>
          <Button
            type="submit"
            variant="yellow"
            className="flex items-center gap-2"
            onClick={() => {
              if (data?.members.length === 1) return;
              refetch();
            }}
            size="sm"
            disabled={data?.members.length === 1}
          >
            <Trash2 className="h-4 w-4" />
            Leave Organization
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};