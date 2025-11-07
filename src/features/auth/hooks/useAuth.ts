import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query';

import { authService } from '../services/authService';

import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/shared/types';

/**
 * Hook para buscar dados do usuário atual
 * @param enabled - Se a query deve ser executada
 * @returns Query result com dados do usuário
 */
export const useCurrentUser = (enabled = true): UseQueryResult<User, Error> =>
  useQuery({
    queryKey: ['current-user'],
    queryFn: () => authService.getCurrentUser(),
    enabled: enabled && !!authService.getToken(),
    staleTime: 1000 * 60 * 10, // 10 minutos
    retry: false,
  });

/**
 * Hook para realizar login
 * @returns Mutation result
 */
export const useLogin = (): UseMutationResult<AuthResponse, Error, LoginCredentials> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      authService.setToken(data.access_token);
      // Invalida queries para forçar reload do usuário
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
};

/**
 * Hook para realizar logout
 * @returns Função de logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    authService.removeToken();
    queryClient.clear(); // Limpa todo o cache
    window.location.href = '/login';
  };
};

/**
 * Hook para registrar novo usuário
 * @returns Mutation result
 */
export const useRegister = (): UseMutationResult<User, Error, RegisterData> =>
  useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
  });

/**
 * Hook helper para verificar se o usuário está autenticado
 * @returns Boolean indicando autenticação
 */
export const useIsAuthenticated = (): boolean => !!authService.getToken();
