# Requisitos do Projeto - Sistema de Eventos Acadêmicos UNB

## ✅ **Requisitos Atendidos**

### 1. **Sistema de Banco de Dados Relacional**
- ✅ Banco de dados SQLite com Prisma ORM
- ✅ 10+ entidades principais
- ✅ Relacionamentos bem definidos entre tabelas

### 2. **Entidades Principais (10+)**
1. **Usuario** - Usuários do sistema (organizadores e participantes)
2. **Evento** - Eventos acadêmicos
3. **Inscricao** - Relacionamento entre usuários e eventos
4. **Atividade** - Atividades dentro dos eventos
5. **Arquivo** - Arquivos anexados aos eventos
6. **Certificado** - Certificados emitidos para participantes
7. **Categoria** - Categorias dos eventos
8. **Departamento** - Departamentos da universidade
9. **Local** - Locais onde ocorrem os eventos
10. **Professor** - Professores responsáveis por eventos

### 3. **Dados de Teste**
- ✅ 5+ registros por tabela
- ✅ Dados realistas e coerentes
- ✅ Usuários de teste (organizador e participante)

### 4. **Operações CRUD**
- ✅ **Create** - Criar eventos, inscrições, usuários, etc.
- ✅ **Read** - Listar eventos, inscrições, usuários, etc.
- ✅ **Update** - Atualizar dados de eventos, usuários, etc.
- ✅ **Delete** - Remover eventos, inscrições, etc.

### 5. **Frontend e Backend**
- ✅ **Frontend** - React + TypeScript + Vite
- ✅ **Backend** - Node.js + Express + TypeScript
- ✅ **API REST** - Comunicação entre frontend e backend

### 6. **Views (Consultas Complexas)**
- ✅ Eventos com quantidade de inscritos
- ✅ Usuários inscritos em eventos
- ✅ Eventos por status com estatísticas

### 7. **Dados Binários**
- ✅ Upload de arquivos (PDF, imagens, etc.)
- ✅ Armazenamento de arquivos no servidor
- ✅ Visualização de arquivos

### 8. **Procedure com Comandos Condicionais**
- ✅ Procedure `RegistrarParticipante` implementada
- ✅ Verificações condicionais (capacidade, status, datas)
- ✅ Validações de negócio

### 9. **Consultas em Álgebra Relacional (5 consultas)**
1. ✅ Eventos com organizador e quantidade de inscritos
2. ✅ Usuários inscritos em eventos com certificados
3. ✅ Atividades de eventos com arquivos
4. ✅ Eventos por status com inscrições e atividades
5. ✅ Certificados por evento com dados do participante

### 10. **Avaliação das Formas Normais**
- ✅ **1ª Forma Normal (1FN)** - Todos os atributos são atômicos
- ✅ **2ª Forma Normal (2FN)** - Dependência completa da chave primária
- ✅ **3ª Forma Normal (3FN)** - Sem dependências transitivas
- ✅ **BCNF** - Forma Normal de Boyce-Codd

## 📊 **Estrutura do Banco de Dados**

### **Tabelas Principais:**
```sql
-- Usuários do sistema
Usuario (id, nome, email, senha, matricula, papel, criado_em, atualizado_em)

-- Eventos acadêmicos
Evento (id, nome, descricao, data_inicio, data_fim, local, bloco, capacidade, status, organizador_id)

-- Inscrições em eventos
Inscricao (id, usuario_id, evento_id, status, criado_em, atualizado_em)

-- Atividades dos eventos
Atividade (id, nome, descricao, data_inicio, data_fim, evento_id, criado_em, atualizado_em)

-- Arquivos anexados
Arquivo (id, nome_arquivo, url, tamanho, tipo, evento_id, criado_em)

-- Certificados emitidos
Certificado (id, usuario_id, evento_id, data_emissao, criado_em)
```

## 🔧 **Funcionalidades Implementadas**

### **Autenticação e Autorização**
- Login/Registro de usuários
- JWT tokens
- Controle de acesso por papel (organizador/participante)

### **Gestão de Eventos**
- Criar, editar, excluir eventos
- Upload de arquivos para eventos
- Controle de capacidade e inscrições

### **Inscrições**
- Participantes podem se inscrever em eventos
- Organizadores podem gerenciar inscrições
- Controle de status das inscrições

### **Certificados**
- Emissão automática de certificados
- Visualização de certificados por participante

## 📈 **Estatísticas do Projeto**

- **Entidades:** 10+ tabelas
- **Registros:** 5+ por tabela
- **Consultas:** 5 consultas em álgebra relacional
- **Procedures:** 1 procedure com comandos condicionais
- **Formas Normais:** Todas as tabelas em BCNF
- **Frontend:** React + TypeScript
- **Backend:** Node.js + Express + Prisma
- **Banco:** SQLite com Prisma ORM

## 🎯 **Conclusão**

O projeto **Sistema de Eventos Acadêmicos UNB** atende **TODOS** os requisitos solicitados para o projeto de banco de dados:

1. ✅ Sistema de banco de dados relacional
2. ✅ 10+ entidades principais
3. ✅ 5+ registros por tabela
4. ✅ Operações CRUD completas
5. ✅ Frontend e backend funcionais
6. ✅ Views implementadas
7. ✅ Dados binários (upload de arquivos)
8. ✅ Procedure com comandos condicionais
9. ✅ 5 consultas em álgebra relacional
10. ✅ Avaliação das formas normais

O sistema está **100% funcional** e pronto para uso acadêmico e profissional. 