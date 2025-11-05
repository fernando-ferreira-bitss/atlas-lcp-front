# ⚙️ Escopo de Desenvolvimento - Dashboard de Vendas

## 1. Arquitetura da Solução

A aplicação será desenvolvida em arquitetura **web modular**, com separação entre **frontend**, **backend** e **banco de dados**.

### 1.1. Tecnologias Sugeridas

| Camada             | Tecnologia                        | Descrição                                                     |
| ------------------ | --------------------------------- | ------------------------------------------------------------- |
| **Frontend**       | React.js / Next.js                | Framework para construção da interface dinâmica e responsiva. |
| **Estilização**    | TailwindCSS / Shadcn UI           | Componentes reutilizáveis e estilização moderna.              |
| **Gráficos**       | Recharts ou Chart.js              | Renderização dos gráficos e indicadores.                      |
| **Backend**        | Node.js (Express.js) ou .NET Core | Camada de API REST para fornecimento dos dados.               |
| **Banco de Dados** | PostgreSQL / MySQL                | Armazenamento dos dados de propostas, vendas e metas.         |
| **Autenticação**   | JWT (JSON Web Token)              | Controle de acesso seguro.                                    |
| **Exportação**     | Biblioteca XLSX / CSV Parser      | Geração dos relatórios exportáveis.                           |

---

## 2. Estrutura de Módulos

### 2.1. Módulo de Autenticação

* Login e logout de usuários.
* Controle de permissões (Admin / Usuário).
* Sessão mantida via token JWT.

### 2.2. Módulo de Dashboard

#### Funcionalidades Principais

* Exibição dos indicadores (cards de performance).
* Gráficos de acompanhamento (vendas, metas, ticket médio, etc.).
* Tabela de últimas vendas com ação de detalhes.

#### APIs Principais

| Método | Endpoint                     | Descrição                                                   |
| ------ | ---------------------------- | ----------------------------------------------------------- |
| `GET`  | `/api/dashboard/indicadores`        | Retorna métricas gerais (propostas, vendas, metas).         |
| `GET`  | `/api/dashboard/graficos`    | Retorna dados para os gráficos de desempenho.               |
| `GET`  | `/api/dashboard/vendas`      | Lista últimas vendas.                                       |
| `GET`  | `/api/empreendimentos`       | Retorna lista de empreendimentos disponíveis.               |
| `GET`  | `/api/export`                | Gera e retorna arquivo CSV/XLSX conforme filtros aplicados. |

### 2.3. Módulo de Propostas

* Cadastro e listagem de propostas.
* Integração com módulo de vendas para cálculo de conversão.

### 2.4. Módulo de Vendas

* Registro de novas vendas com vínculo a propostas e empreendimentos.
* Armazenamento do VGV e condições (à vista, financiamento, etc.).

### 2.5. Módulo de Relatórios

* Exportação de relatórios analíticos.
* Visualização filtrada por período e empreendimento.

### 2.6. Módulo de Configurações

* Gestão de metas e parâmetros de cálculo (percentuais, metas mensais e anuais).

---

## 3. Banco de Dados (Modelo Simplificado)

**Tabelas Principais:**

* **usuarios** (id, nome, email, senha_hash, perfil, ativo)
* **empreendimentos** (id, nome, status, localizacao)
* **propostas** (id, empreendimento_id, valor, data, status)
* **vendas** (id, proposta_id, empreendimento_id, valor, condicao, data)
* **metas** (id, empreendimento_id, tipo, valor_meta, periodo, ano)

---

## 4. Integração e Lógica de Negócio

### 4.1. Cálculos automáticos

* **Conversão (Qtd):** `(Total de Vendas / Total de Propostas) * 100`
* **Conversão (R$):** `(Valor total de vendas / Valor total de propostas) * 100`
* **Ticket Médio:** `(Soma dos valores / quantidade)`
* **Meta atingida:** `(Valor realizado / Meta prevista) * 100`

### 4.2. Atualização dos Gráficos

* Dados carregados dinamicamente conforme filtros aplicados.
* API deve retornar dados agregados por mês/ano.

### 4.3. Exportação de Dados

* Backend gera arquivo temporário CSV/XLSX com base nos filtros ativos.
* Link de download disponibilizado ao usuário.

---

## 5. Requisitos Técnicos

| Categoria            | Requisito                                        |
| -------------------- | ------------------------------------------------ |
| **Frontend**         | SPA responsiva, com suporte a desktop e tablet.  |
| **Backend**          | API REST padronizada (JSON).                     |
| **Banco de Dados**   | Consultas otimizadas com índices e agregações.   |
| **Segurança**        | Tokens JWT, CORS habilitado e HTTPS obrigatório. |
| **Logs e Auditoria** | Registro de acessos e exportações.               |
| **Performance**      | Tempo máximo de resposta da API: 2s.             |

---

## 6. Entregáveis

* [ ] Interface de login e autenticação.
* [ ] Tela de Dashboard com todos os gráficos e indicadores.
* [ ] Integração com backend e banco de dados.
* [ ] Funcionalidade de exportação CSV/XLSX.
* [ ] Controle de acesso por perfil.
* [ ] Documentação técnica e API endpoints.

---

## 7. Futuras Evoluções (Backlog)

* Integração com BI externo (Power BI / Looker Studio).
* Dashboards personalizados por usuário.
* Alertas automáticos de metas não atingidas.
* Aplicativo mobile (versão resumida do painel).
