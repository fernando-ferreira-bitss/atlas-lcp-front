import { FileDown, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { useExport } from '../hooks/useExport';
import { ExportFormato } from '../services/exportService';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useToast } from '@/shared/hooks/use-toast';


type ExportType = 'propostas' | 'vendas' | 'relatorio-completo' | null;

export const Relatorios = () => {
  const { toast } = useToast();
  const { isExporting, error, exportVendas, exportPropostas, exportRelatorioCompleto } =
    useExport();

  const [formato, setFormato] = useState<ExportFormato>('xlsx');
  const [loadingType, setLoadingType] = useState<ExportType>(null);

  const handleExportPropostas = async () => {
    setLoadingType('propostas');
    const success = await exportPropostas({ formato });

    if (success) {
      toast({
        title: 'Exportação concluída',
        description: 'O relatório de propostas foi baixado com sucesso.',
      });
    } else if (error) {
      toast({
        title: 'Erro na exportação',
        description: error,
        variant: 'destructive',
      });
    }
    setLoadingType(null);
  };

  const handleExportVendas = async () => {
    setLoadingType('vendas');
    const success = await exportVendas({ formato });

    if (success) {
      toast({
        title: 'Exportação concluída',
        description: 'O relatório de vendas foi baixado com sucesso.',
      });
    } else if (error) {
      toast({
        title: 'Erro na exportação',
        description: error,
        variant: 'destructive',
      });
    }
    setLoadingType(null);
  };

  const handleExportRelatorioCompleto = async () => {
    setLoadingType('relatorio-completo');
    const success = await exportRelatorioCompleto();

    if (success) {
      toast({
        title: 'Exportação concluída',
        description: 'O relatório completo foi baixado com sucesso.',
      });
    } else if (error) {
      toast({
        title: 'Erro na exportação',
        description: error,
        variant: 'destructive',
      });
    }
    setLoadingType(null);
  };

  return (
    <div className="space-y-6">
      {/* Título da Página */}
      <div>
        <h1 className="text-2xl font-bold text-lcp-blue sm:text-3xl">Relatórios</h1>
        <p className="mt-2 text-sm text-lcp-gray sm:text-base">
          Exporte dados de vendas e propostas em diferentes formatos
        </p>
      </div>

      {/* Card de Exportações Individuais */}
      <Card className="border bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Título da Seção */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-lcp-blue">Exportação de Dados</h2>

              {/* Seletor de Formato */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-lcp-gray">Formato:</span>
                <Select value={formato} onValueChange={(value) => setFormato(value as ExportFormato)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xlsx">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        <span>Excel</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="csv">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>CSV</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Texto Descritivo */}
            <p className="text-sm text-lcp-gray sm:text-base">
              Exporte dados específicos de propostas ou vendas. Os arquivos incluirão todos os
              campos disponíveis no formato selecionado.
            </p>

            {/* Botões de Exportação */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleExportPropostas}
                disabled={isExporting}
                className="w-full bg-lcp-green text-white hover:bg-lcp-green/90 disabled:opacity-50 sm:w-auto"
              >
                {loadingType === 'propostas' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="mr-2 h-4 w-4" />
                )}
                {loadingType === 'propostas' ? 'Exportando...' : 'Exportar Propostas'}
              </Button>

              <Button
                onClick={handleExportVendas}
                disabled={isExporting}
                className="w-full bg-lcp-green text-white hover:bg-lcp-green/90 disabled:opacity-50 sm:w-auto"
              >
                {loadingType === 'vendas' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="mr-2 h-4 w-4" />
                )}
                {loadingType === 'vendas' ? 'Exportando...' : 'Exportar Vendas'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card de Relatório Completo */}
      <Card className="border bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Título da Seção */}
            <h2 className="text-xl font-bold text-lcp-blue">Relatório Completo</h2>

            {/* Texto Descritivo */}
            <p className="text-sm text-lcp-gray sm:text-base">
              Exporte um relatório completo em Excel com 3 abas: Vendas, Propostas e
              Empreendimentos. Ideal para análises consolidadas e apresentações.
            </p>

            {/* Botão de Exportação Completa */}
            <Button
              onClick={handleExportRelatorioCompleto}
              disabled={isExporting}
              className="w-full bg-lcp-blue text-white hover:bg-lcp-blue/90 disabled:opacity-50 sm:w-auto"
            >
              {loadingType === 'relatorio-completo' ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="mr-2 h-4 w-4" />
              )}
              {loadingType === 'relatorio-completo' ? 'Exportando...' : 'Exportar Relatório Completo (XLSX)'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações Adicionais */}
      <Card className="border border-lcp-blue/20 bg-lcp-blue/5 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-2">
            <h3 className="font-semibold text-lcp-blue">Informações sobre a Exportação</h3>
            <ul className="list-inside list-disc space-y-1 text-sm text-lcp-gray">
              <li>Os dados são exportados de acordo com suas permissões de acesso</li>
              <li>Arquivos XLSX (Excel) são recomendados para análises complexas</li>
              <li>Arquivos CSV são mais leves e compatíveis com diversos sistemas</li>
              <li>O relatório completo sempre é gerado em formato Excel (XLSX)</li>
              <li>As datas nos arquivos estão no formato brasileiro (DD/MM/YYYY HH:MM)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
