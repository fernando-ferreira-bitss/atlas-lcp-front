import { AlertTriangle } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

interface SyncConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  syncType: 'empreendimentos' | 'vendas' | 'full' | null;
  onConfirm: () => void;
}

export const SyncConfirmDialog: FC<SyncConfirmDialogProps> = ({
  open,
  onOpenChange,
  syncType,
  onConfirm,
}) => {
  const getDialogContent = () => {
    switch (syncType) {
      case 'empreendimentos':
        return {
          title: 'Sincronizar Empreendimentos?',
          description: 'Esta ação irá buscar e atualizar todos os empreendimentos da API externa.',
        };
      case 'vendas':
        return {
          title: 'Sincronizar Vendas?',
          description:
            'Esta ação irá buscar e atualizar todas as vendas e propostas da API externa.',
        };
      case 'full':
        return {
          title: 'Sincronização Completa?',
          description:
            'Esta ação irá sincronizar TODOS os dados (Empreendimentos + Vendas + Propostas) sequencialmente.',
        };
      default:
        return {
          title: 'Sincronizar dados?',
          description: 'Deseja prosseguir com a sincronização?',
        };
    }
  };

  const content = getDialogContent();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            {content.title}
          </DialogTitle>
          <DialogDescription className="space-y-3">
            <p>{content.description}</p>
            <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
              <strong>⚠️ Atenção:</strong> Durante a sincronização, não feche esta janela nem
              navegue para outra página. O processo será executado em segundo plano.
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} className="bg-lcp-blue hover:bg-lcp-blue/90">
            Confirmar Sincronização
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
