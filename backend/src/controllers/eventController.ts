import { Request, Response } from 'express';
import { EventService } from '../services/eventService';
import { AuthRequest } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class EventController {
  static async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const organizadorId = req.user!.id;
      const eventData = {
        ...req.body,
        organizador_id: organizadorId
      };

      const evento = await EventService.create(eventData);
      res.status(201).json({ mensagem: 'Evento criado com sucesso', evento });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const eventos = await EventService.getAll();
      res.json(eventos);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const eventoId = parseInt(req.params.id);
      const evento = await EventService.getById(eventoId);
      
      if (!evento) {
        res.status(404).json({ mensagem: 'Evento não encontrado' });
        return;
      }

      res.json(evento);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async update(req: AuthRequest, res: Response): Promise<void> {
    try {
      const eventoId = parseInt(req.params.id);
      const evento = await EventService.getById(eventoId);
      
      if (!evento) {
        res.status(404).json({ mensagem: 'Evento não encontrado' });
        return;
      }

      // Verificar se o usuário é o organizador do evento
      if (!req.user || req.user.id !== evento.organizador_id) {
        res.status(403).json({ mensagem: 'Acesso negado' });
        return;
      }

      const eventoAtualizado = await EventService.update(eventoId, req.body);
      res.json({ mensagem: 'Evento atualizado com sucesso', evento: eventoAtualizado });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  static async remove(req: AuthRequest, res: Response): Promise<void> {
    try {
      const eventoId = parseInt(req.params.id);
      const evento = await EventService.getById(eventoId);
      
      if (!evento) {
        res.status(404).json({ mensagem: 'Evento não encontrado' });
        return;
      }

      // Verificar se o usuário é o organizador do evento
      if (!req.user || req.user.id !== evento.organizador_id) {
        res.status(403).json({ mensagem: 'Acesso negado' });
        return;
      }

      await EventService.remove(eventoId);
      res.json({ mensagem: 'Evento removido com sucesso' });
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async getByOrganizer(req: AuthRequest, res: Response): Promise<void> {
    try {
      const organizadorId = req.user!.id;
      const eventos = await EventService.getByOrganizer(organizadorId);
      res.json(eventos);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  // GET /eventos - Listar eventos (público)
  static async getEvents(req: Request, res: Response) {
    try {
      const { pagina = 1, tamanho = 10, pesquisa, status } = req.query;
      const page = parseInt(pagina as string);
      const size = parseInt(tamanho as string);

      const filters = {
        pesquisa: pesquisa as string,
        status: status as string
      };

      const pagination = {
        pagina: page,
        tamanho: size
      };

      const result = await EventService.getEvents(filters, pagination);
      res.json(result);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
  }
} 