import { Download, FileSpreadsheet, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useDownloadMetaTemplate, useImportMetas } from '../hooks/useMetas';

import type { MetaImportResult } from '../types';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

export const MetaImportForm = () => {
  const currentYear = new Date().getFullYear();
  const [ano, setAno] = useState<number>(currentYear);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<MetaImportResult | null>(null);

  const downloadTemplate = useDownloadMetaTemplate();
  const importMetas = useImportMetas();

  // Gerar array de anos (últimos 5 + próximos 5)
  const anos = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplate.mutateAsync(ano);
      toast.success(`Template ${ano} baixado com sucesso!`);
    } catch (error) {
      console.error('Erro ao baixar template:', error);
      toast.error('Erro ao baixar template');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    const inputElement = e.target;

    // Validar tipo de arquivo
    if (selectedFile) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
      ];

      if (
        !validTypes.includes(selectedFile.type) &&
        !selectedFile.name.endsWith('.xlsx') &&
        !selectedFile.name.endsWith('.xls')
      ) {
        toast.error('Por favor, selecione um arquivo Excel (.xlsx ou .xls)');
        setFile(null);
        inputElement.value = '';
        return;
      }

      // Validar tamanho (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        toast.error('Arquivo muito grande! Tamanho máximo: 10MB');
        setFile(null);
        inputElement.value = '';
        return;
      }
    }

    setFile(selectedFile);
    setResult(null); // Limpar resultado anterior
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Selecione um arquivo para importar');
      return;
    }

    try {
      const data = await importMetas.mutateAsync({ ano, file });
      setResult(data);

      if (data.erros.length === 0) {
        toast.success(
          `✅ Importação concluída! ${data.importados} criados, ${data.atualizados} atualizados`
        );
      } else {
        toast.warning(
          `⚠️ Importação com erros: ${data.importados} criados, ${data.atualizados} atualizados, ${data.erros.length} erros`
        );
      }

      // Limpar arquivo após sucesso
      setFile(null);
      const input = document.getElementById('file-input') as HTMLInputElement;
      if (input) input.value = '';
    } catch (error: unknown) {
      console.error('Erro ao importar metas:', error);
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
          : 'Erro ao importar metas';
      toast.error(errorMessage || 'Erro ao importar metas');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-lcp-blue" />
          Importar Metas via Planilha
        </CardTitle>
        <CardDescription>
          Baixe o template, preencha com as metas e faça upload para importação em massa
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Seletor de Ano */}
        <div className="space-y-2">
          <Label htmlFor="ano">Ano das Metas</Label>
          <Select value={String(ano)} onValueChange={(value) => setAno(Number(value))}>
            <SelectTrigger id="ano">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {anos.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botão Download Template */}
        <div className="space-y-2">
          <Label>1. Baixar Template</Label>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleDownloadTemplate}
            disabled={downloadTemplate.isPending}
          >
            {downloadTemplate.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-transparent" />
                Baixando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Baixar Template {ano}
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500">
            O template já vem com todos os empreendimentos ativos
          </p>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-input">2. Selecionar Planilha Preenchida</Label>
            <Input
              id="file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={importMetas.isPending}
            />
            {file && (
              <p className="text-xs text-gray-600">
                Arquivo selecionado: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={!file || importMetas.isPending}>
            {importMetas.isPending ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Importando...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Importar Metas
              </>
            )}
          </Button>
        </form>

        {/* Resultado da Importação */}
        {result && (
          <div className="space-y-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h4 className="font-semibold text-lcp-blue">Resultado da Importação</h4>

            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Total</p>
                <p className="text-lg font-bold text-lcp-blue">{result.total_registros}</p>
              </div>
              <div>
                <p className="text-gray-600">✅ Importados</p>
                <p className="text-lg font-bold text-green-600">{result.importados}</p>
              </div>
              <div>
                <p className="text-gray-600">🔄 Atualizados</p>
                <p className="text-lg font-bold text-orange-600">{result.atualizados}</p>
              </div>
            </div>

            {result.erros.length > 0 && (
              <div className="space-y-2 rounded border border-red-200 bg-red-50 p-3">
                <h5 className="font-medium text-red-700">
                  ⚠️ Erros Encontrados ({result.erros.length})
                </h5>
                <ul className="list-inside list-disc space-y-1 text-sm text-red-600">
                  {result.erros.map((erro) => (
                    <li key={erro}>{erro}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
