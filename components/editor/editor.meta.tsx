import { CirclePlus, XCircle, CaseSensitive, Binary, ToggleLeft, CalendarIcon, Clock, CalendarClock, Edit } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { EditorMetadataProps } from "./editor.types";
import type { Component } from "../component";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { dayJS } from "@/lib/day-js";
import { MetadataDeleteAlertDialog } from "./meta/editor.meta.delete";
import { MetadataDialogModal } from "./meta/editor.meta.dialog";
import type { MetaType } from "@prisma/client";

const TypeIcon: Component<{ type: MetaType }> = ({ type }) => (
  <>
    {type === "string" && <CaseSensitive size={14} />}
    {type === "number" && <Binary size={14} />}
    {type === "boolean" && <ToggleLeft size={14} />}
    {type === "date" && <CalendarIcon size={14} />}
    {type === "time" && <Clock size={14} />}
    {type === "datetime" && <CalendarClock size={14} />}
  </>
);

const TypeBackground: Component<{ type: MetaType, onlyIcon?: boolean }> = ({ type, onlyIcon = false }) => {
  if (onlyIcon) return <TypeIcon type={type} />;

  return (
    <div className={cn("rounded-sm flex items-center gap-2 p-2 w-[100px]")}>
      <TypeIcon type={type} />
      <span className="text-xs">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
    </div>
  );
};

export const EditorMeta: Component<EditorMetadataProps> = ({ setValues, activeIndex, postInfo }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Metadata{postInfo[activeIndex].metadatas.length > 1 && "s"}</CardTitle>
        <CardDescription>Add custom metadata to this post will be returned on the response API.</CardDescription>
      </div>

      <MetadataDialogModal onAdd={(meta) => {
        setValues([...postInfo[activeIndex].metadatas, meta]);
        console.log(meta);
        console.log(postInfo[activeIndex].metadatas);
      }}>
        <Button variant="outline">
          <CirclePlus size={24} />
          Add
        </Button>
      </MetadataDialogModal>
    </CardHeader>

    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Key</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {postInfo[activeIndex].metadatas.map((meta) => (
            <TableRow key={meta.id} className="group">
              <TableCell className="font-medium">{meta.key}</TableCell>
              <TableCell>
                <TypeBackground type={meta.type} />
              </TableCell>
              <TableCell>
                {
                  meta.type === "string"
                  && typeof meta.value === "string"
                  && <>
                    {meta.value.length > 30 ? meta.value.slice(0, 30) + "..." : meta.value}
                  </>
                }

                {meta.type === "number" && <>{meta.value}</>}

                {meta.type === "boolean" && <>{meta.value === "true" ? "True" : "False"}</>}
                {meta.type === "date" && typeof meta.value === "string" && <>{dayJS(meta.value).format("DD MMM YYYY")}</>}
                {meta.type === "time" && typeof meta.value === "string" && <>{dayJS(meta.value).format("HH:mm A")}</>}
                {meta.type === "datetime" && typeof meta.value === "string" && <>{dayJS(meta.value).format("DD MMM YYYY, HH:mm A")}</>}
              </TableCell>

              <TableCell className="text-right space-x-2">
                <MetadataDialogModal edit={true} metadata={meta} onEdit={(newMeta) => {
                  setValues(postInfo[activeIndex].metadatas.map((m) => m.id === meta.id ? newMeta : m));
                }}>
                  <Button variant="outline" size="icon">
                    <Edit />
                  </Button>
                </MetadataDialogModal>

                <MetadataDeleteAlertDialog onDelete={() => {
                  setValues(postInfo[activeIndex].metadatas.filter((m) => m.id !== meta.id));
                }}>
                  <Button variant="destructive" size="icon">
                    <XCircle />
                  </Button>
                </MetadataDeleteAlertDialog>
              </TableCell>
            </TableRow>
          ))}

          {postInfo[activeIndex].metadatas.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No metadata added.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);