// === User & Auth Types ===
export interface User {
  id: number;
  email: string;
  nome: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  nome: string;
  password: string;
  is_admin?: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

// === Empreendimento Types ===
export interface Empreendimento {
  id: number;
  codigo_mega: number;
  nome: string;
  endereco?: string | null;
  cidade?: string | null;
  estado?: string | null;
  filial?: string | null;
  status: string;
  data_lancamento?: string | null;
  total_unidades: number;
  unidades_disponiveis: number;
  unidades_vendidas: number;
  created_at: string;
  updated_at: string;
}

export interface EmpreendimentoStats {
  total_empreendimentos: number;
  total_unidades: number;
  unidades_disponiveis: number;
  unidades_vendidas: number;
  unidades_reservadas: number;
  valor_total_vendas: number;
  ticket_medio: number;
}

// === Proposta Types ===
export interface Proposta {
  id: number;
  codigo_mega: number;
  empreendimento_id: number;
  empreendimento_nome?: string;
  cliente_nome: string;
  cliente_cpf?: string | null;
  unidade: string;
  bloco: string;
  valor_proposta: number;
  data_proposta: string;
  status: 'Aberta' | 'Aprovada' | 'Reprovada' | 'Cancelada';
  vendedor?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropostaFilters {
  skip?: number;
  limit?: number;
  empreendimento_id?: number;
  status?: string;
}

// === Venda Types ===
export interface Venda {
  id: number;
  codigo_mega: number;
  empreendimento_id: number;
  empreendimento_nome?: string;
  cliente_nome: string;
  unidade: string;
  bloco: string;
  valor_venda: number;
  data_venda: string;
  status: 'Ativa' | 'Cancelada' | 'Distratada';
  forma_pagamento?: string | null;
  created_at: string;
  updated_at: string;
}

export interface VendaFilters {
  skip?: number;
  limit?: number;
  empreendimento_id?: number;
  status?: string;
  data_inicio?: string;
  data_fim?: string;
}

// === Meta Types ===
export interface Meta {
  id: number;
  nome: string;
  tipo: string;
  valor_meta: number;
  valor_realizado: number;
  percentual_atingido: number;
  periodo_inicio: string;
  periodo_fim: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMetaData {
  nome: string;
  tipo: string;
  valor_meta: number;
  periodo_inicio: string;
  periodo_fim: string;
  ativo?: boolean;
}

export interface UpdateMetaData {
  valor_meta?: number;
  ativo?: boolean;
}

// === Dashboard Types ===
export interface TopEmpreendimento {
  empreendimento_id: number;
  empreendimento_nome: string;
  total_propostas: number;
  total_vendas: number;
  valor_propostas: number;
  valor_vendas: number;
}

export interface GraficoVendasMes {
  mes: number;
  total_vendas: number;
  valor_vendas: number;
  meta_vendas: number;
}

export interface VendasPorPeriodo {
  periodo: string;
  total_vendas: number;
  valor_total: number;
  ticket_medio: number;
}

export interface DashboardKPIs {
  total_reservas: number;
  valor_reservas: number;
  total_propostas: number;
  total_vendas: number;
  valor_total_vendas: number;
  valor_total_propostas: number;
  ticket_medio: number;
  ticket_medio_proposta: number;
  taxa_conversao: number;
  taxa_conversao_valor: number;
  meta_vendas: number;
  percentual_meta: number;
  meta_vendas_ytd: number;
  percentual_meta_ytd: number;
  meta_vendas_mensal: number;
  percentual_meta_mensal: number;
  valor_vendas_mensal: number;
  valor_vendas_ytd: number;
}

export interface ComparativoAnos {
  mes: number;
  vendas_ano_anterior: number;
  vendas_ano_atual: number;
  valor_ano_anterior: number;
  valor_ano_atual: number;
}

export interface ConversaoPorEmpreendimento {
  empreendimento_id: number;
  empreendimento_nome: string;
  total_propostas: number;
  total_vendas: number;
  taxa_conversao: number;
  valor_propostas: number;
  valor_vendas: number;
}

export interface EvolucaoTicketMedio {
  mes: number;
  ticket_medio_proposta: number;
  ticket_medio_venda: number;
  total_propostas: number;
  total_vendas: number;
}

export interface DashboardFilters {
  data_inicio?: string;
  data_fim?: string;
  empreendimento_id?: number;
  periodo?: 'mensal' | 'ytd' | 'ultimos_12_meses' | 'personalizado';
}

export interface DashboardResumo {
  kpis: {
    total_empreendimentos: number;
    total_vendas_mes: number;
    valor_vendas_mes: number;
    propostas_abertas: number;
    taxa_conversao: number;
  };
  top_empreendimentos: Array<{
    nome: string;
    vendas: number;
    valor: number;
  }>;
  vendas_por_mes: Array<{
    mes: string;
    vendas: number;
    valor: number;
  }>;
}

export interface VendasPorPeriodoFilters {
  data_inicio?: string;
  data_fim?: string;
  agrupamento?: 'dia' | 'semana' | 'mes';
}

// === Sync Types ===
export interface SyncResponse {
  status: string;
  mensagem: string;
  criados?: number;
  atualizados?: number;
  erros?: number;
  tempo_execucao?: number;
  propostas_criadas?: number;
  propostas_atualizadas?: number;
  vendas_criadas?: number;
  vendas_atualizadas?: number;
  empreendimentos?: {
    criados: number;
    atualizados: number;
  };
  propostas?: {
    criadas: number;
    atualizadas: number;
  };
  vendas?: {
    criadas: number;
    atualizadas: number;
  };
}

export interface SyncLog {
  id: number;
  tipo_sync: string;
  status: string;
  total_registros: number;
  registros_criados: number;
  registros_atualizados: number;
  registros_erro: number;
  tempo_execucao_segundos: number;
  mensagem: string;
  data_inicio: string;
  data_fim: string;
}

export interface SyncStatusResponse {
  logs: SyncLog[];
}

// === API Response Types ===
export interface ApiError {
  detail:
    | string
    | Array<{
        type: string;
        loc: string[];
        msg: string;
        input: Record<string, unknown>;
      }>;
}

// === Pagination ===
export interface PaginationParams {
  skip?: number;
  limit?: number;
}
