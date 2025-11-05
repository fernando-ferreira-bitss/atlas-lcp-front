# 🚀 Zero-Downtime Deployment (Continuous Deployment)

Este guia explica como fazer **redeploys sem derrubar a aplicação** usando **Docker Swarm mode** no Portainer.

---

## 📋 O Que É Zero-Downtime Deployment?

Quando você faz **redeploy** (atualizar para nova versão), o comportamento padrão do Docker Compose é:
1. ❌ Derrubar o container antigo
2. ⏳ Subir o novo container
3. ⏳ Esperar ficar pronto (clone Git + pnpm install + build Vite = ~3-5 min)
4. ✅ Aplicação volta a funcionar

**Problema:** Durante esse processo (3-5 minutos), a aplicação fica **indisponível** (downtime).

---

## ✅ Solução: Rolling Updates (Docker Swarm)

Com **Docker Swarm mode + Rolling Updates**:
1. ✅ Sobe o novo container
2. ⏳ Espera ficar **healthy** (healthcheck passa)
3. ✅ Traefik começa a rotear tráfego para o novo container
4. ✅ Só então derruba o container antigo

**Resultado:** **Zero downtime** - a aplicação nunca fica indisponível! 🎉

---

## 🏗️ Arquitetura

```
Usuario
   ↓
Traefik (Load Balancer)
   ↓
   ├─→ Container 1 (versão antiga) ← derruba depois
   └─→ Container 2 (versão nova)   ← sobe primeiro
```

---

## 🔧 Configuração (Já Implementada)

O `docker-compose.portainer.yml` já está configurado com:

### **1. Múltiplas Réplicas**
```yaml
deploy:
  mode: replicated
  replicas: 2  # Sempre mantém 2 containers rodando
```

### **2. Rolling Update Strategy**
```yaml
update_config:
  parallelism: 1          # Atualiza 1 container por vez
  delay: 10s              # Aguarda 10s entre atualizações
  failure_action: rollback # Volta para versão anterior se falhar
  monitor: 60s            # Monitora por 60s antes de atualizar próximo
  order: start-first      # CRÍTICO: Sobe o novo ANTES de derrubar o antigo
```

### **3. Rollback Automático**
```yaml
rollback_config:
  parallelism: 1
  delay: 5s
  failure_action: pause   # Para o rollback se falhar
  monitor: 30s
```

### **4. Healthcheck do Traefik**
```yaml
labels:
  - "traefik.http.services.lcp-front.loadbalancer.healthcheck.path=/health"
  - "traefik.http.services.lcp-front.loadbalancer.healthcheck.interval=10s"
```

---

## 🚀 Como Fazer Redeploy Sem Downtime

### **Opção 1: Via Portainer (Recomendado)**

1. Acesse: `https://portainer.brainitsolutions.com.br`
2. Vá em **Stacks** → `lcp-dashboard-front`
3. Clique em **Editor**
4. Clique em **Update the stack**
5. Marque: ✅ **Re-pull image and redeploy**
6. Clique em **Update**

**O que acontece:**
- ✅ Portainer detecta que é Swarm mode (pela seção `deploy`)
- ✅ Sobe um novo container
- ⏳ Aguarda healthcheck passar (`/health` retornar 200 OK)
- ✅ Traefik começa a rotear para o novo container
- ✅ Derruba o container antigo
- ✅ Repete o processo para o segundo container

**Tempo total:** ~6-10 minutos (mas aplicação **nunca fica fora do ar**!)

---

### **Opção 2: Via CLI (SSH no servidor)**

```bash
# Forçar redeploy (re-clone do Git + build)
docker service update --force lcp-dashboard-front_lcp-front
```

---

## 📊 Monitorar o Processo de Redeploy

### **Via Portainer**

1. Vá em **Services** (não Stacks)
2. Procure por `lcp-dashboard-front_lcp-front`
3. Você verá:
   - **Replicas:** `2/2` (ambas rodando)
   - **Update Status:** `updating...` durante o redeploy

### **Via CLI**

```bash
# Ver status do service
docker service ps lcp-dashboard-front_lcp-front

# Ver logs em tempo real
docker service logs -f lcp-dashboard-front_lcp-front

# Ver detalhes do service
docker service inspect lcp-dashboard-front_lcp-front
```

---

## 🔍 Verificar Zero-Downtime Funcionando

### **Teste Simples**

1. Abra o terminal
2. Execute um loop de requisições:

```bash
while true; do
  curl -s -o /dev/null -w "%{http_code} - %{time_total}s\n" \
    https://lcp.brainitsolutions.com.br/health
  sleep 1
done
```

3. Faça um redeploy via Portainer
4. Observe que **todas as requisições retornam 200 OK** (sem erros 502/503)

---

## ⚙️ Configurações Importantes

### **Réplicas (Escalabilidade)**

Você pode aumentar/diminuir o número de réplicas:

```yaml
deploy:
  replicas: 3  # 3 containers = mais tolerância a falhas
```

**Recomendações:**
- **Desenvolvimento:** 1 réplica (economiza recursos)
- **Produção (baixo tráfego):** 2 réplicas
- **Produção (alto tráfego):** 3+ réplicas

### **Ordem de Atualização**

```yaml
update_config:
  order: start-first  # Sobe o novo antes de derrubar o antigo (zero-downtime)
  # order: stop-first  # Derruba o antigo antes de subir o novo (downtime!)
```

**Sempre use `start-first` para zero-downtime!**

### **Tempo de Monitoring**

```yaml
update_config:
  monitor: 60s  # Aguarda 60s verificando se o novo container está saudável
```

**Recomendações:**
- **Frontend (build Vite + nginx):** `monitor: 60s`
- Se o build for muito lento: aumentar para `monitor: 90s`

---

## 🚨 Troubleshooting

### ❌ **Erro: "service not found"**

**Problema:** Stack foi criado no modo Compose (não Swarm)

**Solução:**
1. Delete o stack antigo
2. Recrie usando o novo `docker-compose.portainer.yml`
3. Portainer detectará automaticamente a seção `deploy` e criará um **Service** (Swarm)

---

### ❌ **Erro: "port already in use"**

**Problema:** Múltiplas réplicas tentando usar a mesma porta do host

**Solução:** A porta `3001:80` foi comentada no novo compose:
```yaml
# ports:
#   - "3001:80"  # Comentado para Swarm mode
```

O Traefik acessa os containers via **rede interna do Docker** (não precisa de porta no host).

---

### ❌ **Rollback aconteceu automaticamente**

**Problema:** O novo container falhou no healthcheck

**Possíveis causas:**
1. Erro no código (TypeScript ou build Vite)
2. Variáveis de ambiente faltando
3. Nginx não iniciou corretamente

**Verificar:**
```bash
# Ver logs do service (inclui containers antigos)
docker service logs lcp-dashboard-front_lcp-front

# Ver tentativas de update
docker service ps --no-trunc lcp-dashboard-front_lcp-front
```

---

### ❌ **Update muito lento (>15 minutos)**

**Problema:** `start_period: 180s` do healthcheck está esperando muito

**Solução:** Ajustar o healthcheck:
```yaml
healthcheck:
  start_period: 120s  # Reduzir para 120s se o build for consistente
```

---

## 📈 Benefícios do Zero-Downtime Deployment

✅ **Alta Disponibilidade:** Aplicação nunca fica fora do ar
✅ **Rollback Automático:** Se a nova versão falhar, volta automaticamente para a versão anterior
✅ **Load Balancing:** Traefik distribui requisições entre containers saudáveis
✅ **Blue-Green Deployment:** Container novo é testado antes de derrubar o antigo
✅ **Monitoramento Inteligente:** Aguarda healthcheck passar antes de considerar pronto

---

## 🔄 Fluxo Completo de Update

```
1. [User] Git push → GitHub (nova versão)
   ↓
2. [Admin] Portainer → Update Stack
   ↓
3. [Swarm] Inicia novo container (Replica #2)
   ↓
4. [Container] Clone Git → pnpm install → Vite build → nginx start
   ↓
5. [Healthcheck] /health retorna 200 OK (após ~3-5 min)
   ↓
6. [Traefik] Detecta novo container healthy → Adiciona ao load balancer
   ↓
7. [Swarm] Container novo OK → Derruba container antigo (Replica #1)
   ↓
8. [Swarm] Inicia outro novo container (Replica #1)
   ↓
9. [Healthcheck] /health retorna 200 OK
   ↓
10. [Traefik] Adiciona segundo container → Agora ambos são nova versão
    ↓
11. ✅ Update completo - zero downtime!
```

---

## 🎯 Comparação: Antes vs Depois

| Aspecto | **Sem Swarm (Antes)** | **Com Swarm (Agora)** |
|---------|----------------------|----------------------|
| **Downtime** | ❌ 3-5 minutos | ✅ 0 segundos |
| **Réplicas** | 1 container | 2+ containers |
| **Rollback** | ❌ Manual | ✅ Automático |
| **Healthcheck** | ❌ Interno (Docker) | ✅ Externo (Traefik) |
| **Load Balancing** | ❌ Não | ✅ Sim (Traefik) |
| **Tolerância a falhas** | ❌ Baixa | ✅ Alta |

---

## 📚 Referências

- [Docker Swarm - Update Service](https://docs.docker.com/engine/swarm/swarm-tutorial/rolling-update/)
- [Traefik - Load Balancing](https://doc.traefik.io/traefik/routing/services/#load-balancing)
- [Portainer - Deploy as Stack](https://docs.portainer.io/user/docker/stacks/add)

---

**Última atualização:** 2025-11-05
**Versão:** 1.0

---

**Happy Zero-Downtime Deploys! 🚀**
