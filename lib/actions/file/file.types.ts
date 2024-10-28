import type { Prisma } from "@prisma/client";

export const GetFile = {
  include: {
    posts: {
      select: {
        id: true
      }
    },
    variants: {
      select: {
        id: true
      }
    },
    member: {
      select: {
        id: true
      }
    }
  }
};

export type GetFileType = Prisma.FileGetPayload<typeof GetFile>;