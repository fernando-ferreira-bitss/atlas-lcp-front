/**
 * Types para o módulo de Metas
 * Baseado na API /api/v1/metas
 */

/**
 * Meta de vendas por grupo/mês/ano
 */
export interface Meta {
  id: number;
  empreendimento_id: number | null; // SEMPRE null - metas são apenas por grupo
  empreendimento_grupo_id: number | null; // ID do grupo (obrigatório)
  grupo_nome?: string; // Nome do grupo (retornado pela API)
  mes: number; // 1-12
  ano: number; // 2020-2100
  meta_vendas: number; // Valor decimal
  meta_unidades: number;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

/**
 * Payload para criar uma nova meta
 */
export interface MetaCreate {
  empreendimento_id: number | null; // SEMPRE null
  empreendimento_grupo_id: number; // ID do grupo (obrigatório)
  mes: number; // 1-12, obrigatório
  ano: number; // 2020-2100, obrigatório
  meta_vendas: number; // > 0, obrigatório
  meta_unidades: number; // > 0, obrigatório
}

/**
 * Payload para atualizar uma meta existente
 */
export interface MetaUpdate {
  empreendimento_id?: number | null;
  empreendimento_grupo_id?: number;
  mes?: number; // 1-12, opcional
  ano?: number; // 2020-2100, opcional
  meta_vendas?: number; // > 0, opcional
  meta_unidades?: number; // > 0, opcional
}

/**
 * Filtros para listagem de metas
 */
export interface MetaFilters {
  skip?: number; // Offset para paginação (padrão: 0)
  limit?: number; // Limite de resultados (padrão: 100, max: 100)
  empreendimento_grupo_id?: number; // Filtrar por ID do grupo
  ano?: number; // Filtrar por ano
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
