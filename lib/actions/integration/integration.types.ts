import type { Prisma } from "@prisma/client";

export const GetIntegration = {
  select: {
    credentials: true,
    type: true,
    id: true
  }
};

export type GetIntegrationType = Prisma.IntegrationGetPayload<typeof GetIntegration>;