# Guia de Integração - UNB Events

Este guia explica como integrar o frontend existente com o novo backend real, mantendo o json-server como opção de desenvolvimento.

## 🎯 Objetivo

Criar um backend completo com Node.js, Express, TypeScript e PostgreSQL que implementa todos os endpoints existentes no frontend, permitindo alternar entre o json-server (mock) e o backend real.

## 🏗️ Arquitetura Implementada

### Frontend (React + TypeScript)
- ✅ Mantido como estava
- ✅ Adicionado toggle para alternar entre APIs
- ✅ Configuração centralizada de URLs
- ✅ Compatibilidade com ambos os backends

### Backend Real (Node.js + Express + TypeScript)
- ✅ Autenticação JWT
- ✅ Banco PostgreSQL com Prisma
- ✅ Upload de arquivos
- ✅ Controle de acesso baseado em roles
- ✅ Validação de dados
- ✅ Tratamento de erros

## 📁 Estrutura Criada

```
unb-events-backend/
├── src/
│   ├── controllers/     # Controladores da API
│   ├── services/        # Lógica de negócio
│   ├── routes/          # Definição de rotas
│   ├── middleware/      # Middlewares (auth, etc.)
│   └── server.ts        # Arquivo principal
├── prisma/
│   └── schema.prisma    # Schema do banco
└── package.json
```

## 🔧 Configuração

### 1. Backend

```bash
cd unb-events-backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Gerar cliente Prisma
npm run db:generate

# Criar tabelas no banco
npm run db:push
```

### 2. Frontend

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev
```

## 🔄 Alternância entre APIs

### Toggle na Interface
- Use o switch no canto superior direito
- Alterna entre "JSON Server" e "Backend Real"
- Recarrega a página automaticamente

### Configuração Manual
```typescript
// src/config/api.ts
export const API_CONFIG = {
  MODE: 'real' as 'real' | 'mock', // Mude aqui
  MOCK_URL: 'http://localhost:3002',
  REAL_URL: 'http://localhost:3002',
};
```

## 📊 Banco de Dados

### Schema Prisma
```prisma
model User {
  id        Int      @id @default(autoincrement())
  nome      String
  email     String   @unique
  senha     String
  matricula String?
  papel_id  UserRole @default(PARTICIPANT)
  // ... relacionamentos
}

model Event {
  id                   Int         @id @default(autoincrement())
  nome                 String
  descricao            String
  data_inicio          DateTime
  data_fim             DateTime
  local                String?
  capacidade           Int
  quantidade_inscritos Int          @default(0)
  status               EventStatus  @default(UPCOMING)
  bloco                String
  organizador_id       Int
  // ... relacionamentos
}

// ... outros modelos
```

## 🔐 Autenticação

### JWT Tokens
- Tokens expiram em 24h
- Senhas hasheadas com bcrypt
- Middleware de autenticação automático

### Roles
- **ORGANIZER**: Pode criar/editar eventos, gerenciar inscrições
- **PARTICIPANT**: Pode se inscrever em eventos, visualizar certificados

## 📡 Endpoints Implementados

### Autenticação
- `POST /auth` - Login
- `POST /usuarios` - Registro
- `GET /usuarios/profile` - Perfil

### Eventos
- `GET /eventos` - Listar eventos
- `GET /eventos/:id` - Detalhes do evento
- `POST /eventos` - Criar evento (organizador)
- `PUT /eventos/:id` - Atualizar evento (organizador)
- `DELETE /eventos/:id` - Excluir evento (organizador)

### Atividades
- `GET /organizador/eventos/:eventId/atividades` - Listar atividades
- `POST /organizador/eventos/:eventId/create/atividades` - Criar atividade
- `PUT /organizador/atividades/:id` - Atualizar atividade
- `DELETE /organizador/atividades/:id` - Excluir atividade

### Inscrições
- `POST /participante/eventos/:eventId/inscricao` - Inscrever
- `DELETE /participante/eventos/:eventId/desinscricao` - Cancelar
- `GET /participante/eventos` - Eventos do participante

### Certificados
- `POST /certificados` - Gerar certificado
- `GET /certificados/meus` - Meus certificados

### Arquivos
- `GET /arquivos/evento/:eventId` - Listar arquivos
- `POST /arquivos/evento/:eventId/upload` - Upload
- `GET /arquivos/:fileId/download` - Download

## 🚀 Execução

### Desenvolvimento Completo
```bash
npm run dev:full
```

### Individual
```bash
# Frontend
npm run dev

# Backend
npm run backend
```

## 🔍 Debugging

### Logs do Backend
```bash
cd unb-events-backend
npm run dev
```

### Prisma Studio
```bash
cd unb-events-backend
npm run db:studio
```

### Verificar Banco
```bash
cd unb-events-backend
npm run db:push
```

## 🧪 Testes

### Testar Backend Real
1. Configure o banco PostgreSQL
2. Execute `npm run backend`
3. Use o toggle para "Backend Real"
4. Teste login/registro
5. Teste criação de eventos

### Testar JSON Server
1. Execute `npm run dev`
2. Use o toggle para "JSON Server"
3. Teste funcionalidades existentes

## 🔧 Troubleshooting

### Erro de Conexão com Banco
```bash
# Verificar se PostgreSQL está rodando
# Verificar DATABASE_URL no .env
# Executar npm run db:push
```

### Erro de Autenticação
```bash
# Verificar JWT_SECRET no .env
# Verificar se token está sendo enviado
# Verificar middleware de auth
```

### Erro de CORS
```bash
# Verificar FRONTEND_URL no .env
# Verificar configuração CORS no server.ts
```

## 📈 Próximos Passos

1. **Testes Automatizados**: Implementar testes unitários e de integração
2. **Validação**: Adicionar validação mais robusta com Joi ou Zod
3. **Cache**: Implementar cache com Redis
4. **Logs**: Adicionar sistema de logs estruturado
5. **Monitoramento**: Implementar métricas e health checks
6. **Deploy**: Configurar CI/CD e deploy automatizado

## 🎉 Conclusão

O sistema agora possui:
- ✅ Backend real completo
- ✅ Integração transparente com frontend
- ✅ Alternância fácil entre APIs
- ✅ Autenticação segura
- ✅ Banco de dados relacional
- ✅ Upload de arquivos
- ✅ Controle de acesso

O json-server continua disponível para desenvolvimento rápido, enquanto o backend real oferece funcionalidades completas para produção. 