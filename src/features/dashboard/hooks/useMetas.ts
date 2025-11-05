import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query';

import { metaService } from '../services/metaService';

import type { CreateMetaData, Meta, UpdateMetaData } from '@/shared/types';

/**
 * Hook para buscar todas as metas
 * @param ativo - Filtrar apenas metas ativas (opcional)
 * @returns Query result com lista de metas
 */
export const useMetas = (ativo?: boolean): UseQueryResult<Meta[], Error> => useQuery({
    queryKey: ['metas', ativo],
    queryFn: () => metaService.getAll(ativo),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

/**
 * Hook para criar uma nova meta
 * @returns Mutation result
 */
export const useCreateMeta = (): UseMutationResult<Meta, Error, CreateMetaData> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMetaData) => metaService.create(data),
    onSuccess: () => {
      // Invalida cache de metas para recarregar a lista
      queryClient.invalidateQueries({ queryKey: ['metas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
    },
  });
};

/**
 * Hook para atualizar uma meta existente
 * @returns Mutation result
 */
export const useUpdateMeta = (): UseMutationResult<
  Meta,
  Error,
  { id: number; data: UpdateMetaData }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => metaService.update(id, data),
    onSuccess: () => {
      // Invalida cache de metas
      queryClient.invalidateQueries({ queryKey: ['metas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
    },
  });
};

/**
 * Hook para deletar uma meta
 * @returns Mutation result
 */
export const useDeleteMeta = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => metaService.delete(id),
    onSuccess: () => {
      // Invalida cache de metas
      queryClient.invalidateQueries({ queryKey: ['metas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-kpis'] });
    },
  });
};
