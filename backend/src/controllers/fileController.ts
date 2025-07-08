import { Request, Response } from 'express';
import { FileService } from '../services/fileService';
import { AuthRequest } from '../middleware/auth';
import path from 'path';
import fs from 'fs';

export class FileController {
  static async uploadFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const organizadorId = req.user!.id;
      const eventIdParam = req.params.eventId || req.body.evento_id;
      if (!eventIdParam) {
        res.status(400).json({ mensagem: 'ID do evento não fornecido' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ mensagem: 'Arquivo não fornecido' });
        return;
      }

      const fileData = {
        filename: req.file.originalname,
        buffer: req.file.buffer,
        size: req.file.size,
        type: req.file.mimetype,
        eventoId: parseInt(eventIdParam),
        organizadorId: organizadorId
      };

      const arquivo = await FileService.uploadFile(fileData);
      res.status(201).json({ mensagem: 'Arquivo enviado com sucesso', arquivo });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  static async downloadFile(req: Request, res: Response): Promise<void> {
    try {
      const arquivoId = parseInt(req.params.id);
      const arquivo = await FileService.downloadFile(arquivoId);

      if (!arquivo) {
        res.status(404).json({ mensagem: 'Arquivo não encontrado' });
        return;
      }

      res.download(arquivo.path, arquivo.nome_arquivo);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async removeFile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const organizadorId = req.user!.id;
      const arquivoId = parseInt(req.params.id);

      await FileService.removeFile(arquivoId, organizadorId);
      res.json({ mensagem: 'Arquivo removido com sucesso' });
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async getEventFiles(req: Request, res: Response): Promise<void> {
    try {
      const eventoId = parseInt(req.params.eventId);
      const arquivos = await FileService.getEventFiles(eventoId);
      res.json(arquivos);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async getFileInfo(req: Request, res: Response): Promise<void> {
    try {
      const arquivoId = parseInt(req.params.fileId);
      const arquivoInfo = await FileService.getFileInfo(arquivoId);

      res.json(arquivoInfo);
    } catch (error: any) {
      res.status(404).json({
        mensagem: error.message || 'Arquivo não encontrado'
      });
    }
  }
} 