import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';

import type {
  CreateEmpreendimentoGrupoData,
  EmpreendimentoGrupoSimple,
  EmpreendimentoGrupoWithMembros,
  UpdateEmpreendimentoGrupoData,
} from '@/shared/types';

import { grupoService } from '@/shared/services/grupoService';

/**
 * Hook para listar grupos simplificados (otimizado para selects)
 * @returns Query result com lista simplificada de grupos ativos
 */
export function useGruposSimple(): UseQueryResult<EmpreendimentoGrupoSimple[], Error> {
  return useQuery({
    queryKey: ['grupos', 'simple'],
    queryFn: () => grupoService.listSimple(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para listar grupos de empreendimentos
 * @param apenasAtivos - Se true, retorna apenas grupos ativos
 * @returns Query result com lista de grupos
 */
export function useGrupos(
  apenasAtivos = false
): UseQueryResult<EmpreendimentoGrupoWithMembros[], Error> {
  return useQuery({
    queryKey: ['grupos', apenasAtivos],
    queryFn: () => grupoService.list(apenasAtivos),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para buscar um grupo por ID
 * @param id - ID do grupo
 * @returns Query result com dados do grupo
 */
export function useGrupo(id: number) {
  return useQuery({
    queryKey: ['grupo', id],
    queryFn: () => grupoService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

/**
 * Hook para criar um novo grupo
 * @returns Mutation para criar grupo
 */
export function useCreateGrupo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmpreendimentoGrupoData) => grupoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
    },
  });
}

/**
 * Hook para atualizar um grupo
 * @returns Mutation para atualizar grupo
 */
export function useUpdateGrupo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmpreendimentoGrupoData }) =>
      grupoService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
      queryClient.invalidateQueries({ queryKey: ['grupo', variables.id] });
    },
  });
}

/**
 * Hook para deletar um grupo
 * @returns Mutation para deletar grupo
 */
export function useDeleteGrupo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => grupoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grupos'] });
    },
  });
}

/**
 * Hook para buscar empreendimentos de um grupo
 * @param id - ID do grupo
 * @returns Query result com lista de IDs de empreendimentos
 */
export function useGrupoEmpreendimentos(id: number): UseQueryResult<number[], Error> {
  return useQuery({
    queryKey: ['grupo-empreendimentos', id],
    queryFn: () => grupoService.getEmpreendimentos(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
