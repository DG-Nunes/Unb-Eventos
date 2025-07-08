import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import { ActivityController } from '../controllers/activityController';
import { authenticateToken, requireOrganizer } from '../middleware/auth';

const router = Router();

// Todas as rotas de organizador requerem autenticação
router.use(authenticateToken, requireOrganizer);

// GET /organizador - Eventos do organizador
router.get('/', EventController.getByOrganizer);

// POST /organizador/eventos/create - Criar evento
router.post('/eventos/create', EventController.create);

// PUT /organizador/eventos/{id} - Atualizar evento
router.put('/eventos/:id', EventController.update);

// DELETE /organizador/eventos/{id} - Excluir evento
router.delete('/eventos/:id', EventController.remove);

// POST /organizador/eventos/{eventId}/create/atividades - Criar atividade em evento
router.post('/eventos/:eventId/create/atividades', ActivityController.create);

export default router; 