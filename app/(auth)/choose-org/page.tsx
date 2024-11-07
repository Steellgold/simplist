"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { client, useListOrganizations } from "@/lib/auth/client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type ReactElement } from "react";

const Page = (): ReactElement => {
  const { data, isPending } = useListOrganizations();

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="flex items-center justify-center mt-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Choose an organization</CardTitle>
          <CardDescription>
            Select an organization to continue to Simplist
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending || loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin w-6 h-6" />
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <div className="border rounded-lg">
                {data?.map((organization) => (
                  <div key={organization.id} className="flex items-center justify-between p-3 border-b last:border-b-0">
                    <div className="flex items-center gap-2">
                      {organization.logo ? (
                        <Image src={organization.logo} className="rounded-full" width={32} height={32} alt={organization.name} />
                      ) : (
                        <div className="w-5 h-5 rounded-sm bg-gray-200" />
                      )}
                      {organization.name}
                    </div>

                    <Button
                      onClick={() => {
                        client.organization.setActive(organization.id);
                        setLoading(true);
                        router.push("/app");
                      }}
                    >
                      Continue
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => {
                  setLoading(true);
                  router.push("/new-organization");
                }}
                variant="outline"
              >
                Create a new organization
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;