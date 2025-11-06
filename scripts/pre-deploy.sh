#!/bin/bash

# Script de validação pré-deploy
# Garante que o código está pronto para produção

set -e # Para execução em caso de erro

echo "🔍 Iniciando validações pré-deploy..."
echo ""

# 1. Type Check
echo "📝 1/4 - Verificando tipos TypeScript..."
npm run type-check
echo "✅ Type check passou!"
echo ""

# 2. Lint
echo "🔎 2/4 - Verificando qualidade do código (ESLint)..."
npm run lint
echo "✅ Lint passou!"
echo ""

# 3. Format Check
echo "💅 3/4 - Verificando formatação (Prettier)..."
npm run format:check
echo "✅ Format check passou!"
echo ""

# 4. Build Test
echo "🏗️  4/4 - Testando build de produção..."
npm run build
echo "✅ Build de produção passou!"
echo ""

echo "✨ Todas as validações passaram! Código pronto para deploy."
echo ""
echo "📦 Para fazer deploy:"
echo "   1. Commit e push das mudanças"
echo "   2. Deploy no Portainer"
echo ""
