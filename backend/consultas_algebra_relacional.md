# Consultas em Álgebra Relacional

## 1. Eventos com Organizador e Quantidade de Inscritos
**Objetivo:** Listar todos os eventos com nome do organizador e quantidade de inscritos confirmados.

**Álgebra Relacional:**
```
π(evento.id, evento.nome, organizador.nome, COUNT(inscricao.id))(
  evento ⋈(evento.organizador_id = organizador.id) organizador 
  ⋈(evento.id = inscricao.evento_id) inscricao
  WHERE inscricao.status = 'confirmada'
  GROUP BY evento.id, evento.nome, organizador.nome
)
```

**SQL Equivalente:**
```sql
SELECT 
  e.id, e.nome, u.nome as organizador_nome, COUNT(i.id) as inscritos
FROM Evento e
JOIN Usuario u ON e.organizador_id = u.id
LEFT JOIN Inscricao i ON e.id = i.evento_id AND i.status = 'confirmada'
GROUP BY e.id, e.nome, u.nome;
```

## 2. Usuários Inscritos em Eventos com Certificados
**Objetivo:** Listar usuários que estão inscritos em eventos e possuem certificados.

**Álgebra Relacional:**
```
π(usuario.id, usuario.nome, evento.nome, certificado.data_emissao)(
  usuario ⋈(usuario.id = inscricao.usuario_id) inscricao
  ⋈(inscricao.evento_id = evento.id) evento
  ⋈(inscricao.id = certificado.inscricao_id) certificado
  WHERE inscricao.status = 'confirmada'
)
```

**SQL Equivalente:**
```sql
SELECT 
  u.id, u.nome, e.nome as evento_nome, c.data_emissao
FROM Usuario u
JOIN Inscricao i ON u.id = i.usuario_id
JOIN Evento e ON i.evento_id = e.id
JOIN Certificado c ON i.id = c.inscricao_id
WHERE i.status = 'confirmada';
```

## 3. Atividades de Eventos com Arquivos
**Objetivo:** Listar atividades de eventos que possuem arquivos anexados.

**Álgebra Relacional:**
```
π(atividade.id, atividade.nome, evento.nome, arquivo.nome_arquivo)(
  atividade ⋈(atividade.evento_id = evento.id) evento
  ⋈(evento.id = arquivo.evento_id) arquivo
)
```

**SQL Equivalente:**
```sql
SELECT 
  a.id, a.nome as atividade_nome, e.nome as evento_nome, ar.nome_arquivo
FROM Atividade a
JOIN Evento e ON a.evento_id = e.id
JOIN Arquivo ar ON e.id = ar.evento_id;
```

## 4. Eventos por Status com Inscrições e Atividades
**Objetivo:** Listar eventos agrupados por status com contagem de inscrições e atividades.

**Álgebra Relacional:**
```
π(evento.status, COUNT(DISTINCT evento.id), COUNT(inscricao.id), COUNT(atividade.id))(
  evento ⋈(evento.id = inscricao.evento_id) inscricao
  ⋈(evento.id = atividade.evento_id) atividade
  WHERE inscricao.status = 'confirmada'
  GROUP BY evento.status
)
```

**SQL Equivalente:**
```sql
SELECT 
  e.status,
  COUNT(DISTINCT e.id) as total_eventos,
  COUNT(i.id) as total_inscricoes,
  COUNT(a.id) as total_atividades
FROM Evento e
LEFT JOIN Inscricao i ON e.id = i.evento_id AND i.status = 'confirmada'
LEFT JOIN Atividade a ON e.id = a.evento_id
GROUP BY e.status;
```

## 5. Certificados por Evento com Dados do Participante
**Objetivo:** Listar certificados emitidos com dados do participante e evento.

**Álgebra Relacional:**
```
π(certificado.id, usuario.nome, evento.nome, certificado.data_emissao)(
  certificado ⋈(certificado.usuario_id = usuario.id) usuario
  ⋈(certificado.evento_id = evento.id) evento
  WHERE certificado.data_emissao IS NOT NULL
)
```

**SQL Equivalente:**
```sql
SELECT 
  c.id, u.nome as participante_nome, e.nome as evento_nome, c.data_emissao
FROM Certificado c
JOIN Usuario u ON c.usuario_id = u.id
JOIN Evento e ON c.evento_id = e.id
WHERE c.data_emissao IS NOT NULL;
``` 