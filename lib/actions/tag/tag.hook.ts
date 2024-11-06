import type { UseQueryOptions } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import type { GetTagType } from "./tag.types";
import { getTag, getTags } from "./tag.action";

// Queries

export const getTagsQuery = (): UseQueryOptions<GetTagType[]> => {
  return { queryKey: ["getTags"], queryFn: () => getTags() } satisfies UseQueryOptions;
};

export const getTagQuery = (tagId: string): UseQueryOptions<GetTagType | null> => {
  return { queryKey: ["getTag", tagId], queryFn: () => getTag(tagId) } satisfies UseQueryOptions;
};

// Hooks

export const useGetTags = (): ReturnType<typeof useQuery<GetTagType[]>> => {
  return useQuery(getTagsQuery());
};

export const useGetTag = (tagId: string): ReturnType<typeof useQuery<GetTagType | null>> => {
  return useQuery(getTagQuery(tagId));
};