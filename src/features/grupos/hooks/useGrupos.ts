import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';

import type {
  CreateEmpreendimentoGrupoData,
  EmpreendimentoGrupoSimple,
  EmpreendimentoGrupoWithMembros,
  EmpreendimentoSimple,
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
 * Hook para listar todos os grupos (ativos e inativos) - Para cadastro de metas
 * @returns Query result com lista de todos os grupos
 */
export function useGruposAll(): UseQueryResult<EmpreendimentoGrupoSimple[], Error> {
  return useQuery({
    queryKey: ['grupos', 'all'],
    queryFn: () => grupoService.listAll(),
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
      queryClient.invalidateQueries({ queryKey: ['empreendimentos-disponiveis'] });
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
      queryClient.invalidateQueries({ queryKey: ['grupo-empreendimentos', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['empreendimentos-disponiveis'] });
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
      queryClient.invalidateQueries({ queryKey: ['empreendimentos-disponiveis'] });
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

/**
 * Hook para buscar empreendimentos disponíveis (sem grupo)
 * @param enabled - Se true, executa a query. Útil para só buscar quando modal está aberto.
 * @returns Query result com lista de empreendimentos disponíveis para vincular
 */
export function useEmpreendimentosDisponiveis(enabled = true): UseQueryResult<EmpreendimentoSimple[], Error> {
  return useQuery({
    queryKey: ['empreendimentos-disponiveis'],
    queryFn: () => grupoService.getEmpreendimentosDisponiveis(),
    staleTime: 0, // Sempre buscar na API
    gcTime: 0, // Não manter em cache
    enabled,
  });
}
