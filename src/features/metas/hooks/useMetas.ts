import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { metaService } from '../services/metaService';

import type { MetaCreate, MetaFilters, MetaImportParams, MetaUpdate } from '../types';

/**
 * Query keys para cache do React Query
 */
export const metaKeys = {
  all: ['metas'] as const,
  lists: () => [...metaKeys.all, 'list'] as const,
  list: (filters?: MetaFilters) => [...metaKeys.lists(), filters] as const,
  details: () => [...metaKeys.all, 'detail'] as const,
  detail: (id: number) => [...metaKeys.details(), id] as const,
};

/**
 * Hook para listar metas com filtros
 * @param filters - Filtros opcionais (empreendimento_id, ano, skip, limit)
 * @returns Query com array de metas
 */
export function useMetas(filters?: MetaFilters) {
  return useQuery({
    queryKey: metaKeys.list(filters),
    queryFn: () => metaService.list(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
}

/**
 * Hook para buscar uma meta por ID
 * @param id - ID da meta
 * @returns Query com meta específica
 */
export function useMeta(id: number) {
  return useQuery({
    queryKey: metaKeys.detail(id),
    queryFn: () => metaService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para criar uma nova meta
 * @returns Mutation para criar meta
 */
export function useCreateMeta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MetaCreate) => metaService.create(data),
    onSuccess: () => {
      // Invalidar cache de listagens
      queryClient.invalidateQueries({ queryKey: metaKeys.lists() });
    },
  });
}

/**
 * Hook para atualizar uma meta existente
 * @returns Mutation para atualizar meta
 */
export function useUpdateMeta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MetaUpdate }) => metaService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidar cache da meta específica
      queryClient.invalidateQueries({ queryKey: metaKeys.detail(variables.id) });
      // Invalidar cache de listagens
      queryClient.invalidateQueries({ queryKey: metaKeys.lists() });
    },
  });
}

/**
 * Hook para deletar uma meta
 * @returns Mutation para deletar meta
 */
export function useDeleteMeta() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => metaService.delete(id),
    onSuccess: () => {
      // Invalidar cache de listagens
      queryClient.invalidateQueries({ queryKey: metaKeys.lists() });
    },
  });
}

/**
 * Hook para importar metas via planilha Excel
 * @returns Mutation para importar metas
 */
export function useImportMetas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: MetaImportParams) => metaService.import(params),
    onSuccess: () => {
      // Invalidar cache de listagens após importação
      queryClient.invalidateQueries({ queryKey: metaKeys.lists() });
    },
  });
}

/**
 * Hook para download de template
 * Usa useMutation para ter acesso ao estado de loading
 * @returns Mutation para baixar template
 */
export function useDownloadMetaTemplate() {
  return useMutation({
    mutationFn: (ano?: number) => metaService.triggerTemplateDownload(ano),
  });
}
