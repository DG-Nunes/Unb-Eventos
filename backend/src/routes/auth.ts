import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

// POST /auth - Login de usuário
router.post('/', AuthController.login);

// POST /auth/register - Registro (opcional, pode ser movido para /usuarios)
router.post('/register', AuthController.register);

// GET /auth/profile - Obter perfil do usuário logado
router.get('/profile', AuthController.getProfile);

export default router; 