import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getPost, getPosts } from "./post.action";
import type { GetPostType } from "./post.types";

// Queries

export const getPostsQuery = (): UseQueryOptions<GetPostType[]> => {
  return { queryKey: ["getPosts"], queryFn: () => getPosts() } satisfies UseQueryOptions;
};

export const getPostQuery = (postId: string): UseQueryOptions<GetPostType> => {
  return { queryKey: ["getPost"], queryFn: () => getPost(postId) } satisfies UseQueryOptions;
};

// Hooks

export const useGetPosts = (): ReturnType<typeof useQuery<GetPostType[]>> => {
  return useQuery(getPostsQuery());
};


export const useGetPost = (postId: string): ReturnType<typeof useQuery<GetPostType>> => {
  return useQuery(getPostQuery(postId));
};