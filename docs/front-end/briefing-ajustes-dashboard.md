# 📋 BRIEFING DE AJUSTES - DASHBOARD TV

## 📌 Contexto
Dashboard que ficará fixo em uma TV dentro da empresa. O cliente avaliou o protótipo inicial e solicitou ajustes na estrutura e organização dos elementos.

---

## ✅ O QUE ESTÁ BOM (manter)

- ✓ Gráfico de vendas por empreendimento + taxa de conversão
- ✓ Top 5 empreendimentos (propostas vs vendas)
- ✓ Últimas vendas
- ✓ Os dois velocímetros (Meta VGV Acumulado Anual e Mensal)

---

## 🔴 PROBLEMAS IDENTIFICADOS

### 1. Funil Superior (Métricas Principais)

**Problema Atual:**
A representação visual em formato de funil das métricas (430 Propostas → 291 Vendas → 67,7% Conversão → R$ 50 mil Ticket Médio) está gerando confusão visual.

**Por que está errado:**
- O formato de funil dá a entender que cada métrica deriva da anterior
- Verde (vendas) realmente deriva do azul (propostas) ✅ correto
- Roxo (conversão) NÃO deriva de vendas ❌ incorreto
- Laranja (ticket médio) NÃO deriva de conversão ❌ incorreto

**Solução Requerida:**

1. **Adicionar etapa de RESERVAS ao funil**
2. **O funil deve ter apenas 3 etapas sequenciais:**
   - RESERVAS (nova métrica - verificar dados no backend)
   - PROPOSTAS (430)
   - VENDAS (291)

3. **Conversão (67,7%) e Ticket Médio (R$ 50 mil) devem SAIR do funil**
   - Apresentar como métricas auxiliares/complementares
   - Posicionar próximas ao funil, mas FORA do fluxo visual
   - Não devem dar a impressão de derivação sequencial

---

### 2. Layout Geral

**Problema:**
A disposição dos elementos não está otimizada. Alguns componentes ocupam espaço desnecessário enquanto outros que deveriam ter destaque estão secundarizados.

**Feedback do Cliente:**
> "O gráfico de vendas por empreendimentos não ganha nada em ocupar o comprimento da tela. Ele poderia cumprir um terço da tela. O que a gente mais ganha em deixar comprido é o gráfico de evolução (meta vs realizado)."

> "Os velocímetros deveriam estar no centro, como elemento principal, porque mostram o quanto por cento da meta estamos batendo."

---

## 🎯 NOVO LAYOUT PROPOSTO

### Estrutura: 9 Quadrantes (3 linhas x 3 colunas)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LINHA 1 (3 colunas)                         │
├───────────────────┬─────────────────────┬───────────────────────────┤
│                   │                     │                           │
│   COLUNA 1        │   COLUNA 2          │   COLUNA 3                │
│                   │                     │                           │
│   FUNIL           │   ÚLTIMAS VENDAS    │   TOP 5 EMPREENDIMENTOS   │
│   • Reservas      │                     │   (Propostas/Vendas)      │
│   • Propostas     │   Tabela com        │                           │
│   • Vendas        │   últimas vendas    │   Gráfico de barras       │
│                   │   realizadas        │   comparativo             │
│   Métricas        │                     │                           │
│   Auxiliares:     │                     │                           │
│   - Conversão     │                     │                           │
│   - Ticket Médio  │                     │                           │
│                   │                     │                           │
└───────────────────┴─────────────────────┴───────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         LINHA 2 (3 colunas)                         │
├───────────────────┬─────────────────────┬───────────────────────────┤
│                   │                     │                           │
│   COLUNA 1        │   COLUNA 2          │   COLUNA 3                │
│                   │   ⭐ DESTAQUE ⭐     │                           │
│   VENDAS POR      │                     │   ESPAÇO DISPONÍVEL       │
│   EMPREENDIMENTO  │   VELOCÍMETROS      │                           │
│   + TAXA CONV.    │                     │   (Outra métrica ou       │
│                   │   • Meta VGV Anual  │    KPI relevante)         │
│   (Reduzir para   │   • Meta VGV Mensal │                           │
│    ~33% largura)  │                     │                           │
│                   │   Este é o elemento │                           │
│                   │   CENTRAL e mais    │                           │
│                   │   importante        │                           │
│                   │                     │                           │
└───────────────────┴─────────────────────┴───────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    LINHA 3 (largura completa)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                     GRÁFICO DE EVOLUÇÃO                             │
│              Meta vs Realizado (2024 vs 2025)                       │
│                                                                     │
│        (Esticado horizontalmente, ocupa toda a largura)             │
│    Este gráfico se beneficia de ter o máximo de comprimento        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📐 ESPECIFICAÇÕES TÉCNICAS

### Grid CSS Sugerido

```css
.dashboard-container {
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  height: 100vh;
  padding: 20px;
}

/* Linha 3 ocupa todas as colunas */
.grafico-evolucao {
  grid-column: 1 / 4;
  grid-row: 3;
}

/* Centralizar velocímetros como destaque */
.velocimetros-container {
  grid-column: 2;
  grid-row: 2;
}
```

---

## 🗂️ MAPEAMENTO DE COMPONENTES

### LINHA 1

**[Posição 1,1] - Funil de Vendas**
- Componente: `<FunilVendas />`
- Conteúdo:
  - RESERVAS (nova métrica)
  - PROPOSTAS (430)
  - VENDAS (291)
- Métricas auxiliares (fora do funil visual):
  - Conversão: 67,7%
  - Ticket Médio: R$ 50 mil

**[Posição 1,2] - Últimas Vendas**
- Componente: `<UltimasVendas />`
- Manter como está
- Tabela com vendas recentes

**[Posição 1,3] - Top 5 Empreendimentos**
- Componente: `<Top5Empreendimentos />`
- Manter como está
- Gráfico comparativo propostas vs vendas

---

### LINHA 2

**[Posição 2,1] - Vendas por Empreendimento**
- Componente: `<VendasPorEmpreendimento />`
- **IMPORTANTE:** Reduzir largura para aproximadamente 33% da tela
- Manter taxa de conversão ao lado
- Não precisa ocupar muito espaço horizontal

**[Posição 2,2] - ⭐ VELOCÍMETROS (DESTAQUE)**
- Componente: `<VelocimetrosVGV />`
- **ELEMENTO CENTRAL E PRINCIPAL DO DASHBOARD**
- Meta VGV Acumulado Anual (YTD: 47%)
- Meta VGV Acumulado Mensal (Ideal dia 10: 100%)
- Este é o indicador mais importante - deve chamar atenção

**[Posição 2,3] - Espaço Disponível**
- Componente: A definir
- Sugestão: Outro KPI relevante ou métrica complementar

---

### LINHA 3

**[Posição 3,1-3] - Gráfico de Evolução**
- Componente: `<GraficoEvolucao />`
- **OCUPAR TODA A LARGURA DA TELA**
- Meta vs Realizado
- Comparativo 2024 vs 2025
- Este gráfico se beneficia de ser esticado horizontalmente

---

## 🔧 TAREFAS DE IMPLEMENTAÇÃO

### Prioridade ALTA 🔴

1. **Refatorar componente do Funil**
   - [ ] Adicionar campo RESERVAS ao funil
   - [ ] Remover Conversão e Ticket Médio do fluxo visual do funil
   - [ ] Criar cards/badges auxiliares para Conversão e Ticket Médio
   - [ ] Posicionar métricas auxiliares próximas mas claramente separadas
   - [ ] Verificar disponibilidade de dados de RESERVAS no backend

2. **Reorganizar Grid Layout**
   - [ ] Implementar estrutura CSS Grid 3x3
   - [ ] Configurar gráfico de evolução para ocupar linha completa
   - [ ] Centralizar velocímetros na posição [2,2]
   - [ ] Garantir responsividade para tela de TV

### Prioridade MÉDIA 🟡

3. **Ajustar componente Vendas por Empreendimento**
   - [ ] Redimensionar para ocupar ~33% da largura (1 coluna do grid)
   - [ ] Manter legibilidade dos dados mesmo com largura reduzida
   - [ ] Ajustar fontes e espaçamentos se necessário

4. **Destacar Velocímetros**
   - [ ] Aumentar tamanho visual dos velocímetros
   - [ ] Aplicar destaque visual (sombra, borda, animação sutil)
   - [ ] Garantir que sejam o elemento de maior impacto visual

### Prioridade BAIXA 🟢

5. **Ajustes Finais**
   - [ ] Revisar espaçamentos entre componentes (gap do grid)
   - [ ] Ajustar paleta de cores para melhor contraste
   - [ ] Testar em resolução de TV (Full HD / 4K)
   - [ ] Adicionar transições suaves entre atualizações de dados

---

## 📊 CHECKLIST DE DADOS

Verificar disponibilidade no backend:

- ✅ Propostas (430)
- ✅ Vendas (291)
- ✅ Conversão (67,7%)
- ✅ Ticket Médio (R$ 50 mil)
- ✅ Meta VGV Anual
- ✅ Meta VGV Mensal
- ✅ Dados de evolução mensal
- ✅ Vendas por empreendimento
- ✅ Top 5 empreendimentos
- ✅ Últimas vendas
- ❓ **RESERVAS** (VERIFICAR SE EXISTE)

---

## 💡 OBSERVAÇÕES IMPORTANTES

1. **Hierarquia Visual:**
   - O cliente enfatizou que os velocímetros devem ser o elemento central
   - "Quanto por cento da meta estamos batendo" é a informação mais crítica
   - Posicionamento central reforça essa importância

2. **Uso Eficiente de Espaço:**
   - Gráficos horizontais (evolução) ganham com largura
   - Gráficos verticais (vendas por empreendimento) não precisam de muita largura
   - Não desperdiçar espaço horizontal com componentes que não se beneficiam disso

3. **Semântica do Funil:**
   - Apenas incluir no funil métricas que realmente representam um fluxo sequencial
   - Conversão e Ticket Médio são métricas derivadas, não etapas do funil
   - Manter clareza na leitura: Reservas → Propostas → Vendas

4. **Referência Visual:**
   - Cliente enviou imagem de referência com estrutura 9 quadrantes
   - Seguir essa lógica de organização
   - Última linha unificada para gráfico de evolução

---

## 🎨 DESIGN SYSTEM

Manter consistência:
- Cores do funil: usar cores distintas para cada etapa
- Métricas auxiliares: estilo diferenciado (badges, cards menores)
- Velocímetros: maior tamanho, destaque visual
- Gráfico de evolução: altura adequada, aproveitar largura total

---

## 🚀 PRÓXIMOS PASSOS

1. Verificar disponibilidade da métrica RESERVAS no backend
2. Implementar novo layout em Grid 3x3
3. Refatorar componente de Funil
4. Testar em resolução de TV
5. Validar com cliente

---

**Desenvolvido para:** Dashboard TV - Empresa
**Data:** 06/11/2025
**Ferramenta:** Claude Code
