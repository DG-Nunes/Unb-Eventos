import { Request, Response } from 'express';
import { CertificateService } from '../services/certificateService';
import { AuthRequest } from '../middleware/auth';

export class CertificateController {
  static async generateCertificate(req: AuthRequest, res: Response): Promise<void> {
    console.log('🎓 Generating certificates for event:', req.body.evento_id);
    console.log('👤 Organizer ID:', req.user!.id);
    
    try {
      const organizadorId = req.user!.id;
      const { evento_id, data_emissao } = req.body;
      
      if (!evento_id) {
        console.log('❌ Missing evento_id');
        res.status(400).json({ mensagem: 'evento_id é obrigatório' });
        return;
      }

      console.log('✅ Calling service to generate certificates');
      const certificados = await CertificateService.generateCertificatesForAllParticipants(
        evento_id,
        new Date(data_emissao || new Date()),
        organizadorId
      );
      
      console.log('✅ Certificates generated successfully:', certificados.length);
      res.status(201).json({ 
        mensagem: 'Certificados gerados com sucesso', 
        certificados,
        quantidade: certificados.length
      });
    } catch (error: any) {
      console.error('❌ Error generating certificates:', error);
      
      // Se for erro de validação (não há inscrições, evento não encontrado, etc), retorna 400
      if (error.message.includes('não encontrado') || 
          error.message.includes('Nenhum participante') ||
          error.message.includes('não tem permissão')) {
        res.status(400).json({ mensagem: error.message });
      } else {
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
      }
    }
  }

  static async getEventCertificates(req: AuthRequest, res: Response): Promise<void> {
    try {
      const organizadorId = req.user!.id;
      const eventoId = parseInt(req.params.eventId);
      
      if (isNaN(eventoId)) {
        res.status(400).json({ mensagem: 'ID do evento inválido' });
        return;
      }
      
      const certificados = await CertificateService.getEventCertificates(eventoId, organizadorId);
      res.json(certificados);
    } catch (error: any) {
      console.error('Erro ao buscar certificados do evento:', error);
      
      if (error.message.includes('não encontrado') || error.message.includes('não tem permissão')) {
        res.status(400).json({ mensagem: error.message });
      } else {
        res.status(500).json({ mensagem: 'Erro interno do servidor' });
      }
    }
  }

  static async getParticipantCertificates(req: AuthRequest, res: Response): Promise<void> {
    try {
      const participanteId = req.user!.id;
      console.log('Buscando certificados para participante ID:', participanteId);
      
      const certificados = await CertificateService.getParticipantCertificates(participanteId);
      console.log('Certificados encontrados:', certificados.length);
      
      res.json(certificados);
    } catch (error: any) {
      console.error('Erro ao buscar certificados do participante:', error);
      res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
  }

  static async downloadCertificate(req: AuthRequest, res: Response): Promise<void> {
    try {
      const certificadoId = parseInt(req.params.id);
      const organizadorId = req.user!.id;

      const certificado = await CertificateService.getById(certificadoId);
      if (!certificado) {
        res.status(404).json({ mensagem: 'Certificado não encontrado' });
        return;
      }

      // TODO: Implementar verificação de permissão e download do certificado
      res.status(501).json({ mensagem: 'Download de certificado não implementado' });
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  // CRUD operations for admin/organizer
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const certificados = await CertificateService.getAll();
      res.json(certificados);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const certificado = await CertificateService.getById(Number(req.params.id));
      if (!certificado) {
        res.status(404).json({ mensagem: 'Certificado não encontrado' });
        return;
      }
      res.json(certificado);
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const certificado = await CertificateService.create(req.body);
      res.status(201).json({ mensagem: 'Certificado criado com sucesso', certificado });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const certificado = await CertificateService.update(Number(req.params.id), req.body);
      res.json({ mensagem: 'Certificado atualizado com sucesso', certificado });
    } catch (error: any) {
      res.status(400).json({ mensagem: error.message });
    }
  }

  static async remove(req: Request, res: Response): Promise<void> {
    try {
      await CertificateService.remove(Number(req.params.id));
      res.json({ mensagem: 'Certificado removido com sucesso' });
    } catch (error: any) {
      res.status(500).json({ mensagem: error.message });
    }
  }
} 