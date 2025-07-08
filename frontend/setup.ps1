Write-Host "🚀 Configurando UNB Events - Sistema Completo" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não está instalado. Por favor, instale o Node.js 18+ primeiro." -ForegroundColor Red
    exit 1
}

# Instalar dependências do frontend
Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
npm install

# Instalar dependências do backend
Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
Set-Location unb-events-backend
npm install

# Gerar cliente Prisma
Write-Host "🔧 Gerando cliente Prisma..." -ForegroundColor Yellow
npm run db:generate

# Voltar para a raiz
Set-Location ..

Write-Host ""
Write-Host "✅ Setup concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Configure o banco de dados PostgreSQL" -ForegroundColor White
Write-Host "2. Copie .env.example para .env no backend e configure as variáveis" -ForegroundColor White
Write-Host "3. Execute 'npm run db:push' no backend para criar as tabelas" -ForegroundColor White
Write-Host "4. Execute 'npm run dev:full' para iniciar frontend e backend" -ForegroundColor White
Write-Host ""
Write-Host "🔗 URLs:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "- Backend: http://localhost:3002" -ForegroundColor White
Write-Host "- Prisma Studio: http://localhost:5555" -ForegroundColor White
Write-Host ""
Write-Host "🎛️ Use o toggle no canto superior direito para alternar entre JSON Server e Backend Real" -ForegroundColor Cyan 