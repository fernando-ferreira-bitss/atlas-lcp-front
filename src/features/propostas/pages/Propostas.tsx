import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';

export const Propostas = () => {
  const handleVerDetalhesDemo = () => {
    // TODO: Implementar visualização de detalhes de proposta (demo)
    console.log('Ver Detalhes (Demo) clicado');
  };

  return (
    <div className="space-y-6">
      {/* Título da Página */}
      <div>
        <h1 className="text-2xl font-bold text-lcp-blue sm:text-3xl">Propostas</h1>
      </div>

      {/* Card com Conteúdo Placeholder */}
      <Card className="border bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Título da Seção */}
            <h2 className="text-xl font-bold text-lcp-blue">Lista de Propostas</h2>

            {/* Texto Descritivo */}
            <p className="text-base text-lcp-gray">
              Tabela com filtros (cliente, empreendimento, valor, status, data) aparecerá aqui.
            </p>

            {/* Botão de Ação */}
            <div>
              <Button
                onClick={handleVerDetalhesDemo}
                className="bg-lcp-blue px-6 py-2 text-white hover:bg-lcp-blue/90"
              >
                Ver Detalhes (Demo)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
