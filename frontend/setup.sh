#!/bin/bash

echo "🚀 Configurando UNB Events - Sistema Completo"
echo "=============================================="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js 18+ primeiro."
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
rm -rf node_modules
rm -rf node_modules/.prisma
npm install

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd unb-events-backend
npm install

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
npx prisma generate

# Voltar para a raiz
cd ..

echo ""
echo "✅ Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure o banco de dados PostgreSQL"
echo "2. Copie .env.example para .env no backend e configure as variáveis"
echo "3. Execute 'npm run db:push' no backend para criar as tabelas"
echo "4. Execute 'npm run dev:full' para iniciar frontend e backend"
echo ""
echo "🔗 URLs:"
echo "- Frontend: http://localhost:5173"
echo "- Backend: http://localhost:3002"
echo "- Prisma Studio: http://localhost:5555"
echo ""
echo "🎛️ Use o toggle no canto superior direito para alternar entre JSON Server e Backend Real"

npx ts-node seed.ts 