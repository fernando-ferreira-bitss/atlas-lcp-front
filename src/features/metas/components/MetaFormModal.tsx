import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useCreateMeta, useUpdateMeta } from '../hooks/useMetas';

import type { Meta } from '../types';

import { useAllEmpreendimentos } from '@/features/empreendimentos/hooks/useEmpreendimentos';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

const MESES = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

const metaSchema = z.object({
  empreendimento_id: z.string().min(1, 'Empreendimento é obrigatório'),
  mes: z.number().min(1, 'Mês é obrigatório').max(12),
  ano: z.number().min(2020, 'Ano mínimo: 2020').max(2100, 'Ano máximo: 2100'),
  meta_vendas: z.string().min(1, 'Meta VGV é obrigatória'),
  meta_unidades: z.number().min(1, 'Meta de unidades deve ser maior que 0'),
});

type MetaFormData = z.infer<typeof metaSchema>;

interface MetaFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meta?: Meta | null; // Se fornecida, é edição; senão, é criação
}

export const MetaFormModal = ({ open, onOpenChange, meta }: MetaFormModalProps) => {
  const isEditing = !!meta;
  const currentYear = new Date().getFullYear();

  const { data: empreendimentos } = useAllEmpreendimentos();
  const createMeta = useCreateMeta();
  const updateMeta = useUpdateMeta();

  const [empSearch, setEmpSearch] = useState('');
  const [showEmpList, setShowEmpList] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<MetaFormData>({
    resolver: zodResolver(metaSchema),
    defaultValues: {
      empreendimento_id: undefined,
      mes: new Date().getMonth() + 1,
      ano: currentYear,
      meta_vendas: '',
      meta_unidades: 1,
    },
  });

  // Filtra empreendimentos baseado na busca - sempre mostra todos se não houver busca
  const empreendimentosFiltrados = empSearch
    ? empreendimentos?.filter((emp) => emp.nome.toLowerCase().includes(empSearch.toLowerCase()))
    : empreendimentos;

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#emp-search-modal') && !target.closest('.emp-dropdown')) {
        setShowEmpList(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Preencher form ao editar
  useEffect(() => {
    if (meta && open) {
      reset({
        empreendimento_id: meta.empreendimento_id?.toString(),
        mes: meta.mes,
        ano: meta.ano,
        meta_vendas: meta.meta_vendas,
        meta_unidades: meta.meta_unidades,
      });

      // Atualizar campo de busca
      const emp = empreendimentos?.find((e) => e.id === meta.empreendimento_id);
      setEmpSearch(emp?.nome || '');
    } else if (!open) {
      reset({
        empreendimento_id: undefined,
        mes: new Date().getMonth() + 1,
        ano: currentYear,
        meta_vendas: '',
        meta_unidades: 1,
      });
      setEmpSearch('');
      setShowEmpList(false);
    }
  }, [meta, open, reset, currentYear, empreendimentos]);

  const onSubmit = async (data: MetaFormData) => {
    try {
      // Converter meta_vendas de string formatada para número
      // Remove R$, espaços, pontos (separador de milhar) e substitui vírgula por ponto
      const metaVendasNumber = Number(
        data.meta_vendas.replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.')
      );

      const payload = {
        empreendimento_id: Number(data.empreendimento_id),
        mes: data.mes,
        ano: data.ano,
        meta_vendas: metaVendasNumber,
        meta_unidades: data.meta_unidades,
      };

      if (isEditing) {
        await updateMeta.mutateAsync({ id: meta.id, data: payload });
        toast.success('Meta atualizada com sucesso!');
      } else {
        await createMeta.mutateAsync(payload);
        toast.success('Meta criada com sucesso!');
      }

      onOpenChange(false);
    } catch (error: unknown) {
      console.error('Erro ao salvar meta:', error);

      // Tentar extrair a mensagem de erro da API
      let errorMessage = 'Erro ao salvar meta';

      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as { response?: { data?: { detail?: string } } };
        if (apiError.response?.data?.detail) {
          errorMessage = apiError.response.data.detail;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    }
  };

  const mesValue = watch('mes');
  const anoValue = watch('ano');
  const empValue = watch('empreendimento_id');

  // Gerar array de anos (últimos 5 + próximos 5)
  const anos = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Meta' : 'Nova Meta'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize os valores da meta'
              : 'Preencha os dados para criar uma nova meta'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Empreendimento - Oculto na edição */}
          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="empreendimento_id">Empreendimento *</Label>
              <div className="relative">
                <input
                  id="emp-search-modal"
                  type="text"
                  placeholder="Buscar empreendimento..."
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                  onFocus={() => {
                    setEmpSearch(''); // Limpa o campo ao focar
                    setShowEmpList(true);
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {showEmpList && (
                  <div className="emp-dropdown absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background shadow-lg">
                    {empreendimentosFiltrados?.map((emp) => (
                      <div
                        key={emp.id}
                        role="button"
                        tabIndex={0}
                        className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${
                          empValue === String(emp.id) ? 'bg-blue-100' : ''
                        }`}
                        onClick={() => {
                          setValue('empreendimento_id', String(emp.id));
                          setEmpSearch(emp.nome);
                          setShowEmpList(false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setValue('empreendimento_id', String(emp.id));
                            setEmpSearch(emp.nome);
                            setShowEmpList(false);
                          }
                        }}
                      >
                        {emp.nome}
                      </div>
                    ))}
                    {empreendimentosFiltrados?.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Nenhum empreendimento encontrado
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.empreendimento_id && (
                <p className="text-xs text-red-500">{errors.empreendimento_id.message}</p>
              )}
            </div>
          )}

          {/* Mês e Ano */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mes">Mês *</Label>
              <Select
                value={mesValue ? String(mesValue) : undefined}
                onValueChange={(value) => setValue('mes', Number(value))}
              >
                <SelectTrigger id="mes">
                  <SelectValue placeholder="Selecione o mês" />
                </SelectTrigger>
                <SelectContent>
                  {MESES.map((m) => (
                    <SelectItem key={m.value} value={String(m.value)}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mes && <p className="text-xs text-red-500">{errors.mes.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ano">Ano *</Label>
              <Select
                value={String(anoValue)}
                onValueChange={(value) => setValue('ano', Number(value))}
              >
                <SelectTrigger id="ano">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {anos.map((a) => (
                    <SelectItem key={a} value={String(a)}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ano && <p className="text-xs text-red-500">{errors.ano.message}</p>}
            </div>
          </div>

          {/* Meta VGV */}
          <div className="space-y-2">
            <Label htmlFor="meta_vendas">Meta VGV (R$) *</Label>
            <Controller
              name="meta_vendas"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="meta_vendas"
                  placeholder="R$ 0,00"
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value || '');
                  }}
                  decimalsLimit={2}
                  decimalSeparator=","
                  groupSeparator="."
                  prefix="R$ "
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              )}
            />
            {errors.meta_vendas && (
              <p className="text-xs text-red-500">{errors.meta_vendas.message}</p>
            )}
          </div>

          {/* Meta Unidades */}
          <div className="space-y-2">
            <Label htmlFor="meta_unidades">Meta Unidades *</Label>
            <Input
              id="meta_unidades"
              type="number"
              min="1"
              placeholder="Ex: 10"
              {...register('meta_unidades', { valueAsNumber: true })}
            />
            {errors.meta_unidades && (
              <p className="text-xs text-red-500">{errors.meta_unidades.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMeta.isPending || updateMeta.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createMeta.isPending || updateMeta.isPending}>
              {(() => {
                if (createMeta.isPending || updateMeta.isPending) {
                  return (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Salvando...
                    </>
                  );
                }
                return isEditing ? 'Atualizar' : 'Criar';
              })()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
