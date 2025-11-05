import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';

import { userService } from '../services/userService';

import type { RegisterData, User } from '@/shared/types';

import { toast } from '@/shared/hooks/use-toast';

interface UserFilters {
  skip?: number;
  limit?: number;
  is_admin?: boolean;
  is_active?: boolean;
}

interface UpdateUserData {
  nome?: string;
  email?: string;
  is_admin?: boolean;
  is_active?: boolean;
  password?: string;
}

/**
 * Hook para listar usuários
 * @param filters - Filtros opcionais
 * @returns Query result com lista de usuários
 */
export const useUsers = (filters?: UserFilters): UseQueryResult<User[], Error> =>
  useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

/**
 * Hook para buscar um usuário por ID
 * @param id - ID do usuário
 * @returns Query result com dados do usuário
 */
export const useUser = (id: number): UseQueryResult<User, Error> =>
  useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

/**
 * Hook para criar um novo usuário
 * @returns Mutation para criar usuário
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Usuário criado',
        description: 'O usuário foi criado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar usuário',
        description: error.message || 'Ocorreu um erro ao criar o usuário.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook para atualizar um usuário
 * @returns Mutation para atualizar usuário
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) =>
      userService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
      toast({
        title: 'Usuário atualizado',
        description: 'O usuário foi atualizado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar usuário',
        description: error.message || 'Ocorreu um erro ao atualizar o usuário.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook para deletar um usuário
 * @returns Mutation para deletar usuário
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Usuário deletado',
        description: 'O usuário foi deletado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao deletar usuário',
        description: error.message || 'Ocorreu um erro ao deletar o usuário.',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook para ativar/desativar um usuário
 * @returns Mutation para toggle active
 */
export const useToggleUserActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) =>
      userService.toggleActive(id, is_active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Status atualizado',
        description: 'O status do usuário foi atualizado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar status',
        description: error.message || 'Ocorreu um erro ao atualizar o status do usuário.',
        variant: 'destructive',
      });
    },
  });
};
