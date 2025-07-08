import jsonServer from 'json-server';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import customMiddleware from './json-server-middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, 'mock-api', 'db.json'));
const middlewares = jsonServer.defaults();

// Configurar middlewares
server.use(middlewares);
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Middleware para CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Usar o middleware customizado
server.use(customMiddleware(router));

// Middleware para simular autenticação
const authMiddleware = (req, res, next) => {
  try {
    // Simular endpoint de login
    if (req.path === '/auth' && req.method === 'POST') {
      const { email, senha } = req.body || {};
      
      if (!email || !senha) {
        return res.status(400).json({
          erro: 'Email e senha são obrigatórios'
        });
      }
      
      // Simular validação de credenciais
      if (email && senha) {
        return res.status(200).json({
          access_token: 'mock-token'
        });
      } else {
        return res.status(401).json({
          erro: 'Credenciais inválidas'
        });
      }
    }

    // Simular endpoint de cadastro de usuário
    if (req.path === '/usuarios' && req.method === 'POST') {
      const { nome, email, senha, matricula, papel_id } = req.body || {};
      
      if (!nome || !email || !senha || !papel_id) {
        return res.status(400).json({
          erro: "Dados inválidos"
        });
      }
      
      return res.status(201).json({
        mensagem: "Usuario cadastrado com sucesso."
      });
    }

    // Simular autenticação para endpoints protegidos
    const protectedRoutes = [
      '/organizador',
      '/organizador/eventos',
      '/participante',
      '/participante/eventos',
      '/usuarios/profile'
    ];

    const isProtectedRoute = protectedRoutes.some(route => 
      req.path.startsWith(route)
    );

    if (isProtectedRoute) {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ erro: 'Token de autenticação necessário' });
      }

      const token = authHeader.split(' ')[1];
      
      if (token !== 'mock-token') {
        return res.status(401).json({ erro: 'Token inválido' });
      }
    }



    // Simular endpoint /participante (GET)
    if (req.path === '/participante' && req.method === 'GET') {
      const { usuario_id } = req.query;
      if (!usuario_id) {
        return res.status(400).json({ erro: 'usuario_id é obrigatório' });
      }
      
      // Retornar eventos do db.json
      const eventos = router.db.get('eventos').value();
      return res.status(200).json(eventos);
    }

    // Simular endpoint de inscrição
    if (req.path.includes('/inscricao') && req.method === 'POST') {
      const { usuario_id, evento_id } = req.body || {};
      
      if (!usuario_id || !evento_id) {
        return res.status(400).json({
          erro: "Dados inválidos"
        });
      }
      
      return res.status(200).json({
        mensagem: "Inscrição realizada com sucesso"
      });
    }

    // Simular endpoint de criação de evento
    if (req.path === '/organizador/eventos/create' && req.method === 'POST') {
      const { nome, descricao, data_inicio, data_fim, local, capacidade, bloco } = req.body || {};
      
      if (!nome || !descricao || !data_inicio || !data_fim || !local || !capacidade || !bloco) {
        return res.status(400).json({
          erro: "Dados inválidos"
        });
      }
      
      const novoEvento = {
        id: Date.now(),
        nome,
        descricao,
        data_inicio,
        data_fim,
        local,
        capacidade: parseInt(capacidade),
        bloco,
        status: "ativo",
        quantidade_inscritos: 0,
        organizador_id: 1
      };
      
      router.db.get('eventos').push(novoEvento).write();
      
      return res.status(201).json({
        mensagem: "Evento cadastrado"
      });
    }

    // Simular endpoint de atualização de evento
    if (req.path.match(/\/organizador\/eventos\/\d+$/) && req.method === 'PUT') {
      const eventId = req.path.split('/').pop();
      
      const eventoAtualizado = router.db.get('eventos')
        .find({ id: parseInt(eventId) })
        .assign(req.body)
        .write();
      
      if (!eventoAtualizado) {
        return res.status(404).json({
          erro: "Evento não encontrado"
        });
      }
      
      return res.status(200).json({
        mensagem: "Evento atualizado com sucesso"
      });
    }

    // Simular endpoint de exclusão de evento
    if (req.path.match(/\/organizador\/eventos\/\d+$/) && req.method === 'DELETE') {
      const eventId = req.path.split('/').pop();
      
      const eventoRemovido = router.db.get('eventos')
        .remove({ id: parseInt(eventId) })
        .write();
      
      if (eventoRemovido.length === 0) {
        return res.status(404).json({
          erro: "Evento não encontrado"
        });
      }
      
      return res.status(200).json({
        mensagem: "Evento removido com sucesso"
      });
    }

    // Simular endpoint de criação de atividade
    if (req.path.includes('/create/atividades') && req.method === 'POST') {
      const { nome, descricao, data_inicio, data_fim, evento_id } = req.body || {};
      
      // Validar campos obrigatórios
      if (!nome || !descricao || !data_inicio || !data_fim || !evento_id) {
        return res.status(400).json({
          erro: "Dados inválidos"
        });
      }
      
      // Criar nova atividade no banco de dados
      const novaAtividade = {
        id: Date.now(), // Gerar ID único
        nome,
        descricao,
        data_inicio,
        data_fim,
        evento_id: parseInt(evento_id)
      };
      
      router.db.get('atividades').push(novaAtividade).write();
      
      return res.status(201).json(novaAtividade);
    }

    // Simular endpoint de certificados (POST)
    if (req.path === '/organizador/certificados' && req.method === 'POST') {
      const { participante_id, evento_id, data_emissao } = req.body || {};
      
      // Validar campos obrigatórios
      if (!participante_id || !evento_id || !data_emissao) {
        return res.status(400).json({
          erro: "Dados inválidos"
        });
      }
      
      return res.status(201).json({
        id: Date.now(),
        participante_id,
        evento_id,
        data_emissao,
        certificado_url: "https://api.unb-eventos.com/v1/certificados/1"
      });
    }

    // Simular endpoint de certificados (GET) - conforme contrato
    if (req.path === '/organizador/certificados' && req.method === 'GET') {
      const { participante_id, evento_id, data_emissao } = req.query;
      
      // Validar campos obrigatórios
      if (!participante_id || !evento_id || !data_emissao) {
        return res.status(400).json({
          erro: "Dados inválidos"
        });
      }
      
      return res.status(201).json({
        id: Date.now(),
        participante_id: parseInt(participante_id),
        evento_id: parseInt(evento_id),
        data_emissao,
        certificado_url: "https://api.unb-eventos.com/v1/certificados/1"
      });
    }

    // Simular endpoint de detalhes do evento
    if (req.path.match(/\/eventos\/\d+$/) && req.method === 'GET') {
      const eventId = req.path.split('/').pop();
      
      // Usar dados reais do db.json
      const evento = router.db.get('eventos').find({ id: parseInt(eventId) }).value();
      
      if (!evento) {
        return res.status(404).json({ erro: "Evento não encontrado" });
      }
      
      return res.status(200).json(evento);
    }

    // Simular endpoint de upload de arquivo
    if (req.path.includes('/arquivos/upload') && req.method === 'POST') {
      // Verificar se há arquivo no request
      if (!req.files && !req.body.arquivo) {
        return res.status(400).json({
          erro: "Arquivo não fornecido"
        });
      }
      
      return res.status(200).json({
        id: Date.now(),
        nome_arquivo: "documento.pdf",
        url: "https://api.unb-eventos.com/v1/arquivos/1"
      });
    }

    // Simular endpoint de busca de eventos (GET /eventos)
    if (req.path === '/eventos' && req.method === 'GET') {
      const { pagina = 1, tamanho = 10, pesquisa } = req.query;
      
      // Usar dados reais do db.json
      let eventos = router.db.get('eventos').value();
      
      // Aplicar filtro de pesquisa se fornecido
      if (pesquisa) {
        eventos = eventos.filter(evento => 
          evento.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
          evento.descricao.toLowerCase().includes(pesquisa.toLowerCase())
        );
      }
      
      // Aplicar paginação
      const inicio = (parseInt(pagina) - 1) * parseInt(tamanho);
      const fim = inicio + parseInt(tamanho);
      const eventosPaginados = eventos.slice(inicio, fim);
      const totalPaginas = Math.ceil(eventos.length / parseInt(tamanho));
      
      return res.status(200).json({
        pagina: parseInt(pagina),
        tamanho: parseInt(tamanho),
        total_paginas: totalPaginas,
        total: eventos.length,
        eventos: eventosPaginados
      });
    }

    // Simular endpoint de eventos inscritos paginados (/participante/eventos)
    if (req.path === '/participante/eventos' && req.method === 'GET') {
      const { usuario_id, pagina = 1, tamanho = 10 } = req.query;
      
      if (!usuario_id) {
        return res.status(400).json({ erro: 'usuario_id é obrigatório' });
      }
      
      const eventos = [
        {
          id: 1,
          nome: "Workshop de Python - Passado",
          descricao: "Workshop sobre programação em Python realizado no mês passado.",
          data_inicio: "2024-01-15T09:00:00Z",
          data_fim: "2024-01-15T17:00:00Z",
          status: "Concluído"
        },
        {
          id: 2,
          nome: "Palestra sobre IA - Atual",
          descricao: "Palestra sobre Inteligência Artificial acontecendo esta semana.",
          data_inicio: "2024-12-20T14:00:00Z",
          data_fim: "2024-12-20T16:00:00Z",
          status: "Em andamento"
        },
        {
          id: 3,
          nome: "Semana de Tecnologia - Próximo",
          descricao: "Semana dedicada às últimas inovações em tecnologia.",
          data_inicio: "2025-01-20T08:00:00Z",
          data_fim: "2025-01-24T18:00:00Z",
          status: "Próximo"
        },
        {
          id: 4,
          nome: "Competição de Hackathon - Futuro",
          descricao: "Competição de desenvolvimento de software em equipe.",
          data_inicio: "2025-02-15T09:00:00Z",
          data_fim: "2025-02-17T18:00:00Z",
          status: "Próximo"
        },
        {
          id: 5,
          nome: "Workshop de React - Passado",
          descricao: "Workshop sobre desenvolvimento com React realizado há 2 meses.",
          data_inicio: "2024-10-10T09:00:00Z",
          data_fim: "2024-10-10T17:00:00Z",
          status: "Concluído"
        },
        {
          id: 6,
          nome: "Palestra sobre Blockchain - Atual",
          descricao: "Palestra sobre tecnologia Blockchain acontecendo hoje.",
          data_inicio: "2024-12-21T10:00:00Z",
          data_fim: "2024-12-21T12:00:00Z",
          status: "Em andamento"
        },
        {
          id: 7,
          nome: "Congresso de Inovação - Futuro",
          descricao: "Maior evento de inovação da universidade.",
          data_inicio: "2025-03-10T08:00:00Z",
          data_fim: "2025-03-12T18:00:00Z",
          status: "Próximo"
        },
        {
          id: 8,
          nome: "Workshop de Machine Learning - Passado",
          descricao: "Workshop sobre Machine Learning realizado no início do ano.",
          data_inicio: "2024-02-20T09:00:00Z",
          data_fim: "2024-02-20T17:00:00Z",
          status: "Concluído"
        }
      ];
      
      return res.status(200).json({
        pagina: parseInt(pagina),
        tamanho: parseInt(tamanho),
        total_paginas: 1,
        eventos: eventos
      });
    }

    // Simular endpoint de atividades de um evento (/eventos/{id}/atividades)
    if (req.path.match(/\/eventos\/\d+\/atividades$/) && req.method === 'GET') {
      const eventId = req.path.split('/')[2];
      
      // Usar dados reais do db.json
      const atividades = router.db.get('atividades').filter({ evento_id: parseInt(eventId) }).value();
      
      return res.status(200).json(atividades);
    }

    // Simular endpoint de editar usuário (/usuarios/{id})
    if (req.path.match(/\/usuarios\/\d+$/) && req.method === 'PUT') {
      const { nome, email, senha } = req.body || {};
      
      if (!nome || !email) {
        return res.status(400).json({
          erro: "Nome e email são obrigatórios"
        });
      }
      
      return res.status(200).json({
        mensagem: "Usuário atualizado com sucesso"
      });
    }

    // Simular endpoint de desinscrição (/participante/eventos/{id}/desinscricao)
    if (req.path.match(/\/participante\/eventos\/\d+\/desinscricao$/) && req.method === 'DELETE') {
      return res.status(200).json({
        mensagem: "Desinscrição realizada com sucesso"
      });
    }

    // Simular endpoint de eventos inscritos do participante (erro de digitação no contrato: /paticipante/eventos/)
    if (req.path === '/paticipante/eventos/' && req.method === 'GET') {
      const eventos = [
        {
          id_usuario: 1,
          nome: "Semana Universitária",
          descricao: "Evento de integração entre alunos e professores da UnB.",
          data_inicio: "2025-06-01T08:00:00Z",
          data_fim: "2025-06-05T18:00:00Z"
        },
        {
          id: 2,
          nome: "Competição de Programação",
          descricao: "Desafio de programação para estudantes de TI.",
          data_inicio: "2025-07-15T08:00:00Z",
          data_fim: "2025-07-17T18:00:00Z"
        }
      ];
      
      return res.status(200).json(eventos);
    }

    next();
  } catch (error) {
    console.error('Erro no middleware:', error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

// Aplicar middleware de autenticação
server.use(authMiddleware);

// Middleware customizado para endpoints específicos
server.use((req, res, next) => {
  // Simular endpoint de eventos do organizador
  if (req.path === '/organizador' && req.method === 'GET') {
    const { pagina = 1, tamanho = 10 } = req.query;
    
    // Usar dados reais do db.json
    let eventos = router.db.get('eventos').value();
    
    // Aplicar paginação
    const inicio = (parseInt(pagina) - 1) * parseInt(tamanho);
    const fim = inicio + parseInt(tamanho);
    const eventosPaginados = eventos.slice(inicio, fim);
    const totalPaginas = Math.ceil(eventos.length / parseInt(tamanho));
    
    return res.status(200).json({
      pagina: parseInt(pagina),
      tamanho: parseInt(tamanho),
      total_paginas: totalPaginas,
      total: eventos.length,
      eventos: eventosPaginados
    });
  }
  
  next();
});

// Usar o router do json-server
server.use(router);

// Iniciar servidor
const port = 3002;
server.listen(port, () => {
  console.log(`JSON Server está rodando em http://localhost:${port}`);
  console.log('Endpoints disponíveis:');
  console.log(`- Eventos: http://localhost:${port}/eventos`);
  console.log(`- Usuários: http://localhost:${port}/usuarios`);
  console.log(`- Inscrições: http://localhost:${port}/inscricoes`);
  console.log(`- Auth: http://localhost:${port}/auth`);
  console.log(`- Organizador: http://localhost:${port}/organizador`);
  console.log(`- Participante: http://localhost:${port}/participante`);
}); 