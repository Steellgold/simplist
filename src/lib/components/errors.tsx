import type { ReactElement } from "react";

export const NotFound = (): ReactElement => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">
        Page not found
      </h3>
      <p className="text-sm text-muted-foreground">The page you are looking for does not exist.</p>
    </div>
  );
};

export const AccessDenied = (): ReactElement => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">
        Access denied
      </h3>
      <p className="text-sm text-muted-foreground">You do not have permission to view this page.</p>
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

export const NotLogged = (): ReactElement => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">
        You are not logged in
      </h3>
      <p className="text-sm text-muted-foreground">You need to be logged in to view this page.</p>
    </div>
  );
};