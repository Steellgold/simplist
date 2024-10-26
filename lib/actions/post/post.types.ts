import type { Prisma } from "@prisma/client";

export const GetPost = {
  include: {
    categories: {
      select: {
        name: true,
        id: true
      }
    },
    author: {
      select: {
        id: true,
        email: true
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
    },
    files: {
      select: {
        name: true,
        url: true,
        isBanner: true,
        authorId: true,
        mimeType: true,
        size: true,
        createdAt: true,
        id: true
      }
    },
    variants: {
      select: {
        title: true,
        content: true,
        excerpt: true,
        id: true,
        lang: true
      }
    }
  }
};

export type GetPostType = Prisma.PostGetPayload<typeof GetPost>;