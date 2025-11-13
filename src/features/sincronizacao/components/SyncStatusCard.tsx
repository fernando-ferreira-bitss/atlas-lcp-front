import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, Calendar, Database, Loader2, RefreshCw } from 'lucide-react';
import { FC } from 'react';

import type { SyncStatusGeral } from '../types';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';


interface SyncStatusCardProps {
  status: SyncStatusGeral | undefined;
  isLoading: boolean;
  error?: Error | null;
  onRefresh: () => void;
  autoRefreshEnabled: boolean;
  onToggleAutoRefresh: (enabled: boolean) => void;
}

export const SyncStatusCard: FC<SyncStatusCardProps> = ({
  status,
  isLoading,
  error,
  onRefresh,
  autoRefreshEnabled,
  onToggleAutoRefresh,
}) => {
  const formatDate = (date: string | null) => {
    if (!date) return 'Nunca executado';
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <Card className="border bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold text-lcp-blue">Status de Sincronização</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Atualizar
          </Button>
          <Button
            variant={autoRefreshEnabled ? 'default' : 'outline'}
            size="sm"
            onClick={() => onToggleAutoRefresh(!autoRefreshEnabled)}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Auto {autoRefreshEnabled ? 'Ativo' : 'Inativo'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {(() => {
          if (isLoading && !status) {
            return (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-lcp-blue" />
              </div>
            );
          }

          if (status) {
            return (
              <div className="space-y-6">
                {/* Status de Sincronização em Andamento */}
                {status.sync_em_andamento && (
                  <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-4 text-yellow-800">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="font-medium">Sincronização em andamento...</span>
                  </div>
                )}

                {/* Última Sincronização */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-lcp-blue">
                    <Calendar className="h-4 w-4" />
                    Última Sincronização
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                      <span className="text-sm text-lcp-gray">Empreendimentos</span>
                      <span className="text-sm font-medium text-lcp-blue">
                        {formatDate(status.ultima_sync_empreendimentos)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                      <span className="text-sm text-lcp-gray">Propostas</span>
                      <span className="text-sm font-medium text-lcp-blue">
                        {formatDate(status.ultima_sync_propostas)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                      <span className="text-sm text-lcp-gray">Vendas</span>
                      <span className="text-sm font-medium text-lcp-blue">
                        {formatDate(status.ultima_sync_vendas)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Totais no Banco */}
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-lcp-blue">
                    <Database className="h-4 w-4" />
                    Totais no Banco de Dados
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-4">
                      <div className="text-sm text-lcp-gray">Empreendimentos</div>
                      <div className="mt-1 text-2xl font-bold text-lcp-blue">
                        {status.total_empreendimentos}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-green-50 to-white p-4">
                      <div className="text-sm text-lcp-gray">Propostas</div>
                      <div className="mt-1 text-2xl font-bold text-lcp-green">
                        {status.total_propostas}
                      </div>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-4">
                      <div className="text-sm text-lcp-gray">Vendas</div>
                      <div className="mt-1 text-2xl font-bold text-purple-600">
                        {status.total_vendas}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">
                    Erro ao carregar status de sincronização
                  </h3>
                  <p className="text-sm text-red-700">
                    {error?.message || 'Não foi possível carregar os dados de sincronização. Tente novamente.'}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                    className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
};
