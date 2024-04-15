import type { ReactElement } from "react";
import type { Component } from "./utils/component";

type Props = {
  replacePageTo?: string;
};

export const NotFound: Component<Props> = ({ replacePageTo }) => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">
        {replacePageTo ? `${replacePageTo.charAt(0).toUpperCase()}${replacePageTo.slice(1)} not found` : "Page not found"}
      </h3>
      <p className="text-sm text-muted-foreground">
        The {replacePageTo ? replacePageTo : "page"} you are looking for does not exist.
      </p>
    </div>
  );
};

export const AccessDenied: Component<Props> = ({ replacePageTo }) => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">
        Access denied
      </h3>
      <p className="text-sm text-muted-foreground">You do not have permission to view this {replacePageTo ? replacePageTo : "page"}.</p>
    </div>
  );
};

export const ServerError = (): ReactElement => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">
        Server error
      </h3>
      <p className="text-sm text-muted-foreground">An unexpected error occurred. Please try again later.</p>
    </div>
  );
};

export const NotLogged: Component<Props> = ({ replacePageTo }) => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">
        You are not logged in
      </h3>
      <p className="text-sm text-muted-foreground">You need to be logged in to view this {replacePageTo ? replacePageTo : "page"}.</p>
    </div>
  );
};