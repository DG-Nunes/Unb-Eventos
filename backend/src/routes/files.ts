import { Router } from 'express';
import multer from 'multer';
import { FileController } from '../controllers/fileController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Configurar multer para upload de arquivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// POST /eventos/{id}/arquivos/upload - Upload de arquivo
router.post('/eventos/:eventId/arquivos/upload', authenticateToken, upload.single('arquivo'), FileController.uploadFile);

// DELETE /eventos/{id}/arquivos/{fileId} - Excluir arquivo
router.delete('/eventos/:eventId/arquivos/:fileId', authenticateToken, FileController.removeFile);

// GET /eventos/{id}/arquivos - Listar arquivos de um evento
router.get('/eventos/:eventId/arquivos', FileController.getEventFiles);

export default router; 