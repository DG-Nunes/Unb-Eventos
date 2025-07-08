import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
        return;
      }

      const result = await AuthService.login(email, senha);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ mensagem: error.message });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const userData = req.body;
      const result = await AuthService.register(userData);
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        {
          id: result.id,
          email: result.email,
          papel: result.papel,
          matricula: result.matricula || null
        },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );
      res.status(201).json({ 
        mensagem: 'Usuario cadastrado com sucesso.',
        access_token: token,
        usuario: result
      });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ mensagem: 'Usuário não autenticado' });
        return;
      }

      const profile = await AuthService.getProfile(userId);
      res.json(profile);
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ mensagem: 'Usuário não autenticado' });
        return;
      }

      const updateData = req.body;
      const result = await AuthService.updateProfile(userId, updateData);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  static async getUserByRegistration(req: Request, res: Response): Promise<void> {
    try {
      const { registration } = req.params;
      const user = await AuthService.getUserByRegistration(registration);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ mensagem: error.message });
    }
  }
} 