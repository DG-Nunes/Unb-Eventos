-- Script SQL para criação do banco de dados UNB Events
-- Projeto de Banco de Dados - Universidade de Brasília
-- Estrutura compatível com Prisma Schema

-- Criar tabela de usuários
CREATE TABLE Usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    matricula TEXT UNIQUE NOT NULL,
    papel TEXT NOT NULL CHECK (papel IN ('admin', 'organizador', 'participante')),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de departamentos
CREATE TABLE Department (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de professores
CREATE TABLE Professor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    registration TEXT UNIQUE NOT NULL,
    departmentId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (departmentId) REFERENCES Department(id)
);

-- Criar tabela de estudantes
CREATE TABLE Student (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    registration TEXT UNIQUE NOT NULL,
    course TEXT NOT NULL,
    departmentId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (departmentId) REFERENCES Department(id)
);

-- Criar tabela de categorias
CREATE TABLE Category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de locais
CREATE TABLE Location (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de eventos
CREATE TABLE Evento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME NOT NULL,
    local TEXT NOT NULL,
    bloco TEXT,
    capacidade INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('ativo', 'cancelado', 'concluido')),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    organizador_id INTEGER NOT NULL,
    FOREIGN KEY (organizador_id) REFERENCES Usuario(id)
);

-- Criar tabela de atividades
CREATE TABLE Atividade (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    evento_id INTEGER NOT NULL,
    FOREIGN KEY (evento_id) REFERENCES Evento(id)
);

-- Criar tabela de inscrições
CREATE TABLE Inscricao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT NOT NULL CHECK (status IN ('confirmada', 'pendente', 'cancelada')),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario_id INTEGER NOT NULL,
    evento_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (evento_id) REFERENCES Evento(id)
);

-- Criar tabela de certificados
CREATE TABLE Certificado (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inscricao_id INTEGER UNIQUE NOT NULL,
    usuario_id INTEGER NOT NULL,
    evento_id INTEGER NOT NULL,
    data_emissao DATETIME DEFAULT CURRENT_TIMESTAMP,
    url TEXT,
    FOREIGN KEY (inscricao_id) REFERENCES Inscricao(id),
    FOREIGN KEY (usuario_id) REFERENCES Usuario(id),
    FOREIGN KEY (evento_id) REFERENCES Evento(id)
);

-- Criar tabela de arquivos
CREATE TABLE Arquivo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_arquivo TEXT NOT NULL,
    url TEXT NOT NULL,
    tamanho INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    evento_id INTEGER,
    FOREIGN KEY (evento_id) REFERENCES Evento(id)
);

-- Inserir dados de exemplo

-- Departamentos
INSERT INTO Department (name, code, description) VALUES
('Ciência da Computação', 'CIC', 'Departamento de Ciência da Computação'),
('Matemática', 'MAT', 'Departamento de Matemática'),
('Física', 'FIS', 'Departamento de Física'),
('Química', 'QUI', 'Departamento de Química'),
('Biologia', 'BIO', 'Departamento de Biologia');

-- Usuários (Organizadores)
INSERT INTO Usuario (nome, email, senha, matricula, papel) VALUES
('João Silva', 'joao.silva@unb.br', '$2b$10$2iRHl.CFoTvxBrcvAxuqAekwcRxCLBUfT/K3zOgzOk4JJ073c.Nui', '2021001', 'organizador'),
('Maria Santos', 'maria.santos@unb.br', '$2b$10$2iRHl.CFoTvxBrcvAxuqAekwcRxCLBUfT/K3zOgzOk4JJ073c.Nui', '2021002', 'organizador'),
('Pedro Oliveira', 'pedro.oliveira@unb.br', '$2b$10$2iRHl.CFoTvxBrcvAxuqAekwcRxCLBUfT/K3zOgzOk4JJ073c.Nui', '2021003', 'organizador'),
('Ana Costa', 'ana.costa@unb.br', '$2b$10$2iRHl.CFoTvxBrcvAxuqAekwcRxCLBUfT/K3zOgzOk4JJ073c.Nui', '2021004', 'organizador'),
('Carlos Ferreira', 'carlos.ferreira@unb.br', '$2b$10$2iRHl.CFoTvxBrcvAxuqAekwcRxCLBUfT/K3zOgzOk4JJ073c.Nui', '2021005', 'organizador');

-- Usuários (Participantes)
INSERT INTO Usuario (nome, email, senha, matricula, papel) VALUES
('Lucas Almeida', 'lucas.almeida@unb.br', '$2b$10$2iRHl.CFoTvxBrcvAxuqAekwcRxCLBUfT/K3zOgzOk4JJ073c.Nui', '2022001', 'participante'),
('Julia Rodrigues', 'julia.rodrigues@unb.br', '$2b$10$2iRHl.CFoTvxBrcvAxuqAekwcRxCLBUfT/K3zOgzOk4JJ073c.Nui', '2022002', 'participante'),
('Gabriel Lima', 'gabriel.lima@unb.br', '$2b$10$2iRHl.CFoTvxBrcvAxuqAekwcRxCLBUfT/K3zOgzOk4JJ073c.Nui', '2022003', 'participante'),
('Fernanda Martins', 'fernanda.martins@unb.br', '$2b$10$2iRHl.CFoTvxBrcvAxuqAekwcRxCLBUfT/K3zOgzOk4JJ073c.Nui', '2022004', 'participante'),
('Rafael Souza', 'rafael.souza@unb.br', '$2b$10$2iRHl.CFoTvxBrcvAxuqAekwcRxCLBUfT/K3zOgzOk4JJ073c.Nui', '2022005', 'participante');

-- Professores
INSERT INTO Professor (name, email, registration, departmentId) VALUES
('Dr. Carlos Mendes', 'carlos.mendes@unb.br', '2023001', 1),
('Dra. Fernanda Lima', 'fernanda.lima@unb.br', '2023002', 1),
('Dr. Roberto Alves', 'roberto.alves@unb.br', '2023003', 2),
('Dra. Juliana Costa', 'juliana.costa@unb.br', '2023004', 3),
('Dr. Marcos Silva', 'marcos.silva@unb.br', '2023005', 4);

-- Estudantes
INSERT INTO Student (name, email, registration, course, departmentId) VALUES
('Lucas Pereira', 'lucas.pereira@aluno.unb.br', '202300001', 'Ciência da Computação', 1),
('Camila Rodrigues', 'camila.rodrigues@aluno.unb.br', '202300002', 'Ciência da Computação', 1),
('Gabriel Santos', 'gabriel.santos@aluno.unb.br', '202300003', 'Matemática', 2),
('Isabela Costa', 'isabela.costa@aluno.unb.br', '202300004', 'Física', 3),
('Rafael Oliveira', 'rafael.oliveira@aluno.unb.br', '202300005', 'Química', 4);

-- Categorias
INSERT INTO Category (name, description) VALUES
('Palestra', 'Eventos de palestras e apresentações'),
('Workshop', 'Eventos práticos e workshops'),
('Competição', 'Competições e maratonas'),
('Seminário', 'Seminários acadêmicos'),
('Conferência', 'Conferências científicas');

-- Locais
INSERT INTO Location (name, address, capacity, description) VALUES
('Auditório da Reitoria', 'Campus Darcy Ribeiro', 200, 'Auditório principal da reitoria'),
('Sala de Conferências CIC', 'ICC Norte - CIC', 50, 'Sala de conferências do CIC'),
('Laboratório de Informática', 'ICC Norte - CIC', 30, 'Laboratório de informática'),
('Anfiteatro 9', 'ICC Norte', 100, 'Anfiteatro 9 do ICC Norte'),
('Sala de Reuniões', 'ICC Sul', 20, 'Sala de reuniões do ICC Sul');

-- Eventos
INSERT INTO Evento (nome, descricao, data_inicio, data_fim, local, bloco, capacidade, status, organizador_id) VALUES
('Workshop de Programação Python', 'Aprenda Python do básico ao avançado em um workshop prático', '2024-12-20 09:00:00', '2024-12-20 17:00:00', 'Sala ICC 101', 'ICC', 30, 'ativo', 1),
('Palestra: Inteligência Artificial', 'Conceitos fundamentais de IA e machine learning', '2024-12-25 14:00:00', '2024-12-25 16:00:00', 'Auditório PAT', 'PAT', 100, 'ativo', 2),
('Seminário de Matemática Aplicada', 'Discussão sobre aplicações da matemática em problemas reais', '2024-12-30 10:00:00', '2024-12-30 12:00:00', 'Sala FGA 205', 'FGA', 50, 'ativo', 3),
('Minicurso de Desenvolvimento Web', 'Crie aplicações web modernas com React e Node.js', '2025-01-05 08:00:00', '2025-01-05 18:00:00', 'Laboratório ICC 203', 'ICC', 25, 'ativo', 4),
('Conferência de Engenharia de Software', 'Melhores práticas e tendências em desenvolvimento de software', '2025-01-10 09:00:00', '2025-01-10 17:00:00', 'Auditório Principal', 'PAT', 150, 'ativo', 5);

-- Atividades
INSERT INTO Atividade (nome, descricao, data_inicio, data_fim, evento_id) VALUES
('Introdução ao Python', 'Conceitos básicos da linguagem Python', '2024-12-20 09:00:00', '2024-12-20 11:00:00', 1),
('Estruturas de Dados', 'Implementação de estruturas de dados em Python', '2024-12-20 13:00:00', '2024-12-20 15:00:00', 1),
('Fundamentos de IA', 'Conceitos básicos de inteligência artificial', '2024-12-25 14:00:00', '2024-12-25 15:00:00', 2),
('Machine Learning', 'Introdução ao machine learning', '2024-12-25 15:00:00', '2024-12-25 16:00:00', 2),
('Cálculo Numérico', 'Métodos numéricos aplicados', '2024-12-30 10:00:00', '2024-12-30 12:00:00', 3);

-- Inscrições
INSERT INTO Inscricao (usuario_id, evento_id, status) VALUES
(6, 1, 'confirmada'),
(7, 1, 'confirmada'),
(8, 2, 'confirmada'),
(9, 2, 'confirmada'),
(10, 3, 'confirmada');

-- Arquivos
INSERT INTO Arquivo (nome_arquivo, url, tamanho, tipo, evento_id) VALUES
('apresentacao_python.pdf', '/uploads/apresentacao_python.pdf', 1024000, 'application/pdf', 1),
('material_ia.pdf', '/uploads/material_ia.pdf', 2048000, 'application/pdf', 2),
('slides_matematica.pdf', '/uploads/slides_matematica.pdf', 1536000, 'application/pdf', 3),
('codigo_exemplo.zip', '/uploads/codigo_exemplo.zip', 512000, 'application/zip', 4),
('documentacao_software.pdf', '/uploads/documentacao_software.pdf', 3072000, 'application/pdf', 5);

-- Certificados
INSERT INTO Certificado (inscricao_id, usuario_id, evento_id, url) VALUES
(1, 6, 1, '/certificados/certificado_1.pdf'),
(2, 7, 1, '/certificados/certificado_2.pdf'),
(3, 8, 2, '/certificados/certificado_3.pdf'),
(4, 9, 2, '/certificados/certificado_4.pdf'),
(5, 10, 3, '/certificados/certificado_5.pdf');

-- Criar índices para melhor performance
CREATE INDEX idx_usuario_email ON Usuario(email);
CREATE INDEX idx_evento_data_inicio ON Evento(data_inicio);
CREATE INDEX idx_inscricao_usuario ON Inscricao(usuario_id);
CREATE INDEX idx_inscricao_evento ON Inscricao(evento_id);
CREATE INDEX idx_atividade_evento ON Atividade(evento_id);
CREATE INDEX idx_arquivo_evento ON Arquivo(evento_id);

-- Criar view para detalhes do evento
CREATE VIEW DetalhesEvento AS
SELECT 
    e.id,
    e.nome,
    e.descricao,
    e.data_inicio,
    e.data_fim,
    e.local,
    e.bloco,
    e.capacidade,
    e.status,
    u.nome as organizador_nome,
    u.email as organizador_email,
    COUNT(i.id) as quantidade_inscritos
FROM Evento e
LEFT JOIN Usuario u ON e.organizador_id = u.id
LEFT JOIN Inscricao i ON e.id = i.evento_id AND i.status = 'confirmada'
GROUP BY e.id;

-- Criar procedure para registrar participante em evento
CREATE PROCEDURE RegistrarParticipante(
    p_usuario_id INTEGER,
    p_evento_id INTEGER
)
BEGIN
    DECLARE v_capacidade INTEGER;
    DECLARE v_inscritos INTEGER;
    DECLARE v_status TEXT;
    DECLARE v_data_inicio DATETIME;
    DECLARE v_data_fim DATETIME;
    
    -- Verificar se o evento existe e obter dados
    SELECT capacidade, data_inicio, data_fim, status INTO v_capacidade, v_data_inicio, v_data_fim, v_status
    FROM Evento WHERE id = p_evento_id;
    
    -- Verificar se o evento está ativo
    IF v_status != 'ativo' THEN
        SELECT 'Evento não está ativo' as mensagem;
        RETURN;
    END IF;
    
    -- Verificar se o evento já passou
    IF datetime('now') > v_data_fim THEN
        SELECT 'Evento já passou' as mensagem;
        RETURN;
    END IF;
    
    -- Verificar se o usuário já está inscrito
    SELECT COUNT(*) INTO v_inscritos 
    FROM Inscricao 
    WHERE usuario_id = p_usuario_id AND evento_id = p_evento_id;
    
    IF v_inscritos > 0 THEN
        SELECT 'Usuário já está inscrito neste evento' as mensagem;
        RETURN;
    END IF;
    
    -- Contar inscritos confirmados
    SELECT COUNT(*) INTO v_inscritos 
    FROM Inscricao 
    WHERE evento_id = p_evento_id AND status = 'confirmada';
    
    -- Verificar se há vagas
    IF v_inscritos >= v_capacidade THEN
        SELECT 'Evento lotado' as mensagem;
        RETURN;
    END IF;
    
    -- Registrar inscrição
    INSERT INTO Inscricao (usuario_id, evento_id, status)
    VALUES (p_usuario_id, p_evento_id, 'confirmada');
    
    SELECT 'Inscrição realizada com sucesso' as mensagem;
END;

-- Criar view para eventos com estatísticas
CREATE VIEW vw_eventos_estatisticas AS
SELECT 
  e.id,
  e.nome as evento_nome,
  e.descricao,
  e.data_inicio,
  e.data_fim,
  e.local,
  e.bloco,
  e.capacidade,
  e.status,
  u.nome as organizador_nome,
  u.email as organizador_email,
  COUNT(DISTINCT i.id) as total_inscritos,
  COUNT(DISTINCT CASE WHEN i.status = 'confirmada' THEN i.id END) as inscritos_confirmados,
  COUNT(DISTINCT a.id) as total_atividades,
  COUNT(DISTINCT ar.id) as total_arquivos,
  COUNT(DISTINCT c.id) as total_certificados,
  ROUND((COUNT(DISTINCT CASE WHEN i.status = 'confirmada' THEN i.id END) * 100.0 / e.capacidade), 2) as percentual_ocupacao
FROM Evento e
LEFT JOIN Usuario u ON e.organizador_id = u.id
LEFT JOIN Inscricao i ON e.id = i.evento_id
LEFT JOIN Atividade a ON e.id = a.evento_id
LEFT JOIN Arquivo ar ON e.id = ar.evento_id
LEFT JOIN Certificado c ON e.id = c.evento_id
GROUP BY e.id, e.nome, e.descricao, e.data_inicio, e.data_fim, e.local, e.bloco, e.capacidade, e.status, u.nome, u.email; 