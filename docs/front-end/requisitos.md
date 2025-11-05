# 📘 Documentação de Requisitos - Dashboard de Vendas

## 1. Visão Geral

A aplicação tem como objetivo oferecer uma visão consolidada dos indicadores comerciais, permitindo a análise de desempenho por empreendimento e período. O sistema visa apoiar decisões estratégicas com base em dados de propostas, vendas e metas.

---

## 2. Escopo Funcional

### 2.1. Dashboard

**Objetivo:** Exibir indicadores de performance e relatórios visuais de vendas.

#### Funcionalidades:

* Filtros de visualização:

  * Período: `Mensal`, `YTD`, `Últimos 12 meses`.
  * Empreendimento: lista suspensa com os empreendimentos cadastrados.
  * Período personalizado: seleção de datas (de / até).
  * Botão **Filtrar** (executa a atualização dos dados).
  * Botão **Exportar CSV/XLSX** (exporta os dados atuais do dashboard).

#### Indicadores principais (cards):

1. **Volume de Propostas** – quantidade total de propostas.
2. **Volume de Vendas** – quantidade total de vendas.
3. **Conversão (Qtd)** – relação entre propostas e vendas (%).
4. **Conversão (R$)** – relação financeira das conversões.
5. **Ticket Médio (Proposta)** – média de valores propostos.
6. **Ticket Médio (Venda)** – média de valores vendidos.
7. **Meta VGV Mensal** – percentual de meta atingida no mês.
8. **Meta VGV YTD** – percentual de meta atingida no ano.

#### Gráficos e relatórios visuais:

* **Atendimento de Metas:** indicadores de gauge (meta mensal e YTD).
* **Meta vs Realizado (Mensal):** comparativo mensal entre meta e valor realizado.
* **Evolução de Vendas (2024 vs 2025):** comparação entre dois anos.
* **Taxa de Conversão por Empreendimento:** barras horizontais por empreendimento.
* **Vendas por Empreendimento:** compara propostas x vendas.
* **Evolução do Ticket Médio:** linhas para proposta e venda.

#### Tabela: Últimas Vendas

* Colunas:

  * Empreendimento
  * Condição (ex: à vista, financiamento)
  * VGV (Valor Global de Vendas)
  * Data da venda
  * Ação (botão **Detalhes**)

#### Requisitos de exportação:

* O usuário pode exportar os dados do dashboard em CSV ou XLSX.
* O arquivo deve conter os dados filtrados conforme seleção atual.

---

## 3. Requisitos Não Funcionais

| Categoria           | Requisito                                                                           |
| ------------------- | ----------------------------------------------------------------------------------- |
| **Usabilidade**     | Interface responsiva, com feedback visual nos botões e interatividade nos gráficos. |
| **Performance**     | Atualização de dados em até 2 segundos após o clique em "Filtrar".                  |
| **Segurança**       | Controle de acesso por perfil (Admin / Usuário).                                    |
| **Compatibilidade** | Suporte para Chrome, Edge, Safari e Firefox.                                        |
| **Exportação**      | Geração de relatórios nos formatos CSV e XLSX.                                      |

---

## 4. Layout Geral

### Estrutura da Interface

1. **Menu Lateral:**

   * Itens: Dashboard, Propostas, Vendas, Relatórios, Configurações.
   * Exibição fixa à esquerda.
2. **Cabeçalho:**

   * Nome do módulo (Dashboard) e botão "Sair".
3. **Conteúdo Principal:**

   * Filtros, indicadores, gráficos e tabelas.
4. **Rodapé:**

   * Exibe informações do usuário logado (e-mail e perfil).

---

## 5. Perfis de Usuário

* **Admin:** acesso completo, com permissão para exportar dados e configurar parâmetros.
* **Usuário:** acesso restrito à visualização dos dados e relatórios.
