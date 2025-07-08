import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { UserController } from '../controllers/userController';

const router = Router();

// POST /usuarios - Registro de usuário
router.post('/', AuthController.register);

// Rotas protegidas
router.use(authenticateToken);

// GET /usuarios/profile - Obter perfil do usuário logado
router.get('/profile', AuthController.getProfile);

// PUT /usuarios/{id} - Editar usuário
router.put('/:id', UserController.update);

export default router; 