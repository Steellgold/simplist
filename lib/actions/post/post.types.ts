import type { Prisma } from "@prisma/client";

export const GetPost = {
  include: {
    categories: {
      select: {
        name: true,
        id: true
      }
    },
    tags: {
      select: {
        name: true,
        color: true,
        id: true
      }
    },
    comments: {
      select: {
        name: true,
        content: true,
        createdAt: true,
        id: true
      }
    }
  }
};

export type GetPostType = Prisma.PostGetPayload<typeof GetPost>;