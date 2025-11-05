import type { UserRole, SaleStatus, PaymentCondition } from '@/shared/constants/app';

// === User Types ===
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// === Auth Types ===
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// === API Response Types ===
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// === Empreendimento Types ===
export interface Empreendimento {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  location?: string;
}

// === Proposta Types ===
export interface Proposta {
  id: string;
  empreendimentoId: string;
  value: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

// === Venda Types ===
export interface Venda {
  id: string;
  propostaId: string;
  empreendimentoId: string;
  empreendimentoName?: string;
  value: number;
  condition: PaymentCondition;
  date: string;
  status: SaleStatus;
}

// === Meta Types ===
export interface Meta {
  id: string;
  empreendimentoId: string;
  type: 'monthly' | 'yearly';
  targetValue: number;
  period: string;
  year: number;
}

// === Dashboard Filter Types ===
export interface DashboardFilters {
  period: 'mensal' | 'ytd' | 'ultimos_12_meses' | 'personalizado';
  empreendimentoId?: string;
  startDate?: string;
  endDate?: string;
}

// === Dashboard Indicator Types ===
export interface DashboardIndicators {
  volumePropostas: number;
  volumeVendas: number;
  conversaoQtd: number;
  conversaoValor: number;
  ticketMedioProposta: number;
  ticketMedioVenda: number;
  metaVgvMensal: number;
  metaVgvYtd: number;
}

// === Chart Data Types ===
export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: string | number;
}

export interface MetaRealizadoData {
  month: string;
  meta: number;
  realizado: number;
}

export interface EvolucaoVendasData {
  month: string;
  ano2024: number;
  ano2025: number;
}

export interface ConversaoPorEmpreendimentoData {
  empreendimento: string;
  taxa: number;
}

export interface VendasPorEmpreendimentoData {
  empreendimento: string;
  propostas: number;
  vendas: number;
}

export interface TicketMedioData {
  month: string;
  proposta: number;
  venda: number;
}
