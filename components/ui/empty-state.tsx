import { ReactElement } from "react";
import { Component } from "../component";
import { PackageOpen } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactElement;
  actions: ReactElement[];
};

const EmptyState: Component<EmptyStateProps> = ({ title, description, actions, icon = <PackageOpen size={22} /> }) => (
  <div className="flex flex-col items-center justify-center space-y-4 bg-primary/10 dark:bg-primary/5 p-10 rounded-lg">
    <div className="flex items-center justify-center p-4 bg-primary/15 rounded-full">
      {icon}
    </div>

    <div className="flex flex-col items-center gap-0.5">
      <h2 className="text-lg font-semibold text-center text-foreground">{title}</h2>
      <p className="text-sm text-center text-foreground">{description}</p>
    </div>

    <div className="flex gap-2">
      {actions}
    </div>
  </div>
);

export { EmptyState };