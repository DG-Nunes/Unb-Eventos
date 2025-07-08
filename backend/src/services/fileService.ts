import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

const prisma = new PrismaClient();
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

export class FileService {
  private static uploadDir = path.join(__dirname, '../../uploads');

  static async uploadFile(data: any) {
    // Verificar se o evento existe
    const evento = await prisma.evento.findFirst({
      where: { 
        id: data.eventoId,
        organizador_id: data.organizadorId
      }
    });

    if (!evento) {
      throw new Error('Evento não encontrado ou você não tem permissão para fazer upload');
    }

    // Criar diretório de uploads se não existir
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const filename = `${timestamp}-${data.filename}`;
    const filePath = path.join(uploadDir, filename);

    // Salvar arquivo
    fs.writeFileSync(filePath, data.buffer);

    // Salvar informações no banco
    const fileData = {
      nome_arquivo: data.filename,
      url: `/uploads/${filename}`,
      size: data.size,
      type: data.type,
      evento_id: data.eventoId
    };

    const arquivo = await prisma.arquivo.create({
      data: fileData,
      include: {
        evento: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    return {
      id: arquivo.id,
      nome_arquivo: arquivo.nome_arquivo,
      url: arquivo.url,
      size: arquivo.size,
      type: arquivo.type
    };
  }

  static async getEventFiles(eventoId: number) {
    return await prisma.arquivo.findMany({
      where: { evento_id: eventoId },
      include: {
        evento: {
          select: {
            id: true,
            nome: true
          }
        }
      },
      orderBy: {
        criado_em: 'desc'
      }
    });
  }

  static async removeFile(arquivoId: number, organizadorId: number) {
    const arquivo = await prisma.arquivo.findFirst({
      where: { id: arquivoId },
      include: {
        evento: {
          select: {
            organizador_id: true
          }
        }
      }
    });

    if (!arquivo) {
      throw new Error('Arquivo não encontrado');
    }

    // Verificar se o usuário é organizador do evento
    if (arquivo.evento.organizador_id !== organizadorId) {
      throw new Error('Você não tem permissão para excluir este arquivo');
    }

    // Remover arquivo físico
    const filePath = path.join(__dirname, '../../uploads', path.basename(arquivo.url));
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remover registro do banco
    await prisma.arquivo.delete({
      where: { id: arquivoId }
    });

    return { mensagem: 'Arquivo removido com sucesso' };
  }

  static async getFileInfo(arquivoId: number) {
    const arquivo = await prisma.arquivo.findUnique({
      where: { id: arquivoId },
      include: {
        evento: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    });

    if (!arquivo) {
      throw new Error('Arquivo não encontrado');
    }

    return {
      id: arquivo.id,
      nome_arquivo: arquivo.nome_arquivo,
      url: arquivo.url,
      size: arquivo.size,
      type: arquivo.type,
      criado_em: arquivo.criado_em,
      evento: arquivo.evento
    };
  }

  static async downloadFile(arquivoId: number) {
    const arquivo = await prisma.arquivo.findUnique({
      where: { id: arquivoId }
    });

    if (!arquivo) {
      throw new Error('Arquivo não encontrado');
    }

    const filePath = path.join(__dirname, '../../uploads', path.basename(arquivo.url));
    if (!fs.existsSync(filePath)) {
      throw new Error('Arquivo físico não encontrado');
    }

    return {
      path: filePath,
      nome_arquivo: arquivo.nome_arquivo,
      size: arquivo.size,
      type: arquivo.type
    };
  }
} 