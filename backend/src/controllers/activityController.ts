import { Request, Response } from 'express';
import { ActivityService } from '../services/activityService';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ActivityController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const organizadorId = req.user!.id;
      const eventId = parseInt(req.params.eventId);
      
      // Verificar se o evento existe e se o usuário é o organizador
      const evento = await prisma.evento.findUnique({
        where: { id: eventId }
      });

      if (!evento) {
        res.status(404).json({ mensagem: 'Evento não encontrado' });
        return;
      }

      if (evento.organizador_id !== organizadorId) {
        res.status(403).json({ mensagem: 'Acesso negado. Apenas o organizador do evento pode criar atividades.' });
        return;
      }

      const activityData = {
        ...req.body,
        evento_id: eventId
      };

      const atividade = await ActivityService.create(activityData);
      res.status(201).json({ mensagem: 'Atividade criada com sucesso', data: atividade });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const atividadeId = parseInt(req.params.id);
      const organizadorId = req.user!.id;

      // Verificar se o usuário é organizador da atividade
      const atividade = await ActivityService.getById(atividadeId);
      if (!atividade) {
        res.status(404).json({ mensagem: 'Atividade não encontrada' });
        return;
      }

      // Verificar se o usuário é organizador do evento da atividade
      const evento = await prisma.evento.findUnique({
        where: { id: atividade.evento_id }
      });
      
      if (!evento || evento.organizador_id !== organizadorId) {
        res.status(403).json({ mensagem: 'Acesso negado' });
        return;
      }

      const atividadeAtualizada = await ActivityService.update(atividadeId, req.body);
      res.json({ mensagem: 'Atividade atualizada com sucesso', atividade: atividadeAtualizada });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  static async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      const atividadeId = parseInt(req.params.id);
      const organizadorId = req.user!.id;

      // Verificar se o usuário é organizador da atividade
      const atividade = await ActivityService.getById(atividadeId);
      if (!atividade) {
        res.status(404).json({ mensagem: 'Atividade não encontrada' });
        return;
      }

      // Verificar se o usuário é organizador do evento da atividade
      const evento = await prisma.evento.findUnique({
        where: { id: atividade.evento_id }
      });
      
      if (!evento || evento.organizador_id !== organizadorId) {
        res.status(403).json({ mensagem: 'Acesso negado' });
        return;
      }

      await ActivityService.remove(atividadeId);
      res.json({ mensagem: 'Atividade removida com sucesso' });
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async getByEvent(req: Request, res: Response): Promise<void> {
    try {
      const eventoId = parseInt(req.params.eventId);
      const atividades = await ActivityService.getByEventId(eventoId);
      res.json(atividades);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const atividade = await ActivityService.getById(Number(req.params.id));
      if (!atividade) {
        res.status(404).json({ mensagem: 'Atividade não encontrada' });
        return;
      }
      res.json(atividade);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const atividades = await ActivityService.getAll();
      res.json(atividades);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }
} 