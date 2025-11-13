import { AlertCircle, CheckCircle, Clock, Database, FileText, XCircle } from 'lucide-react';
import { FC } from 'react';

import type { SyncLog } from '../types';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface SyncResultCardProps {
  result: SyncLog;
}

export const SyncResultCard: FC<SyncResultCardProps> = ({ result }) => {
  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return '-';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  const getStatusColor = () => {
    if (result.status === 'concluido' || result.status === 'sucesso') return 'bg-green-50';
    if (result.status === 'erro' || result.status === 'falha') return 'bg-red-50';
    return 'bg-yellow-50';
  };

  const getStatusIcon = () => {
    if (result.status === 'concluido' || result.status === 'sucesso')
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (result.status === 'erro' || result.status === 'falha')
      return <XCircle className="h-5 w-5 text-red-600" />;
    return <Clock className="h-5 w-5 text-yellow-600" />;
  };

  const getStatusText = () => {
    if (result.status === 'em_progresso') return 'Em Andamento';
    if (result.status === 'concluido' || result.status === 'sucesso') return 'Concluída';
    if (result.status === 'erro') return 'com Erros';
    if (result.status === 'falha') return 'Falhou';
    return 'Desconhecido';
  };

  const getStatusTextColor = () => {
    if (result.status === 'concluido' || result.status === 'sucesso') return 'text-green-900';
    if (result.status === 'erro' || result.status === 'falha') return 'text-red-900';
    return 'text-yellow-900';
  };

  return (
    <Card className={`border shadow-sm ${getStatusColor()}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          <span className={getStatusTextColor()}>Sincronização {getStatusText()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Informações Gerais */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FileText className="h-4 w-4" />
                Tipo
              </div>
              <div className="mt-1 font-semibold capitalize text-lcp-blue">{result.tipo_sync}</div>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="h-4 w-4" />
                Duração
              </div>
              <div className="mt-1 font-semibold text-lcp-blue">
                {formatDuration(result.tempo_execucao_segundos)}
              </div>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Database className="h-4 w-4" />
                Processados
              </div>
              <div className="mt-1 font-semibold text-lcp-blue">{result.total_registros}</div>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <AlertCircle className="h-4 w-4" />
                Erros
              </div>
              <div
                className={`mt-1 font-semibold ${result.registros_erro > 0 ? 'text-red-600' : 'text-green-600'}`}
              >
                {result.registros_erro}
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-green-200 bg-white p-3">
              <div className="text-xs text-gray-600">Criados</div>
              <div className="mt-1 text-xl font-bold text-green-600">
                {result.registros_criados}
              </div>
            </div>
            <div className="rounded-lg border border-blue-200 bg-white p-3">
              <div className="text-xs text-gray-600">Atualizados</div>
              <div className="mt-1 text-xl font-bold text-blue-600">
                {result.registros_atualizados}
              </div>
            </div>
            <div className="rounded-lg border border-purple-200 bg-white p-3">
              <div className="text-xs text-gray-600">Total</div>
              <div className="mt-1 text-xl font-bold text-purple-600">
                {result.registros_criados + result.registros_atualizados}
              </div>
            </div>
          </div>

          {/* Mensagem */}
          {result.mensagem && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-sm text-blue-900">{result.mensagem}</p>
            </div>
          )}

          {/* Detalhes de Erro */}
          {result.detalhes_erro && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="flex items-start gap-2">
                <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-900">Erro na sincronização</p>
                  <p className="mt-1 text-xs text-red-700">{result.detalhes_erro}</p>
                </div>
              </div>
            </div>
          )}

          {/* Data/Hora de Início */}
          {result.data_inicio && (
            <div className="rounded-lg border bg-gray-50 p-3">
              <div className="text-xs text-gray-600">Iniciado em</div>
              <div className="mt-1 text-sm font-semibold text-gray-900">
                {new Date(result.data_inicio).toLocaleString('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'medium',
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
