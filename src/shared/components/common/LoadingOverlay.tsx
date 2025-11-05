import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

/**
 * Componente de overlay de loading para cobrir toda a tela durante operações
 * Use quando precisar bloquear toda a interface durante uma operação assíncrona
 *
 * @example
 * ```tsx
 * {isLoading && <LoadingOverlay message="Salvando dados..." />}
 * ```
 */
export const LoadingOverlay = ({ message = 'Carregando...' }: LoadingOverlayProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="rounded-lg bg-white p-6 shadow-xl">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-lcp-blue" />
        <p className="text-sm font-medium text-lcp-blue">{message}</p>
      </div>
    </div>
  </div>
);
