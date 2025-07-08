# UNB Events - Sistema de Eventos da UnB

## Descrição
Sistema de gerenciamento de eventos da Universidade de Brasília (UnB) desenvolvido como projeto de Banco de Dados.

## Requisitos Atendidos

### ✅ Requisitos Básicos
- **10+ entidades**: User, Department, Professor, Student, Category, Location, Event, Activity, Registration, Certificate, File
- **5+ registros por tabela**: Todas as tabelas possuem pelo menos 5 registros de exemplo
- **CRUD funcionando**: Operações Create, Read, Update, Delete implementadas
- **SGBD relacional**: SQLite
- **Linguagem de programação**: Node.js/TypeScript

### ✅ Entrega Final
- **Script SQL**: `database.sql` com criação completa do banco
- **Código fonte**: Disponível no GitHub
- **View**: `EventDetails` - view complexa com joins
- **Procedure**: `RegisterParticipant` - procedure com comandos condicionais
- **Dados binários**: Tabela `File` para armazenar arquivos PDF

## Estrutura do Banco de Dados

### Entidades Principais
1. **User** - Usuários do sistema (admin, organizer, participant)
2. **Department** - Departamentos da UnB
3. **Professor** - Professores vinculados aos departamentos
4. **Student** - Estudantes vinculados aos departamentos
5. **Category** - Categorias de eventos
6. **Location** - Locais/Espaços para eventos
7. **Event** - Eventos acadêmicos
8. **Activity** - Atividades dentro dos eventos
9. **Registration** - Inscrições em eventos
10. **Certificate** - Certificados de participação
11. **File** - Arquivos binários (PDFs, etc.)

### Relacionamentos
- Eventos são organizados por usuários
- Eventos pertencem a categorias e locais
- Eventos podem estar vinculados a departamentos e professores
- Estudantes podem se inscrever em eventos
- Atividades pertencem a eventos
- Arquivos podem estar vinculados a eventos

## Instalação e Uso

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Instalar dependências
npm install

# Gerar cliente Prisma
npm run db:generate

# Aplicar migrações
npm run db:push

# Popular banco com dados de exemplo
npm run seed

# Iniciar servidor
npm run dev
```

### Endpoints Disponíveis

#### Usuários
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `POST /api/users` - Criar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

#### Eventos
- `GET /api/events` - Listar eventos
- `GET /api/events/:id` - Buscar evento por ID
- `POST /api/events` - Criar evento
- `PUT /api/events/:id` - Atualizar evento
- `DELETE /api/events/:id` - Deletar evento

#### Departamentos
- `GET /api/departments` - Listar departamentos
- `GET /api/departments/:id` - Buscar departamento por ID
- `POST /api/departments` - Criar departamento
- `PUT /api/departments/:id` - Atualizar departamento
- `DELETE /api/departments/:id` - Deletar departamento

## Consultas em Álgebra Relacional

### 1. Eventos com informações completas
```
π(title, description, date, organizer_name, category_name, location_name)
(Event ⋈ User ⋈ Category ⋈ Location)
```

### 2. Inscrições confirmadas com dados do usuário e evento
```
π(user_name, event_title, status)
(Registration ⋈ User ⋈ Event)
WHERE status = 'confirmed'
```

### 3. Atividades de eventos com dados do evento
```
π(activity_name, event_title, start_time, end_time)
(Activity ⋈ Event)
```

### 4. Estudantes por departamento
```
π(student_name, course, department_name)
(Student ⋈ Department)
```

### 5. Professores com eventos organizados
```
π(professor_name, event_title, department_name)
(Professor ⋈ Department ⋈ Event)
```

## Formas Normais

### Tabela User (1FN, 2FN, 3FN)
- **1FN**: ✅ Atributos atômicos
- **2FN**: ✅ Sem dependências parciais
- **3FN**: ✅ Sem dependências transitivas

### Tabela Event (1FN, 2FN, 3FN)
- **1FN**: ✅ Atributos atômicos
- **2FN**: ✅ Sem dependências parciais
- **3FN**: ✅ Sem dependências transitivas

### Tabela Registration (1FN, 2FN, 3FN)
- **1FN**: ✅ Atributos atômicos
- **2FN**: ✅ Sem dependências parciais
- **3FN**: ✅ Sem dependências transitivas

### Tabela Activity (1FN, 2FN, 3FN)
- **1FN**: ✅ Atributos atômicos
- **2FN**: ✅ Sem dependências parciais
- **3FN**: ✅ Sem dependências transitivas

### Tabela File (1FN, 2FN, 3FN)
- **1FN**: ✅ Atributos atômicos
- **2FN**: ✅ Sem dependências parciais
- **3FN**: ✅ Sem dependências transitivas

## View e Procedure

### View: EventDetails
```sql
CREATE VIEW EventDetails AS
SELECT 
    e.id, e.title, e.description, e.date, e.duration, e.status, e.capacity,
    u.name as organizer_name,
    c.name as category_name,
    l.name as location_name,
    d.name as department_name,
    p.name as professor_name
FROM Event e
LEFT JOIN User u ON e.organizerId = u.id
LEFT JOIN Category c ON e.categoryId = c.id
LEFT JOIN Location l ON e.locationId = l.id
LEFT JOIN Department d ON e.departmentId = d.id
LEFT JOIN Professor p ON e.professorId = p.id;
```

### Procedure: RegisterParticipant
```sql
CREATE PROCEDURE RegisterParticipant(
    p_user_id INTEGER,
    p_event_id INTEGER,
    p_student_id INTEGER
)
BEGIN
    INSERT INTO Registration (status, userId, eventId, studentId)
    VALUES ('pending', p_user_id, p_event_id, p_student_id);
    
    SELECT 'Inscrição realizada com sucesso' as message;
END;
```

## Dados Binários
A tabela `File` armazena dados binários como:
- Arquivos PDF de programas de eventos
- Material de workshops
- Regulamentos de competições
- Certificados de participação

## Tecnologias Utilizadas
- **Backend**: Node.js, Express, TypeScript
- **Banco de Dados**: SQLite com Prisma ORM
- **Autenticação**: bcrypt para hash de senhas
- **Documentação**: Markdown

## Autores
- Projeto desenvolvido para disciplina de Banco de Dados
- Universidade de Brasília
- Instituto de Ciências Exatas
- Departamento de Ciência da Computação 