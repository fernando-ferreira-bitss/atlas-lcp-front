# API de Unidades - Propriedade e Exclusão Automática

## Visão Geral

A API de Unidades permite gerenciar quais unidades dos empreendimentos pertencem ao cliente. Vendas e propostas de unidades que **não pertencem** ao cliente são automaticamente marcadas como `ignorar_calculo = true`, sendo excluídas dos cálculos do dashboard.

### Fluxo

```
1. Usuário acessa tela de configuração de unidades
2. Lista todas as unidades do grupo
3. Seleciona quais unidades SÃO dele (pertence_cliente = true)
4. Salva → Backend atualiza unidades e vendas/propostas automaticamente
```

---

## Endpoints

### 1. Listar Unidades por Grupo

Lista todas as unidades de todos os empreendimentos de um grupo.

```
GET /api/v1/unidades/grupos/{grupo_id}
```

#### Parâmetros

| Parâmetro  | Tipo | Local | Obrigatório | Descrição                                    |
| ---------- | ---- | ----- | ----------- | -------------------------------------------- |
| `grupo_id` | int  | path  | Sim         | ID do grupo de empreendimentos               |
| `skip`     | int  | query | Não         | Offset para paginação (default: 0)           |
| `limit`    | int  | query | Não         | Limite de registros (default: 500, max: 500) |

#### Headers

```
Authorization: Bearer {token}
```

#### Resposta de Sucesso (200)

```json
{
  "total": 150,
  "skip": 0,
  "limit": 500,
  "items": [
    {
      "id": 1,
      "codigo_mega": 24089,
      "empreendimento_id": 5,
      "empreendimento_nome": "Residencial Aurora",
      "grupo_id": 1,
      "grupo_nome": "Grupo Premium",
      "nome": "101",
      "bloco_codigo": 1,
      "bloco_nome": "Torre A",
      "status": "Vendida",
      "valor": 450000.0,
      "tipologia": "2 quartos",
      "area_privativa": "65.00",
      "pertence_cliente": true,
      "created_at": "2025-12-12T15:00:00",
      "updated_at": "2025-12-12T15:30:00"
    },
    {
      "id": 2,
      "codigo_mega": 24090,
      "empreendimento_id": 5,
      "empreendimento_nome": "Residencial Aurora",
      "grupo_id": 1,
      "grupo_nome": "Grupo Premium",
      "nome": "102",
      "bloco_codigo": 1,
      "bloco_nome": "Torre A",
      "status": "Disponível",
      "valor": 480000.0,
      "tipologia": "3 quartos",
      "area_privativa": "78.50",
      "pertence_cliente": false,
      "created_at": "2025-12-12T15:00:00",
      "updated_at": "2025-12-12T15:00:00"
    }
  ]
}
```

#### Resposta de Erro (404)

```json
{
  "detail": "Grupo com ID 999 não encontrado"
}
```

---

### 2. Atualizar Propriedade de Unidades do Grupo

Atualiza quais unidades do grupo pertencem ao cliente.

- Unidades na lista `unidade_ids_pertence` → `pertence_cliente = true`
- Demais unidades do grupo → `pertence_cliente = false`
- Vendas e propostas são atualizadas automaticamente (`ignorar_calculo`)

```
PUT /api/v1/unidades/grupos/{grupo_id}
```

#### Parâmetros

| Parâmetro  | Tipo | Local | Obrigatório | Descrição                      |
| ---------- | ---- | ----- | ----------- | ------------------------------ |
| `grupo_id` | int  | path  | Sim         | ID do grupo de empreendimentos |

#### Headers

```
Authorization: Bearer {token}
Content-Type: application/json
```

#### Body

```json
{
  "unidade_ids_pertence": [1, 2, 5, 10, 15]
}
```

| Campo                  | Tipo  | Obrigatório | Descrição                                                                                                                                                          |
| ---------------------- | ----- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `unidade_ids_pertence` | int[] | Sim         | IDs das unidades que pertencem ao cliente. Todas as outras do grupo serão marcadas como não pertence. Enviar array vazio `[]` para marcar todas como não pertence. |

#### Resposta de Sucesso (200)

```json
{
  "total_grupo": 150,
  "pertence_cliente": 45,
  "nao_pertence": 105,
  "vendas_atualizadas": 230,
  "propostas_atualizadas": 85,
  "mensagem": "45 unidades marcadas como suas, 105 unidades de terceiros. 230 vendas e 85 propostas atualizadas."
}
```

#### Resposta de Erro (404)

```json
{
  "detail": "Grupo com ID 999 não encontrado"
}
```

---

## Exemplo de Implementação no Frontend

### React/TypeScript

```typescript
// types.ts
interface Unidade {
  id: number;
  codigo_mega: number;
  empreendimento_id: number;
  empreendimento_nome: string | null;
  grupo_id: number | null;
  grupo_nome: string | null;
  nome: string;
  bloco_codigo: number | null;
  bloco_nome: string | null;
  status: string | null;
  valor: number | null;
  tipologia: string | null;
  area_privativa: string | null;
  pertence_cliente: boolean;
  created_at: string;
  updated_at: string;
}

interface UnidadeListResponse {
  total: number;
  skip: number;
  limit: number;
  items: Unidade[];
}

interface UnidadeGrupoUpdate {
  unidade_ids_pertence: number[];
}

interface UnidadeGrupoResponse {
  total_grupo: number;
  pertence_cliente: number;
  nao_pertence: number;
  vendas_atualizadas: number;
  propostas_atualizadas: number;
  mensagem: string;
}
```

```typescript
// api.ts
const API_BASE = '/api/v1';

export async function getUnidadesByGrupo(
  grupoId: number,
  skip = 0,
  limit = 500
): Promise<UnidadeListResponse> {
  const response = await fetch(
    `${API_BASE}/unidades/grupos/${grupoId}?skip=${skip}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Erro ao carregar unidades');
  }

  return response.json();
}

export async function updatePropriedadeGrupo(
  grupoId: number,
  unidadeIdsPertence: number[]
): Promise<UnidadeGrupoResponse> {
  const response = await fetch(`${API_BASE}/unidades/grupos/${grupoId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      unidade_ids_pertence: unidadeIdsPertence,
    }),
  });

  if (!response.ok) {
    throw new Error('Erro ao atualizar propriedade');
  }

  return response.json();
}
```

```tsx
// UnidadesConfig.tsx
import { useState, useEffect } from 'react';
import { getUnidadesByGrupo, updatePropriedadeGrupo } from './api';

export function UnidadesConfig({ grupoId }: { grupoId: number }) {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUnidades();
  }, [grupoId]);

  async function loadUnidades() {
    setLoading(true);
    try {
      const response = await getUnidadesByGrupo(grupoId);
      setUnidades(response.items);

      // Inicializar seleção com unidades que já pertencem ao cliente
      const pertence = response.items.filter((u) => u.pertence_cliente).map((u) => u.id);
      setSelectedIds(new Set(pertence));
    } finally {
      setLoading(false);
    }
  }

  function toggleUnidade(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(unidades.map((u) => u.id)));
  }

  function deselectAll() {
    setSelectedIds(new Set());
  }

  async function handleSave() {
    setLoading(true);
    try {
      const result = await updatePropriedadeGrupo(grupoId, Array.from(selectedIds));

      alert(result.mensagem);
      loadUnidades(); // Recarregar para atualizar estado
    } catch (error) {
      alert('Erro ao salvar');
    } finally {
      setLoading(false);
    }
  }

  // Agrupar por empreendimento para melhor visualização
  const unidadesPorEmpreendimento = unidades.reduce(
    (acc, u) => {
      const key = u.empreendimento_nome || 'Sem empreendimento';
      if (!acc[key]) acc[key] = [];
      acc[key].push(u);
      return acc;
    },
    {} as Record<string, Unidade[]>
  );

  return (
    <div>
      <h2>Configurar Unidades do Grupo</h2>

      <div className="actions">
        <button onClick={selectAll}>Selecionar Todas</button>
        <button onClick={deselectAll}>Desmarcar Todas</button>
        <button onClick={handleSave} disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>

      <p>
        {selectedIds.size} de {unidades.length} unidades selecionadas como suas
      </p>

      {Object.entries(unidadesPorEmpreendimento).map(([empNome, unidadesEmp]) => (
        <div key={empNome} className="empreendimento-group">
          <h3>{empNome}</h3>
          <table>
            <thead>
              <tr>
                <th>Pertence</th>
                <th>Unidade</th>
                <th>Bloco</th>
                <th>Status</th>
                <th>Valor</th>
                <th>Tipologia</th>
              </tr>
            </thead>
            <tbody>
              {unidadesEmp.map((unidade) => (
                <tr key={unidade.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(unidade.id)}
                      onChange={() => toggleUnidade(unidade.id)}
                    />
                  </td>
                  <td>{unidade.nome}</td>
                  <td>{unidade.bloco_nome}</td>
                  <td>{unidade.status}</td>
                  <td>
                    {unidade.valor?.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td>{unidade.tipologia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
```

---

## Comportamento Automático

Quando o usuário atualiza a propriedade das unidades:

1. **Unidades selecionadas** → `pertence_cliente = true`
2. **Demais unidades do grupo** → `pertence_cliente = false`
3. **Vendas associadas**:
   - Se `pertence_cliente = true` → `ignorar_calculo = false`
   - Se `pertence_cliente = false` → `ignorar_calculo = true`
4. **Propostas associadas**: Mesma lógica das vendas

### Impacto no Dashboard

- Vendas/propostas com `ignorar_calculo = true` são **excluídas** dos cálculos
- Isso afeta: totais de vendas, conversão, VGV, etc.
- O campo `ignorar_calculo` é mantido para compatibilidade com filtros existentes

---

## Migração do Frontend

### Antes (Rotas Antigas - REMOVIDAS)

```
❌ GET  /api/v1/vendas-exclusao/grupos/{grupo_id}
❌ PUT  /api/v1/vendas-exclusao/grupos/{grupo_id}
```

### Agora (Novas Rotas)

```
✅ GET  /api/v1/unidades/grupos/{grupo_id}
✅ PUT  /api/v1/unidades/grupos/{grupo_id}
```

### Principais Diferenças

| Aspecto       | Antes            | Agora                  |
| ------------- | ---------------- | ---------------------- |
| Granularidade | Por venda        | Por unidade            |
| Seleção       | Vendas a IGNORAR | Unidades que PERTENCEM |
| Automação     | Manual           | Automático via sync    |
| Novas vendas  | Manual           | Automático             |

---

## Notas Importantes

1. **Sincronização**: As unidades são sincronizadas automaticamente junto com os contadores de empreendimentos (SOAP espelho de vendas)

2. **Novas unidades**: Criadas com `pertence_cliente = false` por padrão

3. **Novas vendas**: Durante a sincronização de vendas, o `ignorar_calculo` é definido automaticamente baseado na unidade

4. **Sem unidade**: Se uma venda não tem `cod_unidade` associado, ela NÃO é ignorada (comportamento seguro)

5. **Performance**: A lista de unidades pode ser grande. Use paginação se necessário.
