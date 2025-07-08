import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    papel: string;
    matricula: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  console.log('🔐 Authenticating token for:', req.url);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('❌ No token provided');
    res.status(401).json({ mensagem: 'Token de acesso necessário' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    console.log('✅ Token verified for user:', decoded.id);
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id }
    });

    if (!usuario) {
      console.log('❌ User not found:', decoded.id);
      res.status(401).json({ mensagem: 'Usuário não encontrado' });
      return;
    }

    req.user = {
      id: usuario.id,
      email: usuario.email,
      papel: usuario.papel,
      matricula: usuario.matricula
    };

    console.log('✅ User authenticated:', usuario.email, 'Role:', usuario.papel);
    next();
  } catch (error) {
    console.log('❌ Token verification failed:', error);
    res.status(403).json({ mensagem: 'Token inválido' });
  }
};

export const requireOrganizer = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log('👤 Checking organizer permissions for:', req.url);
  
  if (!req.user) {
    console.log('❌ No user in request');
    res.status(401).json({ mensagem: 'Autenticação necessária' });
    return;
  }

  console.log('👤 User role:', req.user.papel);
  
  if (req.user.papel !== 'organizador') {
    console.log('❌ User is not organizer:', req.user.papel);
    res.status(403).json({ mensagem: 'Acesso negado. Apenas organizadores podem realizar esta ação.' });
    return;
  }

  console.log('✅ Organizer permission granted');
  next();
};

export const requireParticipant = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  // Verificar se o usuário é aluno (participante)
  if (!req.user) {
    res.status(401).json({ mensagem: 'Usuário não autenticado' });
    return;
  }

  // Para simplificar, vamos considerar que alunos são participantes
  // Em uma implementação real, você pode ter um campo específico para isso
  next();
}; 