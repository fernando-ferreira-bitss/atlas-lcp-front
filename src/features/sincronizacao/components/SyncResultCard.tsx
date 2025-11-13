import { AlertCircle, CheckCircle, Clock, Database, FileText, XCircle } from 'lucide-react';
import { FC } from 'react';

import type { SyncResponse } from '../types';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

interface SyncResultCardProps {
  result: SyncResponse;
}

export const SyncResultCard: FC<SyncResultCardProps> = ({ result }) => {
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  return (
    <Card className={`border shadow-sm ${result.sucesso_geral ? 'bg-green-50' : 'bg-red-50'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {result.sucesso_geral ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          <span className={result.sucesso_geral ? 'text-green-900' : 'text-red-900'}>
            Sincronização {result.sucesso_geral ? 'Concluída' : 'com Erros'}
          </span>
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
              <div className="mt-1 font-semibold capitalize text-lcp-blue">{result.tipo}</div>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock className="h-4 w-4" />
                Duração
              </div>
              <div className="mt-1 font-semibold text-lcp-blue">
                {formatDuration(result.duracao_total_segundos)}
              </div>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Database className="h-4 w-4" />
                Processados
              </div>
              <div className="mt-1 font-semibold text-lcp-blue">
                {result.total_registros_processados}
              </div>
            </div>
            <div className="rounded-lg bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <AlertCircle className="h-4 w-4" />
                Erros
              </div>
              <div
                className={`mt-1 font-semibold ${result.total_erros > 0 ? 'text-red-600' : 'text-green-600'}`}
              >
                {result.total_erros}
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-green-200 bg-white p-3">
              <div className="text-xs text-gray-600">Novos</div>
              <div className="mt-1 text-xl font-bold text-green-600">{result.total_novos}</div>
            </div>
            <div className="rounded-lg border border-blue-200 bg-white p-3">
              <div className="text-xs text-gray-600">Atualizados</div>
              <div className="mt-1 text-xl font-bold text-blue-600">{result.total_atualizados}</div>
            </div>
            <div className="rounded-lg border border-purple-200 bg-white p-3">
              <div className="text-xs text-gray-600">Total</div>
              <div className="mt-1 text-xl font-bold text-purple-600">
                {result.total_novos + result.total_atualizados}
              </div>
            </div>
          </div>

          {/* Detalhes por Entidade */}
          {result.resultados.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-gray-700">Detalhes por Entidade</h4>
              <div className="space-y-2">
                {result.resultados.map((r) => (
                  <div
                    key={`${r.entidade}-${r.empreendimento_id || 'geral'}`}
                    className={`rounded-lg border p-3 ${r.sucesso ? 'border-green-200 bg-white' : 'border-red-200 bg-red-50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {r.sucesso ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-medium capitalize text-gray-900">{r.entidade}</span>
                          {r.empreendimento_nome && (
                            <span className="text-sm text-gray-600">- {r.empreendimento_nome}</span>
                          )}
                        </div>
                        <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Processados:</span>{' '}
                            <span className="font-medium">{r.total_processados}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Novos:</span>{' '}
                            <span className="font-medium text-green-600">{r.novos}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Atualizados:</span>{' '}
                            <span className="font-medium text-blue-600">{r.atualizados}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Erros:</span>{' '}
                            <span
                              className={`font-medium ${r.erros > 0 ? 'text-red-600' : 'text-green-600'}`}
                            >
                              {r.erros}
                            </span>
                          </div>
                        </div>
                        {r.mensagem && (
                          <div className="mt-2 text-xs text-gray-600">
                            <span className="font-medium">Obs:</span> {r.mensagem}
                          </div>
                        )}
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        {formatDuration(r.duracao_segundos)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
