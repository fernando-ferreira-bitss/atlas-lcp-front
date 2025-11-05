import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from '@/shared/types';

import { apiClient } from '@/shared/services/api/client';


/**
 * Service para gerenciar autenticação e usuários
 */
class AuthService {
  /**
   * Autentica um usuário e retorna o token JWT
   * @param credentials - Email e senha do usuário
   * @returns Token de autenticação
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<never, AuthResponse>('/auth/login', credentials);
  }

  /**
   * Registra um novo usuário no sistema
   * @param data - Dados do novo usuário
   * @returns Usuário criado
   */
  async register(data: RegisterData): Promise<User> {
    return apiClient.post<never, User>('/auth/register', data);
  }

  /**
   * Busca dados do usuário autenticado
   * @returns Dados do usuário atual
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<never, User>('/auth/me');
  }

  /**
   * Armazena o token no localStorage
   * @param token - Token JWT
   */
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Remove o token do localStorage
   */
  removeToken(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  /**
   * Obtém o token armazenado
   * @returns Token ou null
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}

export const authService = new AuthService();
