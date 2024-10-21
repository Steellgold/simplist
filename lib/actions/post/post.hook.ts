import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getPost, getPosts } from "./post.action";
import { useActiveOrganization } from "@/lib/auth/client";

// Queries

export const getPostsQuery = (organizationId: string) => {
  return { queryKey: ["getLinks"], queryFn: () => getPosts(organizationId) } satisfies UseQueryOptions;
}

export const getPostQuery = (postId: string) => {
  return { queryKey: ["getLink"], queryFn: () => getPost(postId) } satisfies UseQueryOptions;
}

// Hooks

export const useGetPosts = () => {
  const { data: activeOrganization } = useActiveOrganization();
  const organizationId = activeOrganization?.id;
  
  return useQuery({...getPostsQuery(organizationId || ""), enabled: !!organizationId});
}


export const useGetPost = (postId: string) => {
  return useQuery(getPostQuery(postId));
}