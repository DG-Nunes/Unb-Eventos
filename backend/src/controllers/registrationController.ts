import { Request, Response } from 'express';
import { RegistrationService } from '../services/registrationService';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class RegistrationController {
  static async registerForEvent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const usuarioId = req.user!.id;
      const { evento_id } = req.body;

      const inscricao = await RegistrationService.registerForEvent(parseInt(evento_id), usuarioId);
      res.status(201).json({ mensagem: 'Inscrição realizada com sucesso', inscricao });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  static async cancelRegistration(req: AuthRequest, res: Response): Promise<void> {
    try {
      const usuarioId = req.user!.id;
      const { eventId } = req.params;

      await RegistrationService.cancelRegistration(parseInt(eventId), usuarioId);
      res.json({ mensagem: 'Inscrição cancelada com sucesso' });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  static async getParticipantEvents(req: AuthRequest, res: Response): Promise<void> {
    try {
      const usuarioId = req.user!.id;
      const { pagina = 1, tamanho = 10 } = req.query;
      
      const pagination = {
        pagina: parseInt(pagina as string),
        tamanho: parseInt(tamanho as string)
      };

      const eventos = await RegistrationService.getParticipantEvents(usuarioId, pagination);
      res.json(eventos);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async getEventRegistrations(req: AuthRequest, res: Response): Promise<void> {
    try {
      const organizadorId = req.user!.id;
      const eventoId = parseInt(req.params.eventId);

      // Verificar se o usuário é organizador do evento
      const evento = await prisma.evento.findUnique({
        where: { id: eventoId }
      });
      
      if (!evento || evento.organizador_id !== organizadorId) {
        res.status(403).json({ mensagem: 'Acesso negado' });
        return;
      }

      const inscricoes = await RegistrationService.getEventRegistrations(eventoId);
      res.json(inscricoes);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async updateRegistrationStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const organizadorId = req.user!.id;
      const { inscricaoId } = req.params;
      const { status } = req.body;

      // Verificar se o usuário é organizador do evento
      const inscricao = await RegistrationService.getById(parseInt(inscricaoId));
      if (!inscricao) {
        res.status(404).json({ mensagem: 'Inscrição não encontrada' });
        return;
      }

      const evento = await prisma.evento.findUnique({
        where: { id: inscricao.evento_id }
      });
      
      if (!evento || evento.organizador_id !== organizadorId) {
        res.status(403).json({ mensagem: 'Acesso negado' });
        return;
      }

      const inscricaoAtualizada = await RegistrationService.updateRegistrationStatus(
        inscricao.evento_id, 
        inscricao.usuario_id, 
        status
      );
      res.json({ mensagem: 'Status da inscrição atualizado com sucesso', inscricao: inscricaoAtualizada });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  // CRUD operations for admin/organizer
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const inscricoes = await RegistrationService.getAll();
      res.json(inscricoes);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const inscricao = await RegistrationService.getById(Number(req.params.id));
      if (!inscricao) {
        res.status(404).json({ mensagem: 'Inscrição não encontrada' });
        return;
      }
      res.json(inscricao);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const inscricao = await RegistrationService.create(req.body);
      res.status(201).json({ mensagem: 'Inscrição criada com sucesso', inscricao });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const inscricao = await RegistrationService.update(Number(req.params.id), req.body);
      res.json({ mensagem: 'Inscrição atualizada com sucesso', inscricao });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  static async remove(req: Request, res: Response): Promise<void> {
    try {
      await RegistrationService.remove(Number(req.params.id));
      res.json({ mensagem: 'Inscrição removida com sucesso' });
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  // Registrar participante usando procedure
  static async registerParticipantWithProcedure(req: Request, res: Response) {
    try {
      const { usuario_id, evento_id } = req.body;

      if (!usuario_id || !evento_id) {
        return res.status(400).json({ 
          error: 'usuario_id e evento_id são obrigatórios' 
        });
      }

      // Simular a procedure do banco de dados
      const result = await RegistrationService.registerWithProcedure(
        usuario_id, 
        evento_id
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao registrar participante com procedure:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor' 
      });
    }
  }
} 