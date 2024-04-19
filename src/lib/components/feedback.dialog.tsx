/* eslint-disable max-len */
"use client";

import { Heart, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from "./ui/dialog";
import type { ReactElement } from "react";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { sendDiscordMessage } from "@/discord";
import Image from "next/image";

export const FeedbackDialog = (): ReactElement => {
  const [message, setMessage] = useState<{ title: string; message: string; email?: string }>({ title: "", message: "" });
  const [isSended, setIsSended] = useState<boolean>(false);

  return (
    <Dialog onOpenChange={() => {
      setMessage({
        title: "",
        message: "",
        email: ""
      });

      setIsSended(false);
    }}>
      <DialogTrigger>
        <Button variant={"outline"}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Feedback
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl p-0 overflow-hidden" black hiddenX>
        <div className="aspect-video relative flex items-center">
          <Image
            src={"/_static/feedback.png"}
            alt="Send feedback"
            fill
            quality={100}
            objectFit="cover"
          />
        </div>

        <div className="p-5">
          {isSended && (
            <Alert className="mb-3" variant={"rose"}>
              <Heart className="h-5 w-5 text-primary" />
              <AlertTitle>Feedback sent</AlertTitle>
              <AlertDescription>Thank you for your feedback. We will review it and make improvements.</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Title"
              onChange={(e) => setMessage({
                title: e.target.value,
                message: message.message
              })}
              disabled={isSended}
            />

            <Textarea
              placeholder="Your message..."
              disabled={isSended}
              onChange={(e) => setMessage({
                title: message.title,
                message: e.target.value
              })}
            />

            <Input
              type="text"
              placeholder="Email if you want a response (optional)"
              onChange={(e) => setMessage({
                title: message.title,
                message: message.message,
                email: e.target.value
              })}
              disabled={isSended}
            />
          </div>

          <DialogFooter className="mt-3">
            <Button
              disabled={
                isSended
                || message.title === ""
                || message.message === ""
                || message.title.length < 5
                || message.message.length < 10
              }
              onClick={() => {
                void sendDiscordMessage({
                  title: message.title,
                  message: message.message,
                  email: message.email
                });

                setIsSended(true);
              }}>
                Send feedback
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};