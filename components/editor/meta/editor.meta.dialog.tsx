"use client";

import type { Component } from "@/components/component";
import type { Metadata, MetaType } from "../editor.types";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { nanoid } from "nanoid";

type MetadataDialogModalProps = {
  metadata?: Metadata;
  edit?: boolean;

  onAdd?: (meta: Metadata) => void;
  onEdit?: (meta: Metadata) => void;
}

export const MetadataDialogModal: Component<MetadataDialogModalProps & PropsWithChildren> = ({ children, metadata, edit, onAdd, onEdit }) => {
  const [key, setKey] = useState<string>("");
  const [type, setType] = useState<MetaType>("string");
  const [value, setValue] = useState<string | number | boolean>("");

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const clearInputs = (): void => {
    setKey("");
    setType("string");
    setValue("");
  };

  useEffect(() => {
    if (edit && metadata) {
      setKey(metadata.key);
      setType(metadata.type);
      setValue(metadata.value);
    }
  }, [edit, metadata]);

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select a Metadata Type</DialogTitle>
          <DialogDescription>Choose a metadata type to add to the post.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <Label>Key</Label>
            <Input value={key} onChange={(e) => setKey(e.target.value)} />
          </div>

          <div className="flex flex-col gap-4">
            <Label>Type</Label>
            <Select defaultValue={type} onValueChange={(e: string) => {
              setType(e as MetaType);
              setValue("");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a metadata type" />
              </SelectTrigger>
              <SelectContent>
                {["string", "number", "boolean", "date", "time", "datetime"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="valueInput">Value</Label>

          {type == "string" && (
            <Input id="valueInput" value={value as string} onChange={(e) => setValue(e.target.value)} placeholder="Enter a string" />
          )}

          {type == "number" && (
            <Input
              id="valueInput"
              type="number"
              value={value as number}
              onChange={(e) => setValue(Number(e.target.value))}
              placeholder="Enter a number"
            />
          )}

          {type == "boolean" && (
            <Select defaultValue={value as string} onValueChange={(e: string) => setValue(e)}>
              <SelectTrigger id="valueInput">
                <SelectValue placeholder="Select a boolean value" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          )}

          {type == "date" && (
            <Input
              id="valueInput"
              type="date"
              value={value as string}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a string"
            />
          )}

          {type == "time" && (
            <Input
              id="valueInput"
              type="time"
              value={value as string}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a string"
            />
          )}

          {type == "datetime" && (
            <Input
              id="valueInput"
              type="datetime-local"
              value={value as string}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter a string"
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={() => {
            if (!key || !value) {
              toast.error("Key and value are required.");
              return;
            }

            if (edit && metadata) {
              onEdit?.({ id: metadata.id, key, type, value });
              toast.success("Metadata updated successfully.");
            } else {
              if (!onAdd) return;
              onAdd({ id: nanoid(), key, type, value });
              toast.success("Metadata added successfully.");
            }

            setIsOpen(false);
            clearInputs();
          }}>
            {edit ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};