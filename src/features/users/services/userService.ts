import type { RegisterData, User } from '@/shared/types';

import { apiClient } from '@/shared/services/api/client';

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
 * Service para gerenciar usuários
 */
class UserService {
  private readonly baseURL = '/users';

  /**
   * Lista todos os usuários
   * @param filters - Filtros opcionais
   * @returns Lista de usuários
   */
  async getAll(filters?: UserFilters): Promise<User[]> {
    return apiClient.get<never, User[]>(this.baseURL, { params: filters });
  }

  /**
   * Busca um usuário por ID
   * @param id - ID do usuário
   * @returns Dados do usuário
   */
  async getById(id: number): Promise<User> {
    return apiClient.get<never, User>(`${this.baseURL}/${id}`);
  }

  /**
   * Cria um novo usuário
   * @param data - Dados do novo usuário
   * @returns Usuário criado
   */
  async create(data: RegisterData): Promise<User> {
    return apiClient.post<RegisterData, User>('/auth/register', data);
  }

  /**
   * Atualiza um usuário
   * @param id - ID do usuário
   * @param data - Dados para atualizar
   * @returns Usuário atualizado
   */
  async update(id: number, data: UpdateUserData): Promise<User> {
    return apiClient.put<UpdateUserData, User>(`${this.baseURL}/${id}`, data);
  }

  /**
   * Ativa um usuário
   * @param id - ID do usuário
   * @returns Usuário atualizado
   */
  async activate(id: number): Promise<User> {
    return apiClient.post<never, User>(`${this.baseURL}/${id}/activate`);
  }

  /**
   * Desativa um usuário
   * @param id - ID do usuário
   * @returns Usuário atualizado
   */
  async deactivate(id: number): Promise<User> {
    return apiClient.post<never, User>(`${this.baseURL}/${id}/deactivate`);
  }

  /**
   * Ativa/desativa um usuário
   * @param id - ID do usuário
   * @param is_active - Status ativo
   * @returns Usuário atualizado
   */
  async toggleActive(id: number, is_active: boolean): Promise<User> {
    return is_active ? this.activate(id) : this.deactivate(id);
  }

  /**
   * Reseta a senha de um usuário (Admin apenas)
   * @param id - ID do usuário
   * @param newPassword - Nova senha
   * @returns Mensagem de confirmação
   */
  async resetPassword(id: number, newPassword: string): Promise<{ message: string; user: User }> {
    return apiClient.post<{ new_password: string }, { message: string; user: User }>(
      `${this.baseURL}/${id}/reset-password`,
      { new_password: newPassword }
    );
  }
}

export const userService = new UserService();
