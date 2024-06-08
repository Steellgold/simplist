"use client";

import { useState, type ReactElement } from "react";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomCard } from "@/components/ui/custom-card";
import { updateName } from "../actions/name";
import { useProjectStore } from "@/store/project.store";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const ProjectNameSettingsCard = (): ReactElement => {
  const { active, updateActive } = useProjectStore();
  const [name, setName] = useState<string>(active?.name ?? "");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!active) return <>An error occurred</>;

  return (
    <CustomCard noHover active>
      <CardHeader>
        <CardTitle>Project Name</CardTitle>
        <CardDescription>
          Here you can change the name of your project, this will be used to identify your project in your dashboard.
        </CardDescription>
      </CardHeader>

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={async(e) => {
        e.preventDefault();
        if (!(/^[a-zA-Z0-9]+$/).test(name)) return setError("Project name can only contain letters and numbers");
        if (name.length > 15) return setError("Project name can be at most 15 characters long");
        if (name.length < 3) return setError("Project name must be at least 3 characters long");

        toast.info("Updating project name...");

        setIsLoading(true);
        setError(null);
        const { success, message } = await updateName(active?.id, name.trim().replace(/ /g, ""));
        if (success) updateActive({ id: active?.id, name });
        else setError(message ?? "An error occurred");

        toast.success("Project name updated successfully");
        setIsLoading(false);
      }}>
        <CardContent>
          <Input placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
          {error && <Label className="text-red-500">{error}</Label>}
        </CardContent>

        <CardFooter className="border-t px-6 py-4 justify-end">
          <Button type="submit" disabled={
            isLoading || name.trim() === active?.name || name.trim().length === 0
          }>
            {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
            Save
          </Button>
        </CardFooter>
      </form>
    </CustomCard>
  );
};