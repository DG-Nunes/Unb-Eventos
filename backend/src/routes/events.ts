import { Router } from 'express';
import { EventController } from '../controllers/eventController';
import { ActivityController } from '../controllers/activityController';
import multer from 'multer';
import { FileController } from '../controllers/fileController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// GET /eventos - Listar eventos (público)
router.get('/', EventController.getEvents);

// GET /eventos/:id - Obter evento por ID (público)
router.get('/:id', EventController.getById);

// GET /eventos/:eventId/atividades - Listar atividades de um evento
router.get('/:eventId/atividades', ActivityController.getByEvent);

// POST /eventos/:eventId/arquivos/upload - Upload de arquivo para evento
router.post('/:eventId/arquivos/upload', authenticateToken, upload.single('arquivo'), FileController.uploadFile);

export default router; 