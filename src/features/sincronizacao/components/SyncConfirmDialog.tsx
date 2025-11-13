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
  onConfirm: () => void;
}

export const SyncConfirmDialog: FC<SyncConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          Sincronização Completa?
        </DialogTitle>
        <DialogDescription className="space-y-3">
          <p>
            Esta ação irá sincronizar TODOS os dados (Empreendimentos + Vendas + Propostas)
            sequencialmente.
          </p>
          <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
            <strong>⚠️ Atenção:</strong> A sincronização será executada em segundo plano. Acompanhe
            o progresso em tempo real na tela.
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
