"use client";

import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "./ui/dialog";
import type { Component } from "./utils/component";
import { useTransition, type PropsWithChildren } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { ProjectSchema } from "@/schemas/project";
import { createProject } from "@/actions/projects";
import { toast } from "sonner";

type NewProjectDialogProps = { isFirst: boolean } & PropsWithChildren;

export const NewProjectDialog: Component<NewProjectDialogProps> = ({ isFirst, children }) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: { name: "" }
  });

  const onSubmit = (values: z.infer<typeof ProjectSchema>): void => {
    startTransition(() => {
      void createProject(values)
        .then((data) => {
          if (data !== null) {
            if (data == undefined) toast.success("Successfully created, redirecting...");
            return;
          }

          const message = data ? "Project created successfully" : "Failed to create project, if the problem persists please contact support.";
          toast[data ? "success" : "error"](message);
        });
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>

      <Form {...form}>
        <DialogContent className="max-w-xl p-0 overflow-hidden" black hiddenX>
          <div className="p-5">
            <h2 className="text-2xl font-semibold">Create your {isFirst ? "first " : "next "}project</h2>
            <p className="text-muted-foreground mb-2">
              To get started, give your project a name.
            </p>

            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Project name"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <DialogFooter className="mt-3">
                <Button variant={"default"} disabled={isPending} type="submit">
                  Create Project
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Form>
    </Dialog>
  );
};