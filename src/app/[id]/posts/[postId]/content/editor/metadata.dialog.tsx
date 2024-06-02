import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomCard } from "@/components/ui/custom-card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Component } from "@/components/utils/component";
import type { Metadata } from "@/types";
import { ALargeSmall, Binary, Calendar, CalendarClock, Clock9, Pen, Plus, RotateCcw, ToggleLeft, Trash2 } from "lucide-react";
import { useState } from "react";
import { MetadataInput } from "./metadata.input";

type MetadataEditorProps = {
  metadatas: Metadata[];
  isLoading: boolean;
  onMetadataChange: (metadata: Metadata[]) => void;
};

export const MetadataEditor: Component<MetadataEditorProps> = ({ metadatas, onMetadataChange, isLoading }) => {
  const [activeMetadata, setActiveMetadata] = useState<Metadata | null>({
    key: "",
    type: "string",
    value: ""
  });

  const [ogMetadata] = useState<Metadata[]>(metadatas);
  const [metadata, setMetadata] = useState<Metadata[]>(metadatas);

  return (
    <CustomCard noHover>
      <CardHeader className="flex justify-between gap-2.5 flex-row">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Metadata</CardTitle>
          <CardDescription>Add custom metadata to this post will be returned on the response API.</CardDescription>
        </div>

        <div className="flex gap-1">
          <Button variant="outline" className="text-xs" onClick={() => {
            setMetadata(ogMetadata);
            onMetadataChange(ogMetadata);
          }}>
            <RotateCcw className="h-4 w-4" />&nbsp;Restore
          </Button>

          <Dialog onOpenChange={() => setActiveMetadata({ key: "", type: "string", value: "" })}>
            <DialogTrigger>
              <Button variant="outline" className="text-xs">
                <Plus className="h-3.5 w-3.5" />&nbsp;Add Metadata
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Metadata</DialogTitle>
                <DialogDescription>Add custom metadata to this post will be returned on the response API.</DialogDescription>
              </DialogHeader>

              <div className="gap-2 flex flex-col">
                <div className="flex flex-row gap-1.5 w-full">
                  <Input
                    placeholder="Key"
                    type="text"
                    onChange={(e) => {
                      setActiveMetadata({
                        key: e.target.value,
                        value: activeMetadata?.value || "",
                        type: activeMetadata?.type || "string"
                      });
                    }}
                  />

                  <Select
                    disabled={isLoading}
                    defaultValue="string"
                    onValueChange={(value: "string" | "number" | "boolean" | "date" | "time" | "datetime") => {
                      setActiveMetadata({
                        key: activeMetadata?.key || "",
                        type: value,
                        value: value === "boolean" ? false : ""
                      });
                    }}>
                    <SelectTrigger className="flex">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">
                        <div className="flex items-center gap-1">
                          <ALargeSmall className="h-4 w-4" />&nbsp;String
                        </div>
                      </SelectItem>

                      <SelectItem value="number">
                        <div className="flex items-center gap-1">
                          <Binary className="h-4 w-4" />&nbsp;Number
                        </div>
                      </SelectItem>

                      <SelectItem value="boolean">
                        <div className="flex items-center gap-1">
                          <ToggleLeft className="h-4 w-4" />&nbsp;Boolean
                        </div>
                      </SelectItem>

                      <SelectItem value="date">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />&nbsp;Date
                        </div>
                      </SelectItem>

                      <SelectItem value="time">
                        <div className="flex items-center gap-1">
                          <Clock9 className="h-4 w-4" />&nbsp;Time
                        </div>
                      </SelectItem>

                      <SelectItem value="datetime">
                        <div className="flex items-center gap-1">
                          <CalendarClock className="h-4 w-4" />&nbsp;Datetime
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <MetadataInput metadata={activeMetadata} onChange={setActiveMetadata} />
              </div>

              <DialogFooter>
                <Button
                  variant="default"
                  className="w-full"
                  disabled={
                    !activeMetadata?.key.match(/^[a-zA-Z0-9]/)
                    || activeMetadata?.value.toString().match(/^\s*$/) !== null
                    || metadata.find((m) => m.key === activeMetadata?.key) !== undefined
                    || isLoading
                  }
                  onClick={() => {
                    setMetadata([...metadata, activeMetadata as Metadata]);
                    onMetadataChange([...metadata, activeMetadata as Metadata]);
                  }}
                >
                Add Metadata
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {metadata.map(({ key, type }, index) => (
          <Alert className="justify-between items-center flex flex-row gap-2.5 p-3 rounded-md" key={index}>
            <div className="flex items-center gap-1.5">
              <Badge variant="default">
                {type === "string" && <><ALargeSmall className="h-4 w-4" />&nbsp;String</>}
                {type === "number" && <><Binary className="h-4 w-4" />&nbsp;Number</>}
                {type === "boolean" && <><ToggleLeft className="h-4 w-4" />&nbsp;Boolean</>}
                {type === "date" && <><Calendar className="h-4 w-4" />&nbsp;Date</>}
                {type === "time" && <><Clock9 className="h-4 w-4" />&nbsp;Time</>}
                {type === "datetime" && <><CalendarClock className="h-4 w-4" />&nbsp;Datetime</>}
              </Badge>
              {key}
            </div>

            <div className="flex gap-2.5">
              <Dialog onOpenChange={() => setActiveMetadata(metadata.find((m) => m.key === key) || null)}>
                <DialogTrigger>
                  <Button variant="outline" size={"sm"} className="text-xs">
                    <Pen className="h-3.5 w-3.5" />&nbsp;Edit
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Metadata</DialogTitle>
                    <DialogDescription>Edit custom metadata to this post will be returned on the response API.</DialogDescription>
                  </DialogHeader>

                  <div className="gap-2 flex flex-col">
                    <div className="flex flex-row gap-1.5 w-full">
                      <Input
                        placeholder="Key"
                        type="text"
                        value={activeMetadata?.key}
                        onChange={(e) => {
                          setActiveMetadata({
                            key: e.target.value,
                            value: activeMetadata?.value || "",
                            type: activeMetadata?.type || "string"
                          });
                        }}
                      />

                      <Select
                        disabled={isLoading}
                        defaultValue={activeMetadata?.type}
                        onValueChange={(value: "string" | "number" | "boolean" | "date" | "time" | "datetime") => {
                          setActiveMetadata({
                            key: activeMetadata?.key || "",
                            type: value,
                            value: value === "boolean" ? false : ""
                          });
                        }}>
                        <SelectTrigger className="flex">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string">
                            <div className="flex items-center gap-1">
                              <ALargeSmall className="h-4 w-4" />&nbsp;String
                            </div>
                          </SelectItem>

                          <SelectItem value="number">
                            <div className="flex items-center gap-1">
                              <Binary className="h-4 w-4" />&nbsp;Number
                            </div>
                          </SelectItem>

                          <SelectItem value="boolean">
                            <div className="flex items-center gap-1">
                              <ToggleLeft className="h-4 w-4" />&nbsp;Boolean
                            </div>
                          </SelectItem>

                          <SelectItem value="date">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />&nbsp;Date
                            </div>
                          </SelectItem>

                          <SelectItem value="time">
                            <div className="flex items-center gap-1">
                              <Clock9 className="h-4 w-4" />&nbsp;Time
                            </div>
                          </SelectItem>

                          <SelectItem value="datetime">
                            <div className="flex items-center gap-1">
                              <CalendarClock className="h-4 w-4" />&nbsp;Datetime
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <MetadataInput metadata={activeMetadata} onChange={setActiveMetadata} />
                  </div>

                  <DialogFooter>
                    <Button
                      variant="default"
                      className="w-full"
                      disabled={
                        !activeMetadata?.key.match(/^[a-zA-Z0-9]/)
                        || activeMetadata?.value.toString().match(/^\s*$/) !== null
                        || metadata.find((m) => m.key === activeMetadata?.key) !== undefined
                        || isLoading
                      }
                      onClick={() => {
                        setMetadata(metadata.map((m) => m.key === key ? activeMetadata as Metadata : m));
                        onMetadataChange(metadata.map((m) => m.key === key ? activeMetadata as Metadata : m));
                      }}
                    >
                    Edit Metadata
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size={"sm"} className="text-xs" onClick={() => {
                setMetadata(metadata.filter((m) => m.key !== key));
                onMetadataChange(metadata.filter((m) => m.key !== key));
              }}>
                <Trash2 className="h-3.5 w-3.5" />&nbsp;Delete
              </Button>
            </div>
          </Alert>
        ))}

        {metadata.length === 0 && (
          <div className="flex gap-4">
            <p className="text-gray-400">No metadata added yet.</p>
          </div>
        )}
      </CardContent>
    </CustomCard>
  );
};