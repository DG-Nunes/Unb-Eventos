import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ActivityService {
  static async create(data: any) {
    // Verificar se o evento existe
    const evento = await prisma.evento.findFirst({
      where: { id: data.evento_id }
    });

    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    const activityData = {
      nome: data.nome,
      descricao: data.descricao,
      data_inicio: new Date(data.data_inicio),
      data_fim: new Date(data.data_fim),
      evento_id: data.evento_id
    };

    return await prisma.atividade.create({
      data: activityData,
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            descricao: true
          }
        }
      }
    });
  }

  static async update(id: number, data: any) {
    const atividade = await prisma.atividade.findUnique({
      where: { id }
    });

    if (!atividade) {
      throw new Error('Atividade não encontrada');
    }

    const updateData: any = {};
    if (data.nome) updateData.nome = data.nome;
    if (data.descricao) updateData.descricao = data.descricao;
    if (data.data_inicio) updateData.data_inicio = new Date(data.data_inicio);
    if (data.data_fim) updateData.data_fim = new Date(data.data_fim);

    return await prisma.atividade.update({
      where: { id },
      data: updateData,
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            descricao: true
          }
        }
      }
    });
  }

  static async remove(id: number) {
    const atividade = await prisma.atividade.findUnique({
      where: { id }
    });

    if (!atividade) {
      throw new Error('Atividade não encontrada');
    }

    await prisma.atividade.delete({
      where: { id }
    });

    return { mensagem: 'Atividade removida com sucesso' };
  }

  static async getById(id: number) {
    return await prisma.atividade.findUnique({
      where: { id },
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            descricao: true
          }
        }
      }
    });
  }

  static async getByEventId(eventoId: number) {
    return await prisma.atividade.findMany({
      where: { evento_id: eventoId },
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            descricao: true
          }
        }
      },
      orderBy: {
        data_inicio: 'asc'
      }
    });
  }

  static async getAll() {
    return await prisma.atividade.findMany({
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            descricao: true
          }
        }
      },
      orderBy: {
        data_inicio: 'desc'
      }
    });
  }
} 