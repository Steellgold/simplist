import type { UseQueryOptions } from "@tanstack/react-query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Prisma } from "@prisma/client";
import { createIntegration, deleteIntegration, getIntegration, getIntegrations } from "./integration.action";
import type { GetIntegrationType } from "./integration.types";

// Queries

export const getIntegrationsQuery = (): UseQueryOptions<GetIntegrationType[]> => {
  return { queryKey: ["getIntegrations"], queryFn: () => getIntegrations() } satisfies UseQueryOptions;
};

export const getIntegrationQuery = (itgId: string): UseQueryOptions<GetIntegrationType | null> => {
  return { queryKey: ["getIntegration", itgId], queryFn: () => getIntegration(itgId) } satisfies UseQueryOptions;
};

// Hooks

export const useGetIntegrations = (): ReturnType<typeof useQuery<GetIntegrationType[]>> => {
  return useQuery(getIntegrationsQuery());
};

export const useGetIntegration = (itgId: string): ReturnType<typeof useQuery<GetIntegrationType | null>> => {
  return useQuery(getIntegrationQuery(itgId));
};

// Mutations

export const useCreateIntegration = (): UseMutationResult<unknown, unknown, Prisma.IntegrationCreateInput, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Prisma.IntegrationCreateInput) => createIntegration(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getIntegrations"] })
  });
};

export const useDeleteIntegration = (): UseMutationResult<unknown, unknown, string, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itgId: string) => deleteIntegration(itgId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["getIntegrations"] })
  });
};