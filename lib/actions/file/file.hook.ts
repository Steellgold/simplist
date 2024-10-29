import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { GetFileType } from "./file.types";
import { getFiles } from "./file.action";

// Queries

export const getFilesQuery = (): UseQueryOptions<GetFileType[]> => {
  return {
    queryKey: ["getFiles"],
    queryFn: () => getFiles()
  } satisfies UseQueryOptions;
};

export const useGetFiles = (): ReturnType<typeof useQuery<GetFileType[]>> => {
  return useQuery(getFilesQuery());
};