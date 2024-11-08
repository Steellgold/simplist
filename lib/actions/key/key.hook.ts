import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";
import type { CreateKeyType, GetKeyType, InvalidateKeyType } from "./key.types";
import { createKey, getKeys, invalidateKey } from "./key.action";

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

export const useCreateKey = (): UseMutationResult<GetKeyType, unknown, CreateKeyType, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateKeyType) => createKey(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getKeys"] })
  });
};

export const useInvalidateKey = (): UseMutationResult<void, unknown, InvalidateKeyType, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InvalidateKeyType) => invalidateKey(data.key, data.secuValue),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getKeys"] })
  });
};