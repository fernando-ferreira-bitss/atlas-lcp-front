// Informações da aplicação
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Dashboard LCP';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Configurações de API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const API_TIMEOUT = 10000; // 10 segundos

// Configurações de paginação
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Tempo de cache (em milisegundos)
export const CACHE_TIME = {
  SHORT: 1000 * 60 * 1, // 1 minuto
  MEDIUM: 1000 * 60 * 5, // 5 minutos
  LONG: 1000 * 60 * 30, // 30 minutos
  VERY_LONG: 1000 * 60 * 60, // 1 hora
};

// Períodos de filtro
export const FILTER_PERIODS = {
  MONTHLY: 'mensal',
  YTD: 'ytd',
  LAST_12_MONTHS: 'ultimos_12_meses',
  CUSTOM: 'personalizado',
} as const;

export type FilterPeriod = (typeof FILTER_PERIODS)[keyof typeof FILTER_PERIODS];

// Perfis de usuário
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Status de vendas
export const SALE_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

export type SaleStatus = (typeof SALE_STATUS)[keyof typeof SALE_STATUS];

// Condições de pagamento
export const PAYMENT_CONDITIONS = {
  CASH: 'A_VISTA',
  FINANCING: 'FINANCIAMENTO',
  INSTALLMENTS: 'PARCELADO',
} as const;

export type PaymentCondition = (typeof PAYMENT_CONDITIONS)[keyof typeof PAYMENT_CONDITIONS];
