import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';

import type { Unidade } from '@/shared/types';

import { unidadeService } from '@/shared/services/unidadeService';

interface UnidadesResult {
  total: number;
  items: Unidade[];
}

/**
 * Hook para listar TODAS as unidades de um grupo
 * Faz múltiplas requisições automaticamente se houver mais de 500 unidades
 * @param grupoId - ID do grupo
 * @returns Query result com todas as unidades do grupo
 */
export function useUnidadesByGrupo(grupoId: number): UseQueryResult<UnidadesResult, Error> {
  return useQuery({
    queryKey: ['unidades', grupoId],
    queryFn: () => unidadeService.listAllByGrupo(grupoId),
    enabled: !!grupoId,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
}

/**
 * Hook para atualizar propriedade de unidades de um grupo
 * @returns Mutation para atualizar
 */
export function useUpdateUnidadesPropriedade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ grupoId, unidadeIds }: { grupoId: number; unidadeIds: number[] }) =>
      unidadeService.updatePropriedade(grupoId, unidadeIds),
    onSuccess: (_, variables) => {
      // Invalidar cache das unidades do grupo
      queryClient.invalidateQueries({ queryKey: ['unidades', variables.grupoId] });
      // Invalidar cache do dashboard para refletir novos cálculos
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['vendas'] });
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
    },
  });
}
