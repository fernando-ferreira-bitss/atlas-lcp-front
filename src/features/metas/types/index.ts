/**
 * Types para o módulo de Metas
 * Baseado na API /api/v1/metas
 */

/**
 * Meta de vendas por empreendimento/mês/ano
 */
export interface Meta {
  id: number;
  empreendimento_id: number | null; // null = meta consolidada (geral)
  mes: number; // 1-12
  ano: number; // 2020-2100
  meta_vendas: string; // Decimal como string
  meta_unidades: number;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

/**
 * Payload para criar uma nova meta
 */
export interface MetaCreate {
  empreendimento_id?: number | null; // Opcional, null = consolidado
  mes: number; // 1-12, obrigatório
  ano: number; // 2020-2100, obrigatório
  meta_vendas: string | number; // > 0, obrigatório
  meta_unidades: number; // > 0, obrigatório
}

/**
 * Payload para atualizar uma meta existente
 */
export interface MetaUpdate {
  mes?: number; // 1-12, opcional
  ano?: number; // 2020-2100, opcional
  meta_vendas?: string | number; // > 0, opcional
  meta_unidades?: number; // > 0, opcional
}

/**
 * Filtros para listagem de metas
 */
export interface MetaFilters {
  skip?: number; // Offset para paginação (padrão: 0)
  limit?: number; // Limite de resultados (padrão: 100, max: 100)
  empreendimento_id?: number; // Filtrar por ID do empreendimento
  ano?: number; // Filtrar por ano
  apenas_consolidado?: boolean; // Filtrar apenas metas consolidadas (empreendimento_id = null)
}

/**
 * Resultado da importação de metas via planilha
 */
export interface MetaImportResult {
  total_registros: number; // Total processado
  importados: number; // Novos criados
  atualizados: number; // Existentes atualizados
  erros: string[]; // Lista de erros
}

/**
 * Parâmetros para download de template
 */
export interface MetaTemplateParams {
  ano?: number; // Ano do template (padrão: ano atual)
}

/**
 * Parâmetros para importação de planilha
 */
export interface MetaImportParams {
  ano: number; // Ano das metas a importar (obrigatório)
  file: File; // Arquivo Excel (.xlsx ou .xls)
}

/**
 * Meta com informações do empreendimento (para exibição)
 */
export interface MetaWithEmpreendimento extends Meta {
  empreendimento_nome?: string;
}
