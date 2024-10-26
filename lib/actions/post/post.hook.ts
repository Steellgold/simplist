import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPost, getPost, getPostBySlug, getPosts, updatePost } from "./post.action";
import type { UseMutationResult } from "@tanstack/react-query";
import type { GetPostType } from "./post.types";
import type { Prisma } from "@prisma/client";

// Queries

export const getPostsQuery = (): UseQueryOptions<GetPostType[]> => {
  return { queryKey: ["getPosts"], queryFn: () => getPosts() } satisfies UseQueryOptions;
};

export const getPostQuery = (by: "id" | "slug", postId: string): UseQueryOptions<GetPostType | null> => {
  return { queryKey: ["getPost", postId], queryFn: () => (by === "id" ? getPost(postId) : getPostBySlug(postId)) } satisfies UseQueryOptions;
};

// Hooks

export const useGetPosts = (): ReturnType<typeof useQuery<GetPostType[]>> => {
  return useQuery(getPostsQuery());
};

export const useGetPost = (postId: string, by: "id" | "slug"): ReturnType<typeof useQuery<GetPostType | null>> => {
  return useQuery(getPostQuery(by, postId));
};

// Mutations

export const useUpdatePost = (): UseMutationResult<unknown, unknown, { id: string; data: Prisma.PostUpdateInput }, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; data: Prisma.PostUpdateInput }) => updatePost(data.id, data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getPosts"] })
  });
};

export const useCreatePost = (): UseMutationResult<unknown, unknown, Prisma.PostCreateInput, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Prisma.PostCreateInput) => createPost(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getPosts"] })
  });
};