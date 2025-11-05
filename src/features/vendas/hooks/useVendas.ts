import { useQuery } from '@tanstack/react-query';

import { vendaService } from '../services/vendaService';

import type { Venda, VendaFilters } from '@/shared/types';
import type { UseQueryResult } from '@tanstack/react-query';

export const useVendas = (filters?: VendaFilters): UseQueryResult<Venda[], Error> =>
  useQuery({
    queryKey: ['vendas', filters],
    queryFn: () => vendaService.getAll(filters),
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

export const useVenda = (id: number): UseQueryResult<Venda, Error> =>
  useQuery({
    queryKey: ['venda', id],
    queryFn: () => vendaService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
