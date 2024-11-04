import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import type { Component } from "@/components/component";
import type { PropsWithChildren } from "react";

type MetadataDeleteAlertDialogProps = {
  onDelete: () => void;
} & PropsWithChildren;

export const MetadataDeleteAlertDialog: Component<MetadataDeleteAlertDialogProps> = ({ onDelete, children }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Metadata</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to delete this metadata?</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};