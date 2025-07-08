import { Router } from 'express';
import { CertificateController } from '../controllers/certificateController';
import { authenticateToken, requireOrganizer } from '../middleware/auth';

const router = Router();

// Test route without authentication
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Certificates router is working',
    url: req.url,
    method: req.method
  });
});

// Rotas para participantes (apenas autenticação)
router.use(authenticateToken);

// GET /certificados/meus - Listar certificados do participante
router.get('/meus', CertificateController.getParticipantCertificates);

// Rotas para organizadores
router.use(requireOrganizer);

// POST /certificados/organizador - Gerar certificado (corrigido)
router.post('/organizador', CertificateController.generateCertificate);

// GET /certificados/evento/{eventId} - Listar certificados de um evento
router.get('/evento/:eventId', CertificateController.getEventCertificates);

// GET /certificados/{id} - Obter certificado por ID (público) - DEVE VIR POR ÚLTIMO
router.get('/:id', CertificateController.getById);

export default router; 