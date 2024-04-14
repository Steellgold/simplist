/* eslint-disable max-len */
"use client";

import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "./ui/dialog";
import type { Component } from "./utils/component";
import { useState, useTransition, type PropsWithChildren } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { ProjectSchema, createProject } from "@/actions/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type NewProjectDialogProps = { isFirst: boolean } & PropsWithChildren;

export const NewProjectDialog: Component<NewProjectDialogProps> = ({ isFirst, children }) => {
  const [error, setError] = useState<{ title: string; message: string; isSuccess: boolean }>({ title: "", message: "", isSuccess: false });
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: { name: "" }
  });

  const onSubmit = (values: z.infer<typeof ProjectSchema>): void => {
    setError({ title: "", message: "", isSuccess: false });

    console.log("bbb", values);
    startTransition(() => {
      void createProject(values)
        .then((data) => {
          console.log(data);
        })
        .catch(() => setError({ title: "Error", message: "An error occurred!", isSuccess: false }));
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-xl p-0 overflow-hidden" black hiddenX>
        <div className="p-5">
          <h2 className="text-2xl font-semibold">Create your {isFirst ? "first " : "next "}project</h2>
          <p className="text-muted-foreground mt-2">
            {isFirst ? "Create your first project and start posting content." : "Create your next project and start posting content."}
          </p>

          {error.title && error.message && (
            <p className={`mt-2 text-${error.isSuccess ? "green-500" : "red-500"}`}>
              {error.title}: {error.message}
            </p>
          )}

          <Form {...form}>
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
                <Button variant={"default"} disabled={isPending} size={"sm"}>
                  Create Project
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};