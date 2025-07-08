import { join } from 'path';

export default function customMiddleware(router) {
  return async (req, res, next) => {
    try {
      // Simular endpoint de login
      if (req.path === '/auth' && req.method === 'POST') {
        const { email, senha } = req.body || {};
        if (!email || !senha) {
          return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
        }
        return res.status(200).json({ access_token: 'mock-token' });
      }

      // Simular endpoint de cadastro de usuário
      if (req.path === '/usuarios' && req.method === 'POST') {
        const { nome, email, senha, matricula, papel_id } = req.body || {};
        if (!nome || !email || !senha || !papel_id) {
          return res.status(400).json({ erro: 'Dados inválidos' });
        }
        return res.status(201).json({ mensagem: 'Usuario cadastrado com sucesso.' });
      }

      // Simular autenticação para endpoints protegidos
      const protectedRoutes = [
        '/organizador',
        '/organizador/eventos',
        '/participante',
        '/participante/eventos',
        '/usuarios/profile',
        '/atividades',
        '/organizador/atividades'
      ];
      const isProtectedRoute = protectedRoutes.some(route => req.path.startsWith(route));
      if (isProtectedRoute) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ erro: 'Token de autenticação necessário' });
        }
        const token = authHeader.split(' ')[1];
        // Aceitar tanto 'mock-token' quanto tokens que começam com 'mock-token-'
        if (token !== 'mock-token' && !token.startsWith('mock-token-')) {
          return res.status(401).json({ erro: 'Token inválido' });
        }
      }

      // Simular endpoint de eventos do organizador
      if (req.path === '/organizador' && req.method === 'GET') {
        const eventos = router.db.get('eventos').value();
        return res.status(200).json(eventos);
      }

      // Simular endpoint /participante (GET)
      if (req.path === '/participante' && req.method === 'GET') {
        const { usuario_id } = req.query;
        if (!usuario_id) {
          return res.status(400).json({ erro: 'usuario_id é obrigatório' });
        }
        const eventos = router.db.get('eventos').value();
        return res.status(200).json(eventos);
      }

      // Simular endpoint de inscrição
      if (req.path.includes('/inscricao') && req.method === 'POST') {
        const { usuario_id, evento_id } = req.body || {};
        if (!usuario_id || !evento_id) {
          return res.status(400).json({ erro: 'Dados inválidos' });
        }
        return res.status(200).json({ mensagem: 'Inscrição realizada com sucesso' });
      }

      // Simular endpoint de criação de evento
      if (req.path === '/organizador/eventos/create' && req.method === 'POST') {
        const { nome, descricao, data_inicio, data_fim, local, capacidade, bloco } = req.body || {};
        if (!nome || !descricao || !data_inicio || !data_fim || !local || !capacidade || !bloco) {
          return res.status(400).json({ erro: 'Dados inválidos' });
        }
        
        // Extrair o ID do usuário do token (simulado)
        // No modo mock, vamos usar um ID baseado no timestamp do token
        const token = req.headers.authorization?.split(' ')[1];
        let organizadorId = 1; // fallback
        if (token && token.startsWith('mock-token-')) {
          const timestamp = parseInt(token.replace('mock-token-', ''));
          if (!isNaN(timestamp)) {
            organizadorId = timestamp;
          }
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
          status: 'ativo',
          quantidade_inscritos: 0,
          organizador_id: organizadorId
        };
        router.db.get('eventos').push(novoEvento).write();
        return res.status(201).json({ mensagem: 'Evento cadastrado' });
      }

      // Simular endpoint de atualização de evento
      if (req.path.match(/\/organizador\/eventos\/\d+$/) && req.method === 'PUT') {
        const eventId = req.path.split('/').pop();
        const eventoAtualizado = router.db.get('eventos')
          .find({ id: parseInt(eventId) })
          .assign(req.body)
          .write();
        if (!eventoAtualizado) {
          return res.status(404).json({ erro: 'Evento não encontrado' });
        }
        return res.status(200).json({ mensagem: 'Evento atualizado com sucesso' });
      }

      // Simular endpoint de exclusão de evento
      if (req.path.match(/\/organizador\/eventos\/\d+$/) && req.method === 'DELETE') {
        const eventId = req.path.split('/').pop();
        const eventoRemovido = router.db.get('eventos')
          .remove({ id: parseInt(eventId) })
          .write();
        if (eventoRemovido.length === 0) {
          return res.status(404).json({ erro: 'Evento não encontrado' });
        }
        return res.status(200).json({ mensagem: 'Evento removido com sucesso' });
      }

      // Simular endpoint de criação de atividade
      if (req.path.match(/\/organizador\/eventos\/\d+\/create\/atividades$/) && req.method === 'POST') {
        const eventId = req.path.split('/')[3];
        const { nome, descricao, data_inicio, data_fim } = req.body || {};
        if (!nome || !descricao || !data_inicio || !data_fim) {
          return res.status(400).json({ erro: 'Dados inválidos' });
        }
        
        const novaAtividade = {
          id: Date.now(),
          nome,
          descricao,
          data_inicio,
          data_fim,
          evento_id: parseInt(eventId)
        };
        
        // Inicializar array de atividades se não existir
        if (!router.db.has('atividades').value()) {
          router.db.set('atividades', []).write();
        }
        
        router.db.get('atividades').push(novaAtividade).write();
        return res.status(201).json({ mensagem: 'Atividade criada com sucesso' });
      }

      // Simular endpoint de listagem de atividades de um evento
      if (req.path.match(/\/atividades\/eventos\/\d+$/) && req.method === 'GET') {
        const eventId = req.path.split('/').pop();
        const atividades = router.db.get('atividades')
          .filter({ evento_id: parseInt(eventId) })
          .value();
        return res.status(200).json(atividades || []);
      }

      // Simular endpoint de atualização de atividade
      if (req.path.match(/\/organizador\/atividades\/\d+$/) && req.method === 'PUT') {
        const activityId = req.path.split('/').pop();
        const atividadeAtualizada = router.db.get('atividades')
          .find({ id: parseInt(activityId) })
          .assign(req.body)
          .write();
        if (!atividadeAtualizada) {
          return res.status(404).json({ erro: 'Atividade não encontrada' });
        }
        return res.status(200).json({ mensagem: 'Atividade atualizada com sucesso' });
      }

      // Simular endpoint de exclusão de atividade
      if (req.path.match(/\/organizador\/atividades\/\d+$/) && req.method === 'DELETE') {
        const activityId = req.path.split('/').pop();
        const atividadeRemovida = router.db.get('atividades')
          .remove({ id: parseInt(activityId) })
          .write();
        if (atividadeRemovida.length === 0) {
          return res.status(404).json({ erro: 'Atividade não encontrada' });
        }
        return res.status(200).json({ mensagem: 'Atividade removida com sucesso' });
      }

      next();
    } catch (error) {
      console.error('Erro no middleware:', error);
      res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  };
} 