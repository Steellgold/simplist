import { headers } from "next/headers";
import { auth } from "./auth";
import { Permissions } from "./permissions";
import { unauthorized } from "next/navigation";

interface CheckPermissionParams {
  permission: Permissions;
  organizationId: string;
}

const checkPermission = async ({ permission, organizationId }: CheckPermissionParams) => {
  const hasPermission = await auth.api.hasPermission({
    body: {
      permission,
      organizationId,
    },
    headers: await headers(),
  });

  if (hasPermission.error) {
    unauthorized();
  }
};

export default checkPermission;
