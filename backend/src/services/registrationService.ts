import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface RegistrationRequest {
  usuario_id: number;
  evento_id: number;
}

export interface PaginationParams {
  pagina?: number;
  tamanho?: number;
}

export interface PaginatedResponse<T> {
  pagina: number;
  tamanho: number;
  total_paginas: number;
  eventos: T[];
}

export class RegistrationService {
  static async registerForEvent(eventoId: number, usuarioId: number) {
    // Verificar se o evento existe
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId }
    });

    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    // Verificar se o evento está ativo
    if (evento.status !== 'ativo') {
      throw new Error('Evento não está disponível para inscrições');
    }

    // Verificar se já existe inscrição
    const inscricaoExistente = await prisma.inscricao.findFirst({
      where: {
        evento_id: eventoId,
        usuario_id: usuarioId
      }
    });

    if (inscricaoExistente) {
      throw new Error('Você já está inscrito neste evento');
    }

    // Verificar capacidade do evento
    const inscricoesCount = await prisma.inscricao.count({
      where: { evento_id: eventoId }
    });

    if (inscricoesCount >= evento.capacidade) {
      throw new Error('Evento está lotado');
    }

    // Criar inscrição
    const inscricao = await prisma.inscricao.create({
      data: {
        evento_id: eventoId,
        usuario_id: usuarioId,
        status: 'confirmada'
      },
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            data_inicio: true
          }
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    return inscricao;
  }

  static async cancelRegistration(eventoId: number, usuarioId: number) {
    // Verificar se o evento existe
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId }
    });

    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    // Verificar se o evento está concluído
    if (evento.status === 'concluido') {
      throw new Error('Não é possível cancelar inscrição em evento já concluído');
    }

    // Verificar se existe inscrição
    const inscricao = await prisma.inscricao.findFirst({
      where: {
        evento_id: eventoId,
        usuario_id: usuarioId
      }
    });

    if (!inscricao) {
      throw new Error('Você não está inscrito neste evento');
    }

    // Cancelar inscrição
    await prisma.inscricao.delete({
      where: { id: inscricao.id }
    });

    return { mensagem: 'Inscrição cancelada com sucesso' };
  }

  static async getParticipantEvents(usuarioId: number, pagination: any = {}) {
    const { pagina = 1, tamanho = 10 } = pagination;
    const skip = (pagina - 1) * tamanho;

    const [inscricoes, total] = await Promise.all([
      prisma.inscricao.findMany({
        where: { usuario_id: usuarioId },
        skip,
        take: tamanho,
        include: {
          evento: {
            select: {
              id: true,
              nome: true,
              descricao: true,
              data_inicio: true,
              status: true,
              capacidade: true
            }
          }
        },
        orderBy: {
          criado_em: 'desc'
        }
      }),
      prisma.inscricao.count({
        where: { usuario_id: usuarioId }
      })
    ]);

    const totalPaginas = Math.ceil(total / tamanho);

    return {
      pagina,
      tamanho,
      total_paginas: totalPaginas,
      eventos: inscricoes.map(insc => ({
        id: insc.evento.id,
        nome: insc.evento.nome,
        descricao: insc.evento.descricao,
        data_inicio: insc.evento.data_inicio,
        status: insc.evento.status,
        capacidade: insc.evento.capacidade,
        inscricao_status: insc.status
      }))
    };
  }

  static async getEventRegistrations(eventoId: number) {
    const evento = await prisma.evento.findFirst({
      where: { id: eventoId }
    });

    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    return await prisma.inscricao.findMany({
      where: { evento_id: eventoId },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            matricula: true
          }
        }
      },
      orderBy: {
        criado_em: 'asc'
      }
    });
  }

  static async updateRegistrationStatus(eventoId: number, usuarioId: number, status: string) {
    const inscricao = await prisma.inscricao.findFirst({
      where: {
        evento_id: eventoId,
        usuario_id: usuarioId
      }
    });

    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    return await prisma.inscricao.update({
      where: { id: inscricao.id },
      data: { status },
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            data_inicio: true
          }
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });
  }

  static async getAll() {
    return await prisma.inscricao.findMany({
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            descricao: true
          }
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: {
        criado_em: 'desc'
      }
    });
  }

  static async getById(id: number) {
    return await prisma.inscricao.findUnique({
      where: { id },
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            descricao: true
          }
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });
  }

  static async getByEventId(eventoId: number) {
    return await prisma.inscricao.findMany({
      where: { evento_id: eventoId },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: {
        criado_em: 'asc'
      }
    });
  }

  static async getByUserId(usuarioId: number) {
    return await prisma.inscricao.findMany({
      where: { usuario_id: usuarioId },
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
        criado_em: 'desc'
      }
    });
  }

  static async create(data: any) {
    return await prisma.inscricao.create({
      data: {
        usuario_id: data.usuario_id,
        evento_id: data.evento_id,
        status: data.status || 'confirmada'
      },
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            descricao: true
          }
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });
  }

  static async update(id: number, data: any) {
    return await prisma.inscricao.update({
      where: { id },
      data: {
        status: data.status
      },
      include: {
        evento: {
          select: {
            id: true,
            nome: true,
            descricao: true
          }
        },
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });
  }

  static async remove(id: number) {
    const inscricao = await prisma.inscricao.findUnique({
      where: { id }
    });

    if (!inscricao) {
      throw new Error('Inscrição não encontrada');
    }

    await prisma.inscricao.delete({
      where: { id }
    });

    return { mensagem: 'Inscrição removida com sucesso' };
  }

  // Método que simula a procedure do banco de dados
  static async registerWithProcedure(usuarioId: number, eventoId: number) {
    // Verificar se o evento existe e obter dados
    const evento = await prisma.evento.findUnique({
      where: { id: eventoId }
    });

    if (!evento) {
      return { mensagem: 'Evento não encontrado' };
    }

    // Verificar se o evento está ativo
    if (evento.status !== 'ativo') {
      return { mensagem: 'Evento não está ativo' };
    }

    // Verificar se o evento já passou
    const agora = new Date();
    if (agora > evento.data_fim) {
      return { mensagem: 'Evento já passou' };
    }

    // Verificar se o usuário já está inscrito
    const inscricaoExistente = await prisma.inscricao.findFirst({
      where: {
        usuario_id: usuarioId,
        evento_id: eventoId
      }
    });

    if (inscricaoExistente) {
      return { mensagem: 'Usuário já está inscrito neste evento' };
    }

    // Contar inscritos confirmados
    const inscritosCount = await prisma.inscricao.count({
      where: {
        evento_id: eventoId,
        status: 'confirmada'
      }
    });

    // Verificar se há vagas
    if (inscritosCount >= evento.capacidade) {
      return { mensagem: 'Evento lotado' };
    }

    // Registrar inscrição
    const inscricao = await prisma.inscricao.create({
      data: {
        usuario_id: usuarioId,
        evento_id: eventoId,
        status: 'confirmada'
      }
    });

    return { mensagem: 'Inscrição realizada com sucesso', inscricao };
  }
} 