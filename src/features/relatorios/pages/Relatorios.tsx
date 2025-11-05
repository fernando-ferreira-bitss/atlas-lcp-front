import { FileText } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';

export const Relatorios = () => {
  const handleExportPropostas = () => {
    // TODO: Implementar exportação de relatório de propostas
    console.log('Exportar Relatório de Propostas');
  };

  const handleExportVendas = () => {
    // TODO: Implementar exportação de relatório de vendas
    console.log('Exportar Relatório de Vendas');
  };

  return (
    <div className="space-y-6">
      {/* Título da Página */}
      <div>
        <h1 className="text-2xl font-bold text-lcp-blue sm:text-3xl">Relatórios</h1>
      </div>

      {/* Card com Conteúdo */}
      <Card className="border bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Título da Seção */}
            <h2 className="text-xl font-bold text-lcp-blue">Exportação de Dados</h2>

            {/* Texto Descritivo */}
            <p className="text-base text-lcp-gray">
              Selecione um tipo de relatório para exportar em formato CSV/XLSX. Os filtros
              aplicados no dashboard serão considerados.
            </p>

            {/* Botões de Exportação */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleExportPropostas}
                className="w-full bg-lcp-green text-white hover:bg-lcp-green/90 sm:w-auto"
              >
                <FileText className="mr-2 h-4 w-4" />
                Relatório de Propostas
              </Button>
              <Button
                onClick={handleExportVendas}
                className="w-full bg-lcp-green text-white hover:bg-lcp-green/90 sm:w-auto"
              >
                <FileText className="mr-2 h-4 w-4" />
                Relatório de Vendas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
