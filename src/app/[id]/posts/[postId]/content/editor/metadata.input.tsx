import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Component } from "@/components/utils/component";
import type { Metadata } from "@/types";

type MetadataInputProps = {
  metadata: Metadata | null;
  onChange: (metadata: Metadata) => void;
};

export const MetadataInput: Component<MetadataInputProps> = ({ metadata, onChange }) => {
  if (!metadata) return <></>;

  return <>
    {metadata?.type === "string" ? (
      <Input
        placeholder="Value"
        value={metadata?.value as string}
        onChange={(e) => onChange({ ...metadata, value: e.target.value })}
      />
    ) : metadata?.type === "number" ? (
      <Input
        placeholder="Value"
        type="number"
        value={metadata?.value as number}
        onChange={(e) => onChange({ ...metadata, value: Number(e.target.value) })}
      />
    ) : metadata?.type === "boolean" ? (
      <Select
        defaultValue={metadata?.value ? "true" : "false"}
        onValueChange={(value: "true" | "false") => {
          onChange({
            ...metadata,
            value: value === "true"
          });
        }}>

        <SelectTrigger className="flex">
          <SelectValue placeholder="Value" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="true">True</SelectItem>
          <SelectItem value="false">False</SelectItem>
        </SelectContent>
      </Select>
    ) : metadata?.type === "date" ? (
      <Input
        placeholder="Value"
        type="date"
        value={metadata?.value as string}
        onChange={(e) => onChange({ ...metadata, value: e.target.value })} />
    ) : metadata?.type === "time" ? (
      <Input
        placeholder="Value"
        type="time"
        value={metadata?.value as string}
        onChange={(e) => onChange({ ...metadata, value: e.target.value })} />
    ) : metadata?.type === "datetime" ? (
      <Input
        placeholder="Value" type="datetime-local"
        value={metadata?.value as string}
        onChange={(e) => onChange({ ...metadata, value: e.target.value })}
      />
    ) : null}
  </>;
};