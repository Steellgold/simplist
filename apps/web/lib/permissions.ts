import { createAccessControl } from "better-auth/plugins/access";

type OrganizationPermissions = "update-name" | "update-logo" | "delete" | "view";
type ApiKeyPermissions = "create" | "delete";
type MemberPermissions = "invite" | "remove" | "view";
type PostPermissions = "create" | "update" | "delete";
type TagPermissions = "create" | "update" | "delete";
type CategoryPermissions = "create" | "update" | "delete";
type AnalyticsPermissions = "view" | "export";

type Permissions = {
  settings?: OrganizationPermissions[];
  apikeys?: ApiKeyPermissions[];
  members?: MemberPermissions[];
  posts?: PostPermissions[];
  tags?: TagPermissions[];
  categories?: CategoryPermissions[];
  analytics?: AnalyticsPermissions[];
};

const statement = {
  settings: ["update-name", "update-logo", "delete", "view"],
  apikeys: ["create", "delete"],
  members: ["invite", "remove", "view"],
  posts: ["create", "update", "delete"],
  tags: ["create", "update", "delete"],
  categories: ["create", "update", "delete"],
  analytics: ["view", "export"]
} as const;

const ac = createAccessControl(statement);

const member = ac.newRole({
  members: ["view"],
  posts: ["create"],
});

const editor = ac.newRole({
  members: ["view"],
  posts: ["create", "update"],
  tags: ["create", "update"],
  categories: ["create", "update"],
  analytics: ["view"]
});

const admin = ac.newRole({
  settings: ["update-name", "update-logo", "view"],
  apikeys: ["create", "delete"],
  members: ["view", "invite", "remove"],
  posts: ["create", "update", "delete"],
  tags: ["create", "update", "delete"],
  categories: ["create", "update", "delete"],
  analytics: ["view", "export"]
});

const owner = ac.newRole({
  ...admin.statements,
  settings: ["delete", "update-logo", "update-name", "view"]
});

export { ac, member, editor, admin, owner };
export type { Permissions };