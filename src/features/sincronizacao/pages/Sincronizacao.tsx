import { Building2, Download, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';


import { SyncConfirmDialog } from '../components/SyncConfirmDialog';
import { SyncResultCard } from '../components/SyncResultCard';
import { SyncStatusCard } from '../components/SyncStatusCard';
import { useSync } from '../hooks/useSync';
import { useSyncStatus } from '../hooks/useSyncStatus';

import { LoadingOverlay } from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useToast } from '@/shared/hooks/use-toast';

type SyncType = 'empreendimentos' | 'vendas' | 'full' | null;

export const Sincronizacao = () => {
  const { toast } = useToast();
  const {
    isSyncing,
    error,
    lastResult,
    syncEmpreendimentos,
    syncVendas,
    syncFull,
    clearLastResult,
  } = useSync();

  const { status, isLoading, error: statusError, refresh, autoRefreshEnabled, toggleAutoRefresh } = useSyncStatus();

  const [syncingType, setSyncingType] = useState<SyncType>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingSyncType, setPendingSyncType] = useState<SyncType>(null);

  const executeSync = async (type: SyncType) => {
    if (!type) return;

    setSyncingType(type);
    clearLastResult();

    let result = null;

    switch (type) {
      case 'empreendimentos':
        result = await syncEmpreendimentos();
        break;
      case 'vendas':
        result = await syncVendas();
        break;
      case 'full':
        result = await syncFull();
        break;
      default:
        break;
    }

    if (result) {
      toast({
        title: 'Sincronização concluída',
        description: `${result.total_registros_processados} registros processados com sucesso.`,
      });
      refresh(); // Atualiza o status
    } else if (error) {
      toast({
        title: 'Erro na sincronização',
        description: error,
        variant: 'destructive',
      });
    }

    setSyncingType(null);
  };

  const handleClickSync = (type: SyncType) => {
    setPendingSyncType(type);
    setConfirmDialogOpen(true);
  };

  const handleConfirmSync = async () => {
    setConfirmDialogOpen(false);
    if (pendingSyncType) {
      await executeSync(pendingSyncType);
      setPendingSyncType(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Loading Overlay */}
      {isSyncing && (
        <LoadingOverlay message={`Sincronizando ${syncingType}... Isso pode levar alguns minutos.`} />
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
        autoRefreshEnabled={autoRefreshEnabled}
        onToggleAutoRefresh={toggleAutoRefresh}
      />

      {/* Ações de Sincronização */}
      <Card className="border bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-lcp-blue">Executar Sincronização Manual</h2>
              <p className="mt-1 text-sm text-lcp-gray">
                Sincronizações automáticas ocorrem periodicamente. Use essas opções apenas quando
                necessário forçar uma atualização imediata.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Sync Empreendimentos */}
              <Button
                onClick={() => handleClickSync('empreendimentos')}
                disabled={isSyncing}
                className="flex h-auto flex-col items-start gap-2 bg-lcp-blue p-4 text-white hover:bg-lcp-blue/90 disabled:opacity-50"
              >
                <div className="flex w-full items-center justify-between">
                  {syncingType === 'empreendimentos' ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Building2 className="h-5 w-5" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-semibold">Empreendimentos</div>
                  <div className="mt-1 text-xs opacity-90">
                    {syncingType === 'empreendimentos'
                      ? 'Sincronizando...'
                      : 'Atualiza empreendimentos e contadores'}
                  </div>
                </div>
              </Button>

              {/* Sync Vendas */}
              <Button
                onClick={() => handleClickSync('vendas')}
                disabled={isSyncing}
                className="flex h-auto flex-col items-start gap-2 bg-lcp-green p-4 text-white hover:bg-lcp-green/90 disabled:opacity-50"
              >
                <div className="flex w-full items-center justify-between">
                  {syncingType === 'vendas' ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-semibold">Vendas</div>
                  <div className="mt-1 text-xs opacity-90">
                    {syncingType === 'vendas'
                      ? 'Sincronizando...'
                      : 'Atualiza vendas e propostas'}
                  </div>
                </div>
              </Button>

              {/* Sync Full */}
              <Button
                onClick={() => handleClickSync('full')}
                disabled={isSyncing}
                className="flex h-auto flex-col items-start gap-2 bg-purple-600 p-4 text-white hover:bg-purple-700 disabled:opacity-50"
              >
                <div className="flex w-full items-center justify-between">
                  {syncingType === 'full' ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-5 w-5" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-semibold">Sincronização Completa</div>
                  <div className="mt-1 text-xs opacity-90">
                    {syncingType === 'full' ? 'Sincronizando...' : 'Atualiza tudo sequencialmente'}
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

      {/* Dialog de Confirmação */}
      <SyncConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        syncType={pendingSyncType}
        onConfirm={handleConfirmSync}
      />
    </div>
  );
};
