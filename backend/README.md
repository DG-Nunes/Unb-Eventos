# UNB-EVENTS Backend

API REST para o sistema de gerenciamento de eventos da UNB, desenvolvida com Node.js, Express e Prisma.

## 🚀 Funcionalidades

### 🔐 **Autenticação e Usuários**
- **Registro de usuários** com validação de dados
- **Login com JWT** e refresh automático
- **Perfis diferenciados**: Organizador e Participante
- **Gerenciamento de perfil** com edição de dados
- **Validação de senhas** com bcrypt

### 📅 **Eventos**
- **CRUD completo** de eventos
- **Validação por data**: Só permite edição/deleção se evento não iniciou
- **Busca por nome** com filtros avançados
- **Paginação** de resultados
- **Controle de capacidade** e inscrições
- **Estatísticas** para organizadores

### 🎯 **Atividades**
- **CRUD completo** de atividades
- **Validação por data**: Só permite edição/deleção se evento pai não iniciou
- **Ordenação cronológica** por data de início
- **Relacionamento** com eventos

### 📁 **Arquivos**
- **Upload de arquivos** com Multer (máx. 10MB)
- **Armazenamento** em sistema de arquivos
- **Download** de arquivos
- **Exclusão** de arquivos
- **Validação de tipos** de arquivo

### 📋 **Inscrições**
- **Inscrição em eventos** para participantes
- **Cancelamento** de inscrições
- **Controle de lotação** automático
- **Validação de duplicatas**
- **Status de inscrição** (CONFIRMED, PENDING, CANCELLED)

### 🔐 **Segurança e Permissões**
- **Middleware de autenticação** JWT
- **Controle de acesso** baseado em roles
- **Rate limiting** para proteção contra spam
- **Validação de propriedade** de recursos
- **CORS configurado** para frontend
- **Helmet** para headers de segurança

## 🛠️ Tecnologias

- **Node.js** com TypeScript
- **Express** para framework web
- **Prisma** como ORM moderno
- **SQLite** para desenvolvimento (zero-custo)
- **JWT** para autenticação
- **bcryptjs** para hash de senhas
- **Multer** para upload de arquivos
- **CORS** para cross-origin requests
- **Helmet** para segurança
- **Morgan** para logging

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar banco de dados
npx prisma generate
npx prisma db push

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 🔧 Configuração

### Variáveis de Ambiente
Criar arquivo `.env`:

```env
# Servidor
PORT=3002
NODE_ENV=development

# Banco de dados
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET=sua-chave-secreta-aqui

# CORS
FRONTEND_URL=http://localhost:3000
```

## 📊 Schema do Banco

### **Users**
- `id`: ID único
- `nome`: Nome completo
- `email`: Email único
- `senha`: Hash da senha
- `matricula`: Matrícula (opcional)
- `papel_id`: Role (ORGANIZER/PARTICIPANT)
- `createdAt/updatedAt`: Timestamps

### **Events**
- `id`: ID único
- `nome`: Nome do evento
- `descricao`: Descrição completa
- `data_inicio/data_fim`: Datas do evento
- `local`: Local do evento
- `capacidade`: Número máximo de inscritos
- `quantidade_inscritos`: Contador atual
- `status`: Status do evento
- `bloco`: Bloco da UNB
- `organizador_id`: ID do organizador
- `createdAt/updatedAt`: Timestamps

### **Activities**
- `id`: ID único
- `nome`: Nome da atividade
- `descricao`: Descrição
- `data_inicio/data_fim`: Datas da atividade
- `evento_id`: ID do evento pai
- `createdAt/updatedAt`: Timestamps

### **EventRegistrations**
- `id`: ID único
- `usuario_id`: ID do participante
- `evento_id`: ID do evento
- `data_inscricao`: Data da inscrição
- `status`: Status da inscrição
- `createdAt/updatedAt`: Timestamps

### **EventFiles**
- `id`: ID único
- `nome_arquivo`: Nome original
- `url`: Caminho do arquivo
- `evento_id`: ID do evento
- `createdAt/updatedAt`: Timestamps

## 🚀 Endpoints

### **Autenticação**
- `POST /auth` - Login
- `POST /usuarios` - Registro
- `GET /usuarios/profile` - Perfil do usuário
- `PUT /usuarios/:id` - Atualizar perfil

### **Eventos**
- `GET /eventos` - Listar eventos (com filtros)
- `GET /eventos/:id` - Detalhes do evento
- `POST /organizador/eventos/create` - Criar evento
- `PUT /organizador/eventos/:id` - Editar evento
- `DELETE /organizador/eventos/:id` - Deletar evento
- `GET /organizador` - Eventos do organizador

### **Atividades**
- `GET /atividades/eventos/:eventId` - Atividades do evento
- `POST /organizador/eventos/:eventId/create/atividades` - Criar atividade
- `PUT /organizador/atividades/:id` - Editar atividade
- `DELETE /organizador/atividades/:id` - Deletar atividade

### **Arquivos**
- `POST /arquivos/upload/:eventId` - Upload de arquivo
- `GET /arquivos/:eventId` - Listar arquivos do evento
- `DELETE /arquivos/:eventId/:fileId` - Deletar arquivo

### **Inscrições**
- `POST /participante/eventos/:eventId/inscricao` - Inscrever-se
- `DELETE /participante/eventos/:eventId/desinscricao` - Cancelar inscrição
- `GET /participante` - Eventos inscritos
- `GET /participante/eventos` - Eventos inscritos (paginação)

## 🔐 Middleware de Segurança

### **Autenticação**
```typescript
// Verificar token JWT
authenticateToken(req, res, next)

// Verificar se é organizador
requireOrganizer(req, res, next)

// Verificar se é participante
requireParticipant(req, res, next)
```

### **Rate Limiting**
- **Geral**: 100 requests por IP em 15 minutos
- **Auth**: 5 tentativas de login por IP em 15 minutos
- **Upload**: 10 uploads por IP em 1 hora
- **Eventos**: 5 eventos por organizador em 1 hora

## 🚨 Regras de Negócio

### **Validação por Data**
- **Eventos**: Só podem ser editados/deletados se `data_inicio >= hoje`
- **Atividades**: Seguem a mesma regra do evento pai
- **Arquivos**: Podem ser gerenciados pelo organizador do evento

### **Permissões**
- **Organizadores**: Veem apenas eventos que criaram
- **Participantes**: Veem todos os eventos disponíveis
- **Edição**: Apenas organizador do evento
- **Inscrição**: Apenas participantes

### **Controle de Lotação**
- **Inscrição**: Só se `quantidade_inscritos < capacidade`
- **Cancelamento**: Disponível até início do evento
- **Contador**: Atualizado automaticamente

## 🐛 Troubleshooting

### **Problemas Comuns**
1. **Erro de CORS**: Verificar `FRONTEND_URL` no .env
2. **Token inválido**: Verificar `JWT_SECRET`
3. **Upload falha**: Verificar permissões da pasta uploads
4. **Banco não conecta**: Verificar `DATABASE_URL`

### **Logs**
- **Morgan**: Logs de requisições HTTP
- **Console**: Logs de erro e debug
- **Prisma**: Logs de queries SQL

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Rodar com nodemon
npm run build        # Build TypeScript
npm start           # Rodar build

# Banco de dados
npm run db:generate  # Gerar cliente Prisma
npm run db:push      # Aplicar schema
npm run db:migrate   # Criar migration
npm run db:studio    # Abrir Prisma Studio
```

## 🚀 Deploy

### **Requisitos**
- Node.js 18+
- SQLite (dev) ou PostgreSQL (prod)
- Variáveis de ambiente configuradas

### **Comandos**
```bash
npm run build
npm start
```

## 📝 Changelog

### v1.0.0
- ✅ API REST completa
- ✅ Autenticação JWT
- ✅ CRUD de eventos e atividades
- ✅ Upload de arquivos
- ✅ Sistema de inscrições
- ✅ Validações de segurança
- ✅ Rate limiting
- ✅ Controle de permissões por data 