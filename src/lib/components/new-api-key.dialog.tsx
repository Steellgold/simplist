/* eslint-disable max-len */
"use client";

import { Dialog, DialogContent, DialogFooter, DialogTrigger, DialogHeader, DialogDescription, DialogTitle } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger } from "./ui/alert-dialog";
import type { Component } from "./utils/component";
import { useState, useTransition, type PropsWithChildren } from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { APIKeySchema } from "@/schemas/project";
import { generateKey, deactivateKey } from "@/actions/keys";
import { Textarea } from "./ui/textarea";
import Confetti from "react-confetti";
import { useCopyToClipboard } from "usehooks-ts";
import { Ban, Copy, CopyCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

type NewKeyDialogProps = {
  projectId: string;
} & PropsWithChildren;

type DisableKeyDialogProps = {
  keyId: string;
  projectId: string;
} & PropsWithChildren;

export const NewKeyDialog: Component<NewKeyDialogProps> = ({ projectId, children }) => {
  const [_, setError] = useState<{ title: string; message: string; isSuccess: boolean }>({ title: "", message: "", isSuccess: false });
  const [apiKey, setAPIKey] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [copiedText, copy] = useCopyToClipboard();

  const form = useForm<z.infer<typeof APIKeySchema>>({
    resolver: zodResolver(APIKeySchema),
    defaultValues: { name: "", note: "", projectId }
  });

  const onSubmit = (values: z.infer<typeof APIKeySchema>): void => {
    setError({ title: "", message: "", isSuccess: false });

    startTransition(() => {
      void generateKey(values)
        .then((data) => {
          console.log(data);
          if ("key" in data) setAPIKey(data.key);
        });
    });
  };

  if (apiKey) {
    return (
      <>
        <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} />
        <AlertDialog open={apiKey !== ""}>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Created!</AlertDialogTitle>
              <AlertDialogDescription>
               Once you&apos;ve closed this dialog box, you won&apos;t be able to open it again, so make sure you&apos;ve copied and saved your API key.
              </AlertDialogDescription>

              <div className="mt-4 flex items-center space-x-2">
                <Input type="text" value={apiKey} readOnly className="w-full" />
                <Button variant="default" onClick={() => {
                  console.log(apiKey);
                  copy(apiKey)
                    .then(() => toast("API Key copied to clipboard"))
                    .catch(() => toast("Failed to copy API Key to clipboard"));
                }} size={"icon"}>
                  {copiedText ? <CopyCheck size={16} /> : <Copy size={16} />}
                </Button>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setAPIKey("")}>Close</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <Dialog onOpenChange={() => form.reset()}>
      <DialogTrigger>
        {children}
      </DialogTrigger>

      <Form {...form}>
        <DialogContent black hiddenX>
          <DialogHeader>
            <DialogTitle>Generate API Key</DialogTitle>
            <DialogDescription>
              After creating, you won&apos;t be able to see the secret key again. Make sure to copy and store it in a safe place.
            </DialogDescription>
          </DialogHeader>

          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-2 flex-col">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Name the API Key"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="note" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Note"
                      disabled={isPending}
                      style={{ resize: "none" }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <DialogFooter className="mt-3">
              <Button variant={"default"} disabled={isPending} type="submit">
                  Generate API Key
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
};

export const DisableKeyDialog: Component<DisableKeyDialogProps> = ({ keyId, projectId, children }) => {
  const [_, setError] = useState<{ title: string; message: string; isSuccess: boolean }>({ title: "", message: "", isSuccess: false });
  const [isPending, startTransition] = useTransition();

  const onSubmit = (): void => {
    setError({ title: "", message: "", isSuccess: false });

    startTransition(() => {
      void deactivateKey(keyId, projectId)
        .then((data) => {
          if (data === true) {
            toast("The API key has been successfully disabled");
          }
        });
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disable API Key</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to disable this API key? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={onSubmit} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" size={16} /> : <Ban size={16} />}&nbsp;
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};