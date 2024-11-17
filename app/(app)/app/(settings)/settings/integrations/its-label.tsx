import type { Component } from "@/components/component";
import { Label } from "@/components/ui/label";

export const IntegrationLabel: Component<{
  label: string;
  description?: string;
  forItem: string;
}> = ({ description, label, forItem }) => (
  <div className="flex flex-col gap-0.5">
    <Label htmlFor={forItem}>{label}</Label>
    {description && <p className="text-sm text-muted-foreground">{description}</p>}
  </div>
);