import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import type { GetKeyType } from "./key.types";
import { createKey, getKeys } from "./key.action";

// Queries

export const getKeysQuery = (): UseQueryOptions<GetKeyType[]> => {
  return {
    queryKey: ["getKeys"],
    queryFn: () => getKeys()
  } satisfies UseQueryOptions;
};

export const useGetKeys = (): ReturnType<typeof useQuery<GetKeyType[]>> => {
  return useQuery(getKeysQuery());
};

// Mutations

export const useCreateKey = (): UseMutationResult<unknown, unknown, unknown, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createKey(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getKeys"] })
  });
};