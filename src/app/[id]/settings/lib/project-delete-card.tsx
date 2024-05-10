"use client";

import { useState, type ReactElement } from "react";
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CustomCard } from "@/components/ui/custom-card";
import { useProjectStore } from "@/store/project.store";
import {
  AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteProject } from "../actions/delete";
import { Loader2 } from "lucide-react";

export const ProjectDeleteSettingsCard = (): ReactElement => {
  const { active, deleteActive } = useProjectStore();
  const [name, setName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!active) return <>An error occurred</>;

  return (
    <CustomCard noHover isDanger>
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>
          Here you can delete your project, this will permanently remove all data associated with this project so be careful.
        </CardDescription>
      </CardHeader>

      <CardFooter className="border-t px-6 py-4 justify-end border-destructive/55">
        <AlertDialog onOpenChange={(isOpen) => !isOpen && setName("")}>
          <AlertDialogTrigger>
            <Button type="submit" variant={"destructive"}>
              Delete Project
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogDescription>

            <div>
              <Label>Please type <strong>{active?.name}</strong> to confirm.</Label>
              <Input placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {error && <Label className="text-red-500">{error}</Label>}

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                disabled={name.trim() !== active?.name || isLoading}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={async() => {
                  setIsLoading(true);
                  const { success, message } = await deleteProject(active?.id);

                  if (success) {
                    setIsLoading(false);
                    setError(null);
                    deleteActive();
                  }

                  setError(message ?? "An error occurred");
                  setIsLoading(false);
                  setName("");
                }}>
                {isLoading && <Loader2 className="animate-spin mr-2" size={16} />}
                  Delete project
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </CustomCard>
  );
};