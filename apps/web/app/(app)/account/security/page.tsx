"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";

const AccountSecurityPage = () => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle></CardTitle>
            <CardDescription className="mt-1 text-sm"></CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
          </CardContent>
          
          <CardFooter className="flex justify-end">
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AccountSecurityPage;