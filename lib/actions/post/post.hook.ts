import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { getPost, getPosts } from "./post.action";
import { useActiveOrganization } from "@/lib/auth/client";
import type { GetPostType } from "./post.types";

// Queries

export const getPostsQuery = (organizationId: string): UseQueryOptions<GetPostType[]> => {
  return { queryKey: ["getLinks"], queryFn: () => getPosts(organizationId) } satisfies UseQueryOptions;
};

export const getPostQuery = (postId: string): UseQueryOptions<GetPostType> => {
  return { queryKey: ["getLink"], queryFn: () => getPost(postId) } satisfies UseQueryOptions;
};

// Hooks

export const useGetPosts = (): ReturnType<typeof useQuery<GetPostType[]>> => {
  const { data: activeOrganization } = useActiveOrganization();
  const organizationId = activeOrganization?.id;

  return useQuery({ ...getPostsQuery(organizationId || ""), enabled: !!organizationId });
};


export const useGetPost = (postId: string): ReturnType<typeof useQuery<GetPostType>> => {
  return useQuery(getPostQuery(postId));
};