/**
 * Tipos e interfaces para o módulo de Relatórios
 */

/**
 * Formatos de exportação suportados
 */
export type ExportFormato = 'csv' | 'xlsx';

/**
 * Parâmetros base para exportação
 */
export interface ExportBaseParams {
  formato?: ExportFormato;
  data_inicio?: string;
  data_fim?: string;
  empreendimento_id?: number | null;
}

/**
 * Parâmetros específicos para exportação de propostas
 * Estende os parâmetros base adicionando filtro de status
 */
export interface ExportPropostasParams extends ExportBaseParams {
  status?: string;
}

/**
 * Parâmetros para exportação de relatório completo
 * Relatório completo não filtra por empreendimento
 */
export interface ExportRelatorioCompletoParams {
  data_inicio?: string;
  data_fim?: string;
}

/**
 * Estado de erro da API
 */
export interface ExportApiError {
  message?: string;
  detail?: string;
  status?: number;
}

/**
 * Response type para download de arquivos
 */
export interface ExportDownloadResponse {
  data: Blob;
  filename?: string;
  contentType?: string;
}
