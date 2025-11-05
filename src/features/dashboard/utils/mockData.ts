import type { DashboardKPIs } from '@/shared/types';

/**
 * Adiciona dados mockados aos KPIs retornados pela API
 * NOTA: Estes campos não estão disponíveis na API e precisam ser implementados no backend
 */
export const enhanceKPIsWithMockData = (kpis: DashboardKPIs): DashboardKPIs => {
  // Calcula valores mockados baseados nos dados reais
  const valor_total_propostas = kpis.valor_total_vendas * 1.33; // Estimativa: 75% conversão
  const ticket_medio_proposta = kpis.total_propostas > 0
    ? valor_total_propostas / kpis.total_propostas
    : 0;
  const taxa_conversao_valor = kpis.total_propostas > 0
    ? (kpis.valor_total_vendas / valor_total_propostas) * 100
    : 0;

  // Metas mockadas (exemplo: meta é 20% acima do realizado)
  const meta_vendas_mensal = kpis.valor_total_vendas * 1.2;
  const percentual_meta_mensal = kpis.valor_total_vendas > 0
    ? (kpis.valor_total_vendas / meta_vendas_mensal) * 100
    : 0;

  const meta_vendas_ytd = kpis.valor_total_vendas * 1.15;
  const percentual_meta_ytd = kpis.valor_total_vendas > 0
    ? (kpis.valor_total_vendas / meta_vendas_ytd) * 100
    : 0;

  return {
    ...kpis,
    valor_total_propostas,
    ticket_medio_proposta,
    taxa_conversao_valor,
    meta_vendas_mensal,
    percentual_meta_mensal,
    meta_vendas_ytd,
    percentual_meta_ytd,
  };
};

/**
 * Gera dados mockados para gráfico de evolução de vendas (2024 vs 2025)
 * NOTA: Este endpoint não existe na API
 */
export const getMockComparativoAnos = () => {
  const meses = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  return meses.map((mes, index) => ({
    mes,
    vendas_2024: Math.floor(Math.random() * 30) + 10,
    vendas_2025: Math.floor(Math.random() * 35) + 15,
    valor_2024: Math.floor(Math.random() * 10000000) + 5000000,
    valor_2025: Math.floor(Math.random() * 12000000) + 6000000,
  }));
};

/**
 * Gera dados mockados para gráfico de taxa de conversão por empreendimento
 * NOTA: Este endpoint não existe na API
 */
export const getMockConversaoPorEmpreendimento = () => {
  return [
    { nome: 'Empreendimento A', taxa_conversao: 78.5, total_propostas: 45, total_vendas: 35 },
    { nome: 'Empreendimento B', taxa_conversao: 65.3, total_propostas: 62, total_vendas: 40 },
    { nome: 'Empreendimento C', taxa_conversao: 82.1, total_propostas: 38, total_vendas: 31 },
    { nome: 'Empreendimento D', taxa_conversao: 71.4, total_propostas: 28, total_vendas: 20 },
    { nome: 'Empreendimento E', taxa_conversao: 88.2, total_propostas: 17, total_vendas: 15 },
  ];
};

/**
 * Gera dados mockados para gráfico de evolução do ticket médio
 * NOTA: Este endpoint não existe na API
 */
export const getMockEvolucaoTicketMedio = () => {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  return meses.map(mes => ({
    mes,
    ticket_proposta: 450000 + Math.random() * 150000,
    ticket_venda: 520000 + Math.random() * 180000,
  }));
};
