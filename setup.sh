#!/bin/bash

# ============================================
# SCRIPT DE CONFIGURAÇÃO RÁPIDA
# ============================================
# Execute estes comandos na ordem para configurar tudo

echo "🚀 Configurando aplicação Brain Tumor Detection..."

# ============================================
# 1. Criar arquivo .env.local
# ============================================
echo ""
echo "📝 Passo 1: Criando .env.local..."

# Windows PowerShell
Copy-Item .env.example .env.local

# Ou Mac/Linux
# cp .env.example .env.local

echo "✅ .env.local criado!"
echo "⚠️  IMPORTANTE: Edite o arquivo .env.local com suas credenciais do Firebase"
echo ""

# ============================================
# 2. Instalar dependências
# ============================================
echo "📦 Passo 2: Instalando dependências..."
npm install
echo "✅ Dependências instaladas!"
echo ""

# ============================================
# 3. Executar em modo desenvolvimento
# ============================================
echo "🎯 Passo 3: Pronto para executar!"
echo ""
echo "Execute o comando abaixo para iniciar:"
echo "  npm run dev"
echo ""
echo "Depois acesse: http://localhost:3000"
echo ""

# ============================================
# COMANDOS ÚTEIS
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 COMANDOS ÚTEIS:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "# Desenvolvimento"
echo "npm run dev              # Inicia servidor de desenvolvimento"
echo ""
echo "# Build"
echo "npm run build            # Gera build de produção"
echo "npm start                # Executa build de produção"
echo ""
echo "# Testes"
echo "npm run lint             # Verifica erros de código"
echo ""
echo "# Deploy (Vercel)"
echo "npm i -g vercel          # Instala Vercel CLI"
echo "vercel                   # Deploy de teste"
echo "vercel --prod            # Deploy de produção"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ============================================
# CHECKLIST
# ============================================
echo "✅ CHECKLIST DE CONFIGURAÇÃO:"
echo ""
echo "1. [ ] Criar projeto Firebase"
echo "     → https://console.firebase.google.com/"
echo ""
echo "2. [ ] Criar Firestore Database"
echo "     → Firebase Console > Firestore Database > Criar"
echo ""
echo "3. [ ] Obter credenciais"
echo "     → Configurações > Seus aplicativos > Web"
echo ""
echo "4. [ ] Configurar .env.local"
echo "     → Editar arquivo com credenciais do passo 3"
echo ""
echo "5. [ ] Configurar regras Firestore"
echo "     → Copiar de firestore.rules (Opção 2 ou 3)"
echo ""
echo "6. [ ] Testar aplicação"
echo "     → npm run dev"
echo "     → Abrir http://localhost:3000"
echo "     → Testar upload desktop"
echo "     → Testar QR Code mobile"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 DOCUMENTAÇÃO:"
echo "  • README_SESSAO_MOBILE.md  - Documentação completa"
echo "  • INICIO_RAPIDO.md         - Guia de início rápido"
echo "  • EXEMPLOS_USO.txt         - Exemplos de código"
echo "  • firestore.rules          - Regras de segurança"
echo "  • RESUMO_FINAL.md          - Resumo executivo"
echo ""
echo "🎉 Tudo pronto! Configure o Firebase e comece a usar!"
