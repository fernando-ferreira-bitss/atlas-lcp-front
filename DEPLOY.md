# 🚀 Deploy LCP Dashboard Frontend - Portainer

Guia completo para deploy da aplicação React no Portainer com Traefik.

---

## 📋 Pré-requisitos

- Portainer instalado e configurado
- Traefik configurado com rede `n8n_traefik_proxy`
- Domínio `lcp.brainitsolutions.com.br` apontando para o servidor
- Certificado SSL configurado no Traefik (Let's Encrypt)
- Repositório Git acessível (público ou com token)

---

## 🔧 Configuração no Portainer

### 1. Criar Stack

1. Acesse **Portainer** → **Stacks** → **Add stack**
2. Nome da stack: `lcp-dashboard-front`
3. Build method: **Git Repository** ou **Web editor**

### 2. Configurar Variáveis de Ambiente

No Portainer, adicione as seguintes variáveis de ambiente:

#### Git Configuration
```env
GIT_REPO=https://github.com/fernando-ferreira-bitss/lcp-front.git
GIT_BRANCH=main
GIT_TOKEN=seu_token_github_aqui (se repositório privado)
```

#### Vite Environment Variables
```env
VITE_API_BASE_URL=https://apilcp.brainitsolutions.com.br
VITE_APP_NAME=Dashboard LCP
VITE_ENABLE_ANALYTICS=false
```

#### Container Configuration
```env
NODE_ENV=production
```

### 3. Arquivo docker-compose.yml

Copie o conteúdo do arquivo `docker-compose.portainer.yml` para o Web editor do Portainer.

### 4. Deploy

Clique em **Deploy the stack** e aguarde a inicialização.

---

## 🌐 Acesso

Após o deploy bem-sucedido, a aplicação estará disponível em:

- **Frontend:** https://lcp.brainitsolutions.com.br
- **API:** https://apilcp.brainitsolutions.com.br

---

## 🔍 Verificação de Saúde

### Health Check
```bash
curl https://lcp.brainitsolutions.com.br/health
```

Resposta esperada: `healthy`

### Logs do Container
No Portainer:
1. Acesse **Containers** → **lcp-front**
2. Clique em **Logs**
3. Verifique se não há erros

Você deve ver:
```
📥 Installing git and nginx...
📦 Cloning repository...
📦 Installing pnpm...
🔧 Installing dependencies with pnpm...
🏗️ Building frontend with Vite...
📝 Configuring nginx...
🚀 Starting nginx...
```

---

## 🔄 Atualização da Aplicação

Para atualizar a aplicação após novos commits:

### Método 1: Restart do Container (Recomendado)
1. No Portainer, acesse **Stacks** → **lcp-dashboard-front**
2. Clique em **Stop stack**
3. Aguarde parar completamente
4. Clique em **Start stack**

O container irá:
- Clonar a versão mais recente do repositório
- Instalar dependências atualizadas
- Fazer novo build
- Iniciar o nginx

### Método 2: Recreate Container
1. Acesse **Containers** → **lcp-front**
2. Clique em **Recreate**
3. Marque **Pull latest image**
4. Clique em **Recreate**

---

## 🐛 Troubleshooting

### Problema: Build falha

**Causa:** Dependências ou código com erros.

**Solução:**
```bash
# 1. Verifique os logs do container
# 2. Execute localmente:
pnpm install
pnpm run type-check
pnpm run build
```

### Problema: Página não carrega (erro 502/503)

**Causa:** Container não está rodando ou nginx não iniciou.

**Solução:**
1. Verifique o status do container no Portainer
2. Verifique os logs para erros
3. Teste o health check: `curl http://localhost/health` (dentro do container)

### Problema: Erro CORS

**Causa:** API não está permitindo requisições do domínio do frontend.

**Solução:**
No backend, adicione à variável `ALLOWED_ORIGINS`:
```env
ALLOWED_ORIGINS=https://lcp.brainitsolutions.com.br
```

### Problema: Variáveis de ambiente não funcionam

**Causa:** Vite requer prefixo `VITE_` para expor variáveis ao browser.

**Solução:**
- ✅ Correto: `VITE_API_BASE_URL`
- ❌ Errado: `API_BASE_URL`

Todas as variáveis usadas no código devem começar com `VITE_`.

---

## 🔐 Segurança

### Headers de Segurança (já configurados no nginx)
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`

### SSL/TLS
- Certificado gerenciado pelo Traefik (Let's Encrypt)
- Redirecionamento HTTP → HTTPS automático (via Traefik)

### Repositório Privado
Se o repositório for privado, configure um Personal Access Token (PAT):

1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Permissões: `repo` (acesso completo)
4. Copie o token e adicione na variável `GIT_TOKEN` no Portainer

---

## 📊 Monitoramento

### Métricas do Container
No Portainer, você pode ver:
- CPU Usage
- Memory Usage
- Network I/O

### Logs em Tempo Real
```bash
# Via Portainer Web UI
Containers → lcp-front → Logs → Auto-refresh

# Via Docker CLI (se tiver acesso SSH)
docker logs -f lcp-front
```

---

## 🔄 Rollback

Para reverter para uma versão anterior:

### Método 1: Via Git Branch/Tag
1. No Portainer, edite a stack
2. Altere `GIT_BRANCH=main` para `GIT_BRANCH=nome-da-branch-anterior`
3. Update the stack

### Método 2: Via Git Commit
1. No repositório Git, reverta o commit
2. Faça push
3. Restart da stack no Portainer

---

## 📝 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas no Portainer
- [ ] Domínio `lcp.brainitsolutions.com.br` apontando para servidor
- [ ] Traefik configurado e rodando
- [ ] Network `n8n_traefik_proxy` criada
- [ ] Backend (API) rodando em `apilcp.brainitsolutions.com.br`
- [ ] CORS configurado no backend para aceitar frontend
- [ ] Stack criada no Portainer com nome `lcp-dashboard-front`
- [ ] Container `lcp-front` rodando (status: running)
- [ ] Health check retornando `healthy`
- [ ] Frontend acessível via HTTPS
- [ ] Login funcionando (testando autenticação com backend)

---

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique os logs do container
2. Teste o health check
3. Verifique conectividade com a API
4. Consulte a documentação do projeto em `CLAUDE.md`

---

**Última atualização:** 2025-11-05
**Mantido por:** Equipe de Desenvolvimento LCP
