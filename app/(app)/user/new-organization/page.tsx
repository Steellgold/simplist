"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { client } from "@/lib/auth/client";
import { useState } from "react";

const Page = () => {
  const [organizationName, setOrganizationName] = useState("");

  return (
    <div className="flex items-center justify-center mt-8">
      <Card className="mx-auto w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">New organization</CardTitle>
          <CardDescription>
            Create a new organization to start using the platform.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Label htmlFor="organization-name">Organization name</Label>
          <Input id="organization-name" value={organizationName} onChange={e => setOrganizationName(e.target.value)} />
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button onClick={async () => {
            const creation = await client.organization.create({
              name: organizationName,
              slug: Math.random().toString(36).substring(2, 8)
            });

            if (creation) {
              alert("Organization created successfully!");
            }

            alert("Failed to create organization.");
          }}>
            Create
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Page;