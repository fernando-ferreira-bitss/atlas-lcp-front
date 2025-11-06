# 🚀 Guia de Deploy - Dashboard LCP

## ⚠️ IMPORTANTE: Validação Antes do Deploy

**NUNCA faça deploy sem validar o código primeiro!**

## 📋 Checklist Pré-Deploy

### 1️⃣ Validação Automática (OBRIGATÓRIO)

```bash
npm run pre-deploy
```

Este comando executa:
- ✅ Type Check (TypeScript)
- ✅ Lint (ESLint)  
- ✅ Format Check (Prettier)
- ✅ Build Test (Vite)

**Se alguma validação falhar, NÃO faça deploy!**

---

## 🔄 Processo de Deploy

### Passo 1: Validar Código
```bash
npm run pre-deploy
```

### Passo 2: Commit e Push
```bash
git add .
git commit -m "feat: descrição"
git push origin main
```

### Passo 3: Deploy no Portainer
1. Acesse o Portainer
2. Rebuild do container
3. Restart

---

## 🚨 Erros Comuns

### Import não utilizado
```bash
npm run lint:fix
```

### Propriedade inexistente
Verifique o tipo em `types/index.ts`

### Tipo incorreto
```typescript
return response.data; // não response
```

---

**Última atualização:** 06/11/2025
