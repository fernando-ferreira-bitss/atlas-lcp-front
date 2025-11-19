import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useGruposSimple } from '@/features/grupos/hooks/useGrupos';

interface GrupoSelectProps {
  value?: number | null;
  onChange: (grupoId: number | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showAllOption?: boolean;
}

/**
 * Componente de seleção de grupo de empreendimentos
 * Carrega automaticamente os grupos disponíveis da API usando a rota otimizada /simple
 */
export function GrupoSelect({
  value,
  onChange,
  placeholder = 'Selecione um grupo',
  className,
  disabled = false,
  showAllOption = false,
}: GrupoSelectProps) {
  const { data: grupos, isLoading } = useGruposSimple();

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
        {grupos && grupos.length > 0 ? (
          grupos.map((grupo) => (
            <SelectItem key={grupo.id} value={grupo.id.toString()}>
              {grupo.nome_grupo}
            </SelectItem>
          ))
        ) : (
          !isLoading && (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              Nenhum grupo disponível
            </div>
          )
        )}
      </SelectContent>
    </Select>
  );
}
