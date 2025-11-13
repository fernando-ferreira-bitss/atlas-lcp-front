import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { FC } from 'react';

import type { SyncLog } from '../types';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { formatDate } from '@/shared/utils/format';

interface SyncLogsTableProps {
  logs: SyncLog[];
}

export const SyncLogsTable: FC<SyncLogsTableProps> = ({ logs }) => {
  const getStatusIcon = (log: SyncLog) => {
    if (log.status === 'em_progresso') return <Clock className="h-4 w-4 text-yellow-600" />;
    if (log.status === 'concluido' || log.status === 'sucesso')
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusText = (log: SyncLog) => {
    if (log.status === 'em_progresso') return 'Em andamento';
    if (log.status === 'concluido' || log.status === 'sucesso') return 'Concluído';
    if (log.status === 'erro') return 'Erro';
    if (log.status === 'falha') return 'Falha';
    return 'Desconhecido';
  };

  const getStatusColor = (log: SyncLog) => {
    if (log.status === 'em_progresso') return 'text-yellow-700 bg-yellow-50';
    if (log.status === 'concluido' || log.status === 'sucesso') return 'text-green-700 bg-green-50';
    return 'text-red-700 bg-red-50';
  };

  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return '-';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-12">
        <AlertCircle className="mb-3 h-12 w-12 text-gray-400" />
        <p className="text-sm text-gray-600">Nenhum log de sincronização encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <Card key={log.id} className="border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                {getStatusIcon(log)}
                <span className="capitalize">{log.tipo_sync}</span>
                <span
                  className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(log)}`}
                >
                  {getStatusText(log)}
                </span>
              </CardTitle>
              <div className="text-right text-sm text-gray-600">
                {log.data_inicio ? formatDate(log.data_inicio) : 'Data não disponível'}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <div className="rounded-lg border bg-gray-50 p-2">
                  <div className="text-xs text-gray-600">Processados</div>
                  <div className="mt-1 text-base font-semibold text-gray-900">
                    {log.total_registros}
                  </div>
                </div>
                <div className="rounded-lg border border-green-200 bg-green-50 p-2">
                  <div className="text-xs text-gray-600">Criados</div>
                  <div className="mt-1 text-base font-semibold text-green-700">
                    {log.registros_criados}
                  </div>
                </div>
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-2">
                  <div className="text-xs text-gray-600">Atualizados</div>
                  <div className="mt-1 text-base font-semibold text-blue-700">
                    {log.registros_atualizados}
                  </div>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-2">
                  <div className="text-xs text-gray-600">Erros</div>
                  <div className="mt-1 text-base font-semibold text-red-700">
                    {log.registros_erro}
                  </div>
                </div>
                <div className="rounded-lg border bg-purple-50 p-2">
                  <div className="text-xs text-gray-600">Duração</div>
                  <div className="mt-1 text-base font-semibold text-purple-700">
                    {formatDuration(log.tempo_execucao_segundos)}
                  </div>
                </div>
              </div>

              {/* Mensagem */}
              {log.mensagem && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <p className="text-sm text-blue-900">{log.mensagem}</p>
                </div>
              )}

              {/* Erro (se houver) */}
              {log.detalhes_erro && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <div className="flex items-start gap-2">
                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-red-900">Erro na sincronização</p>
                      <p className="mt-1 text-xs text-red-700">{log.detalhes_erro}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
