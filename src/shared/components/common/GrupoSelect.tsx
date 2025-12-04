import { useGruposAll, useGruposSimple } from '@/features/grupos/hooks/useGrupos';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

interface GrupoSelectProps {
  value?: number | null;
  onChange: (grupoId: number | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAllOption?: boolean;
  /** Se true, usa a rota /all que retorna todos os grupos (ativos e inativos) */
  includeAll?: boolean;
}

/**
 * Componente de seleção de grupo de empreendimentos
 * Carrega automaticamente os grupos disponíveis da API usando a rota otimizada /simple
 * ou /all se includeAll for true
 */
export const GrupoSelect = ({
  value,
  onChange,
  placeholder = 'Selecione um grupo',
  className,
  disabled = false,
  showAllOption = false,
  includeAll = false,
}: GrupoSelectProps) => {
  const { data: gruposSimple, isLoading: isLoadingSimple } = useGruposSimple();
  const { data: gruposAll, isLoading: isLoadingAll } = useGruposAll();

  const grupos = includeAll ? gruposAll : gruposSimple;
  const isLoading = includeAll ? isLoadingAll : isLoadingSimple;

  const handleValueChange = (stringValue: string) => {
    if (stringValue === 'null') {
      onChange(null);
    } else {
      onChange(Number(stringValue));
    }
  };

  return (
    <Select
      value={value?.toString() ?? 'null'}
      onValueChange={handleValueChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={isLoading ? 'Carregando...' : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAllOption && <SelectItem value="null">Todos os grupos</SelectItem>}
        {grupos && grupos.length > 0
          ? grupos.map((grupo) => (
              <SelectItem key={grupo.id} value={grupo.id.toString()}>
                {grupo.nome_grupo}
              </SelectItem>
            ))
          : !isLoading && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                Nenhum grupo disponível
              </div>
            )}
      </SelectContent>
    </Select>
  );
};
