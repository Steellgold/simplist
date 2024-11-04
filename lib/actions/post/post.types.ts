import type { Prisma } from "@prisma/client";

export const GetPost = {
  include: {
    categories: {
      select: {
        name: true,
        id: true
      }
    },
    banner: {
      select: {
        id: true,
        url: true,
        name: true,
        size: true,
        mimeType: true,
        createdAt: true,
        memberId: true
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
    variants: {
      select: {
        title: true,
        content: true,
        excerpt: true,
        id: true,
        lang: true,
        banner: {
          select: {
            id: true,
            url: true,
            name: true,
            size: true,
            mimeType: true,
            createdAt: true,
            memberId: true
          }
        }
      }
    },
    meta: true
  }
};

export type GetPostType = Prisma.PostGetPayload<typeof GetPost>;