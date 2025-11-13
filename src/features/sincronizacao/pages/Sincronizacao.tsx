import { History, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { SyncConfirmDialog } from '../components/SyncConfirmDialog';
import { SyncLogsTable } from '../components/SyncLogsTable';
import { SyncResultCard } from '../components/SyncResultCard';
import { SyncStatusCard } from '../components/SyncStatusCard';
import { useSync } from '../hooks/useSync';
import { useSyncLogs } from '../hooks/useSyncLogs';
import { useSyncStatus } from '../hooks/useSyncStatus';

import { Loading, LoadingOverlay } from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useToast } from '@/shared/hooks/use-toast';

export const Sincronizacao = () => {
  const { toast } = useToast();
  const { isSyncing, error, lastResult, syncProgress, syncFull, clearLastResult } = useSync();

  const { status, isLoading, error: statusError, refresh } = useSyncStatus();
  const {
    data: logsData,
    isLoading: isLoadingLogs,
    refetch: refetchLogs,
  } = useSyncLogs({ limit: 10, offset: 0 });

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const executeSync = async () => {
    clearLastResult();

    const success = await syncFull();

    if (!success && error) {
      toast({
        title: 'Erro ao iniciar sincronização',
        description: error,
        variant: 'destructive',
      });
    } else if (success) {
      toast({
        title: 'Sincronização iniciada',
        description: 'Acompanhe o progresso em tempo real.',
      });
    }
  };

  const handleClickSync = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmSync = async () => {
    setConfirmDialogOpen(false);
    await executeSync();
  };

  return (
    <div className="space-y-6">
      {/* Loading Overlay */}
      {isSyncing && (
        <LoadingOverlay
          message={syncProgress || 'Sincronizando dados... Isso pode levar alguns minutos.'}
        />
      )}

      {/* Título da Página */}
      <div>
        <h1 className="text-2xl font-bold text-lcp-blue sm:text-3xl">Sincronização de Dados</h1>
        <p className="mt-2 text-sm text-lcp-gray sm:text-base">
          Execute sincronizações manuais com a API externa e monitore o status das execuções
          automáticas
        </p>
      </div>

      {/* Status de Sincronização */}
      <SyncStatusCard
        status={status}
        isLoading={isLoading}
        error={statusError}
        onRefresh={refresh}
      />

      {/* Ações de Sincronização */}
      <Card className="border bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-lcp-blue">Executar Sincronização Manual</h2>
              <p className="mt-1 text-sm text-lcp-gray">
                Sincronizações automáticas ocorrem periodicamente. Use essa opção apenas quando
                necessário forçar uma atualização imediata.
              </p>
            </div>

            <div className="flex justify-center">
              {/* Sync Full */}
              <Button
                onClick={handleClickSync}
                disabled={isSyncing}
                className="flex h-auto w-full max-w-md flex-col items-start gap-2 bg-lcp-blue p-6 text-white hover:bg-lcp-blue/90 disabled:opacity-50"
              >
                <div className="flex w-full items-center justify-between">
                  {isSyncing ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <RefreshCw className="h-6 w-6" />
                  )}
                </div>
                <div className="text-left">
                  <div className="text-lg font-semibold">Sincronização Completa</div>
                  <div className="mt-1 text-sm opacity-90">
                    {isSyncing ? syncProgress || 'Sincronizando...' : 'Atualiza todos os dados'}
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Último Resultado */}
      {lastResult && (
        <div>
          <h2 className="mb-3 text-xl font-bold text-lcp-blue">Último Resultado</h2>
          <SyncResultCard result={lastResult} />
        </div>
      )}

      {/* Informações Adicionais */}
      <Card className="border border-lcp-blue/20 bg-lcp-blue/5 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lcp-blue">Sincronizações Automáticas</h3>
            <div className="space-y-2 text-sm text-lcp-gray">
              <div className="flex items-start gap-2">
                <span className="font-medium text-lcp-blue">•</span>
                <div>
                  <strong>Sync Full:</strong> Executa diariamente às 02:00 (Empreendimentos +
                  Contadores + Vendas)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-lcp-blue">•</span>
                <div>
                  <strong>Sync Vendas:</strong> Executa a cada 2 horas (06:00, 08:00, ..., 22:00)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-lcp-blue">•</span>
                <div>
                  <strong>Sync Contadores:</strong> Executa a cada 2 horas (06:15, 08:15, ...,
                  22:15)
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
              <strong>⚠️ Atenção:</strong> Sincronizações manuais devem ser usadas apenas quando
              necessário forçar atualização imediata ou após mudanças críticas na API externa.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Sincronizações */}
      <Card className="border bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-lcp-blue" />
                <h2 className="text-xl font-bold text-lcp-blue">Histórico de Sincronizações</h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchLogs()}
                disabled={isLoadingLogs}
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                <span className="ml-2">Atualizar</span>
              </Button>
            </div>

            {isLoadingLogs ? (
              <div className="flex items-center justify-center py-8">
                <Loading />
              </div>
            ) : (
              <SyncLogsTable logs={logsData?.logs || []} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Confirmação */}
      <SyncConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleConfirmSync}
      />
    </div>
  );
};
