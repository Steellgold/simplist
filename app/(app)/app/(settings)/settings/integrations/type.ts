import type { Integration } from "@/lib/integrations";

export type ConfigurationProps = {
  integration: Integration;
  isNew?: boolean;

  onCanceled?: () => void;
  onSaved?: () => void;
};