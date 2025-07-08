# Diagrama da Arquitetura - Sistema de Eventos UNB

## Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (React)                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   Páginas       │  │   Componentes   │  │      Contextos/Auth         │ │
│  │                 │  │                 │  │                             │ │
│  │ • Login         │  │ • EventCard     │  │ • AuthProvider             │ │
│  │ • Register      │  │ • EventModal    │  │ • useAuth                  │ │
│  │ • Dashboard     │  │ • FileUpload    │  │ • PrivateRoute             │ │
│  │ • EventDetails  │  │ • Pagination    │  │                             │ │
│  │ • AvailableEvents│  │ • Toast         │  │                             │ │
│  │ • Certificates  │  │ • ActivityCard  │  │                             │ │
│  │ • MyEvents      │  │ • UserProfile   │  │                             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS (REST API)
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND (Node.js)                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   Controllers   │  │    Services     │  │        Middleware           │ │
│  │                 │  │                 │  │                             │ │
│  │ • AuthController│  │ • AuthService   │  │ • authenticateToken         │ │
│  │ • EventController│  │ • EventService  │  │ • requireOrganizer         │ │
│  │ • Registration  │  │ • Registration  │  │ • requireParticipant       │ │
│  │ • FileController│  │ • FileService   │  │ • rateLimit                 │ │
│  │ • Certificate   │  │ • Certificate   │  │                             │ │
│  │ • Activity      │  │ • Activity      │  │                             │ │
│  │ • User          │  │ • User          │  │                             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Prisma ORM
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BANCO DE DADOS                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐ │
│  │   Tabelas       │  │     Views       │  │      Procedures             │ │
│  │   Principais    │  │                 │  │                             │ │
│  │                 │  │ • DetalhesEvento│  │ • RegistrarParticipante     │ │
│  │ • Usuario       │  │ • vw_eventos_   │  │   (com comandos            │ │
│  │ • Evento        │  │   estatisticas  │  │    condicionais)           │ │
│  │ • Inscricao     │  │                 │  │                             │ │
│  │ • Atividade     │  │                 │  │                             │ │
│  │ • Arquivo       │  │                 │  │                             │ │
│  │ • Certificado   │  │                 │  │                             │ │
│  │ • Categoria     │  │                 │  │                             │ │
│  │ • Local         │  │                 │  │                             │ │
│  │ • Palestrante   │  │                 │  │                             │ │
│  │ • Avaliacao     │  │                 │  │                             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Fluxo de Dados

### 1. **Autenticação**
```
Usuário → Frontend (Login) → Backend (AuthController) → Database (Usuario)
```

### 2. **Listagem de Eventos**
```
Frontend (Dashboard) → Backend (EventController) → Database (Evento + View)
```

### 3. **Inscrição em Evento**
```
Frontend (EventCard) → Backend (RegistrationController) → Database (Inscricao + Procedure)
```

### 4. **Upload de Arquivo**
```
Frontend (FileUpload) → Backend (FileController) → Database (Arquivo) + File System
```

### 5. **Geração de Certificados**
```
Frontend (Dashboard) → Backend (CertificateController) → Database (Certificado) + File System
```

### 6. **Gestão de Atividades**
```
Frontend (EventDetails) → Backend (ActivityController) → Database (Atividade)
```

## Camada de Persistência

### **Mapeamento ORM (Prisma)**
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              PRISMA ORM                                    │
│                                                                             │
│  Model Usuario {                    Model Evento {                         │
│    id        Int      @id            id          Int      @id              │
│    nome      String                   nome        String                   │
│    email     String   @unique         descricao   String                   │
│    senha     String                   data_inicio DateTime                 │
│    matricula String   @unique         data_fim    DateTime                 │
│    papel     String                   local       String                   │
│    eventos   Evento[]                 bloco       String?                  │
│    inscricoes Inscricao[]             capacidade  Int                      │
│    avaliacoes Avaliacao[]             status      String                   │
│  }                                    organizador Usuario @relation        │
│                                       inscricoes  Inscricao[]              │
│                                       atividades  Atividade[]              │
│                                       arquivos    Arquivo[]                │
│                                       categoria   Categoria? @relation     │
│                                       local_evento Local? @relation        │
│                                       avaliacoes  Avaliacao[]              │
│                                     }                                      │
│                                                                             │
│  Model Inscricao {                   Model Certificado {                   │
│    id        Int      @id            id           Int      @id             │
│    usuario   Usuario  @relation      inscricao    Inscricao @relation      │
│    evento    Evento   @relation      inscricao_id Int      @unique        │
│    status    String                   data_emissao DateTime @default(now())│
│    certificado Certificado?           url         String?                  │
│  }                                    }                                   │
│                                                                             │
│  Model Arquivo {                      Model Categoria {                    │
│    id           Int      @id          id          Int      @id             │
│    nome_arquivo String                nome        String   @unique         │
│    url         String                 descricao   String                   │
│    size        Int                    cor         String                   │
│    type        String                 criado_em   DateTime @default(now()) │
│    evento      Evento?  @relation     eventos     Evento[]                │
│    evento_id   Int?                   }                                   │
│  }                                                                         │
│                                                                             │
│  Model Local {                        Model Palestrante {                  │
│    id          Int      @id           id          Int      @id             │
│    nome        String                 nome        String                   │
│    bloco       String                 email       String                   │
│    capacidade  Int                    biografia   String                   │
│    tipo        String                 especialidade String                 │
│    criado_em   DateTime @default(now()) criado_em   DateTime @default(now())│
│    eventos     Evento[]               atividades  Atividade[]              │
│  }                                    }                                   │
│                                                                             │
│  Model Avaliacao {                    Model Atividade {                    │
│    id          Int      @id           id          Int      @id             │
│    nota        Int                    nome        String                   │
│    comentario  String?                descricao   String                   │
│    usuario     Usuario  @relation     data_inicio DateTime                │
│    evento      Evento   @relation     data_fim    DateTime                 │
│    criado_em   DateTime @default(now()) evento      Evento   @relation     │
│  }                                    palestrantes Palestrante[]          │
│                                     }                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Endpoints da API

### **Autenticação**
- `POST /auth/login` - Login do usuário
- `POST /auth/register` - Registro de usuário
- `GET /auth/profile` - Perfil do usuário

### **Eventos**
- `GET /eventos` - Listar eventos
- `POST /eventos` - Criar evento
- `GET /eventos/:id` - Detalhes do evento
- `PUT /eventos/:id` - Atualizar evento
- `DELETE /eventos/:id` - Excluir evento

### **Inscrições**
- `POST /participante/eventos/:id/inscricao` - Inscrever em evento
- `DELETE /participante/eventos/:id/desinscricao` - Cancelar inscrição
- `GET /participante/eventos` - Eventos do participante

### **Certificados**
- `POST /certificados/organizador` - Gerar certificados para evento
- `GET /certificados/meus` - Certificados do participante
- `GET /certificados/evento/:eventId` - Certificados de um evento
- `GET /certificados/:id` - Detalhes do certificado

### **Atividades**
- `GET /activities/:eventId` - Listar atividades do evento
- `POST /activities` - Criar atividade
- `PUT /activities/:id` - Atualizar atividade
- `DELETE /activities/:id` - Excluir atividade

### **Arquivos**
- `POST /files/upload` - Upload de arquivo
- `GET /files/:eventId` - Listar arquivos do evento
- `GET /files/:id/download` - Download de arquivo

### **Usuários**
- `GET /users` - Listar usuários
- `GET /users/:id` - Detalhes do usuário
- `PUT /users/:id` - Atualizar usuário

## Tecnologias Utilizadas

### **Frontend**
- React 18 + TypeScript
- Material-UI (MUI)
- React Router DOM
- Axios para HTTP requests

### **Backend**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL Database
- JWT Authentication
- Multer para upload de arquivos
- Canvas para geração de certificados

### **Banco de Dados**
- PostgreSQL (produção)
- Views para consultas complexas
- Procedures com comandos condicionais
- Índices para performance

## Segurança

### **Autenticação**
- JWT Tokens
- Middleware de autenticação
- Controle de acesso por papel (organizador/participante)

### **Validação**
- Validação de entrada nos controllers
- Sanitização de dados
- Rate limiting para prevenir spam

## Performance

### **Otimizações**
- Índices no banco de dados
- Paginação nas consultas
- Lazy loading de componentes
- Cache de dados no frontend

### **Monitoramento**
- Logs de erro no backend
- Console logs para debug
- Validação de dados em tempo real 