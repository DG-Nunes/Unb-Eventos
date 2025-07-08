import { Router } from 'express';
import { RegistrationController } from '../controllers/registrationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas as rotas de participante requerem autenticação
router.use(authenticateToken);

// POST /participante/eventos/{id}/inscricao - Inscrever em evento
router.post('/eventos/:eventId/inscricao', RegistrationController.registerForEvent);

// DELETE /participante/eventos/{id}/desinscricao - Cancelar inscrição
router.delete('/eventos/:eventId/desinscricao', RegistrationController.cancelRegistration);

// GET /participante/eventos - Eventos inscritos do participante (paginado)
router.get('/eventos', RegistrationController.getParticipantEvents);

// GET /participante - Eventos do participante (legacy)
router.get('/', RegistrationController.getParticipantEvents);

// POST /participante/procedure/registrar - Registrar usando procedure
router.post('/procedure/registrar', async (req, res) => {
  await RegistrationController.registerParticipantWithProcedure(req, res);
});

export default router; 