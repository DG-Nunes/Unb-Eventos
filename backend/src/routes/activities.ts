import { Router } from 'express';
import { ActivityController } from '../controllers/activityController';
import { authenticateToken, requireOrganizer } from '../middleware/auth';

const router = Router();

// PUT /atividades/{id} - Atualizar atividade
router.put('/atividades/:id', authenticateToken, requireOrganizer, ActivityController.update);

// DELETE /atividades/{id} - Excluir atividade
router.delete('/atividades/:id', authenticateToken, requireOrganizer, ActivityController.remove);

export default router; 