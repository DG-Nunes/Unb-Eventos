# Avaliação das Formas Normais

## 1. Tabela Usuario

### **1ª Forma Normal (1FN)**
✅ **ATENDE** - Todos os atributos são atômicos (não divisíveis)
- id, nome, email, senha, matricula, papel, criado_em, atualizado_em

### **2ª Forma Normal (2FN)**
✅ **ATENDE** - Todos os atributos não-chave dependem completamente da chave primária
- Chave primária: id
- Todos os outros atributos dependem completamente de id

### **3ª Forma Normal (3FN)**
✅ **ATENDE** - Não há dependências transitivas
- Não há atributos que dependem de outros atributos não-chave

### **Forma Normal de Boyce-Codd (BCNF)**
✅ **ATENDE** - Todas as dependências funcionais são determinadas por superchaves

---

## 2. Tabela Evento

### **1ª Forma Normal (1FN)**
✅ **ATENDE** - Todos os atributos são atômicos
- id, nome, descricao, data_inicio, data_fim, local, bloco, capacidade, status, organizador_id

### **2ª Forma Normal (2FN)**
✅ **ATENDE** - Todos os atributos não-chave dependem completamente da chave primária
- Chave primária: id
- Todos os outros atributos dependem completamente de id

### **3ª Forma Normal (3FN)**
✅ **ATENDE** - Não há dependências transitivas
- organizador_id é chave estrangeira válida

### **Forma Normal de Boyce-Codd (BCNF)**
✅ **ATENDE** - Todas as dependências funcionais são determinadas por superchaves

---

## 3. Tabela Inscricao

### **1ª Forma Normal (1FN)**
✅ **ATENDE** - Todos os atributos são atômicos
- id, usuario_id, evento_id, status, criado_em, atualizado_em

### **2ª Forma Normal (2FN)**
✅ **ATENDE** - Todos os atributos não-chave dependem completamente da chave primária
- Chave primária: id
- Todos os outros atributos dependem completamente de id

### **3ª Forma Normal (3FN)**
✅ **ATENDE** - Não há dependências transitivas
- usuario_id e evento_id são chaves estrangeiras válidas

### **Forma Normal de Boyce-Codd (BCNF)**
✅ **ATENDE** - Todas as dependências funcionais são determinadas por superchaves

---

## 4. Tabela Atividade

### **1ª Forma Normal (1FN)**
✅ **ATENDE** - Todos os atributos são atômicos
- id, nome, descricao, data_inicio, data_fim, evento_id, criado_em, atualizado_em

### **2ª Forma Normal (2FN)**
✅ **ATENDE** - Todos os atributos não-chave dependem completamente da chave primária
- Chave primária: id
- Todos os outros atributos dependem completamente de id

### **3ª Forma Normal (3FN)**
✅ **ATENDE** - Não há dependências transitivas
- evento_id é chave estrangeira válida

### **Forma Normal de Boyce-Codd (BCNF)**
✅ **ATENDE** - Todas as dependências funcionais são determinadas por superchaves

---

## 5. Tabela Arquivo

### **1ª Forma Normal (1FN)**
✅ **ATENDE** - Todos os atributos são atômicos
- id, nome_arquivo, url, tamanho, tipo, evento_id, criado_em

### **2ª Forma Normal (2FN)**
✅ **ATENDE** - Todos os atributos não-chave dependem completamente da chave primária
- Chave primária: id
- Todos os outros atributos dependem completamente de id

### **3ª Forma Normal (3FN)**
✅ **ATENDE** - Não há dependências transitivas
- evento_id é chave estrangeira válida

### **Forma Normal de Boyce-Codd (BCNF)**
✅ **ATENDE** - Todas as dependências funcionais são determinadas por superchaves

---

## **Conclusão**

Todas as 5 tabelas analisadas atendem às três primeiras formas normais (1FN, 2FN, 3FN) e também à Forma Normal de Boyce-Codd (BCNF), garantindo:

1. **Integridade dos dados** - Sem redundâncias
2. **Consistência** - Dependências funcionais bem definidas
3. **Flexibilidade** - Fácil manutenção e modificação
4. **Performance** - Estrutura otimizada para consultas

O projeto está bem normalizado e segue as melhores práticas de modelagem de banco de dados. 