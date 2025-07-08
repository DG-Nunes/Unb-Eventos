import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateEventRequest {
  nome: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  local?: string;
  capacidade: number;
  bloco: string;
}

export interface EventFilters {
  pesquisa?: string;
  status?: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface PaginationParams {
  pagina?: number;
  tamanho?: number;
}

export interface PaginatedResponse<T> {
  pagina: number;
  tamanho: number;
  total_paginas: number;
  total: number;
  eventos: T[];
}

export class EventService {
  static async create(data: any) {
    const eventData = {
      nome: data.nome,
      descricao: data.descricao,
      data_inicio: new Date(data.data_inicio),
      data_fim: new Date(data.data_fim),
      local: data.local || 'Local não especificado',
      bloco: data.bloco,
      capacidade: data.capacidade || 100,
      status: 'ativo',
      organizador_id: data.organizador_id
    };

    return await prisma.evento.create({
      data: eventData,
      include: {
        organizador: {
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
    const eventos = await prisma.evento.findMany({
      include: {
        organizador: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: {
        data_inicio: 'desc'
      }
    });

    // Adicionar quantidade_inscritos para cada evento
    const eventosComInscritos = await Promise.all(
      eventos.map(async (evento) => {
        const quantidade_inscritos = await prisma.inscricao.count({
          where: {
            evento_id: evento.id,
            status: 'confirmada'
          }
        });
        return {
          ...evento,
          quantidade_inscritos
        };
      })
    );

    return eventosComInscritos;
  }

  static async getById(id: number) {
    const evento = await prisma.evento.findUnique({
      where: { id },
      include: {
        organizador: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        },
        atividades: true,
        inscricoes: {
          where: {
            status: 'confirmada'
          },
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!evento) {
      return null;
    }

    // Adicionar quantidade_inscritos
    const quantidade_inscritos = await prisma.inscricao.count({
      where: {
        evento_id: evento.id,
        status: 'confirmada'
      }
    });

    return {
      ...evento,
      quantidade_inscritos
    };
  }

  static async update(id: number, data: any) {
    const evento = await prisma.evento.findUnique({
      where: { id }
    });

    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    // Verificar se o evento já passou
    if (new Date(evento.data_inicio) <= new Date()) {
      throw new Error('Não é possível editar eventos que já passaram');
    }

    const updateData: any = {};
    if (data.nome) updateData.nome = data.nome;
    if (data.descricao) updateData.descricao = data.descricao;
    if (data.data_inicio) updateData.data_inicio = new Date(data.data_inicio);
    if (data.data_fim) updateData.data_fim = new Date(data.data_fim);
    if (data.local) updateData.local = data.local;
    if (data.bloco) updateData.bloco = data.bloco;
    if (data.capacidade) updateData.capacidade = data.capacidade;
    if (data.status) updateData.status = data.status;

    const eventoAtualizado = await prisma.evento.update({
      where: { id },
      data: updateData,
      include: {
        organizador: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    // Adicionar quantidade_inscritos
    const quantidade_inscritos = await prisma.inscricao.count({
      where: {
        evento_id: eventoAtualizado.id,
        status: 'confirmada'
      }
    });

    return {
      ...eventoAtualizado,
      quantidade_inscritos
    };
  }

  static async remove(id: number) {
    const evento = await prisma.evento.findUnique({
      where: { id }
    });

    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    // Verificar se o evento já passou
    if (new Date(evento.data_inicio) <= new Date()) {
      throw new Error('Não é possível excluir eventos que já passaram');
    }

    await prisma.evento.delete({
      where: { id }
    });

    return { mensagem: 'Evento removido com sucesso' };
  }

  static async getByOrganizer(organizadorId: number) {
    const eventos = await prisma.evento.findMany({
      where: { organizador_id: organizadorId },
      include: {
        organizador: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: {
        data_inicio: 'desc'
      }
    });

    // Adicionar quantidade_inscritos para cada evento
    const eventosComInscritos = await Promise.all(
      eventos.map(async (evento) => {
        const quantidade_inscritos = await prisma.inscricao.count({
          where: {
            evento_id: evento.id,
            status: 'confirmada'
          }
        });
        return {
          ...evento,
          quantidade_inscritos
        };
      })
    );

    return eventosComInscritos;
  }

  static async getEvents(filters: EventFilters = {}, pagination: PaginationParams = {}, usuarioId?: number, papelUsuario?: string): Promise<PaginatedResponse<any>> {
    const pagina = pagination.pagina || 1;
    const tamanho = pagination.tamanho || 10;
    const skip = (pagina - 1) * tamanho;

    const where: any = {};

    // Regra: Organizadores veem apenas seus eventos, participantes veem todos
    if (papelUsuario === 'organizador' && usuarioId) {
      where.organizador_id = usuarioId;
    }

    if (filters.pesquisa) {
      where.OR = [
        { nome: { contains: filters.pesquisa } },
        { descricao: { contains: filters.pesquisa } },
        { local: { contains: filters.pesquisa } }
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.data_inicio) {
      where.data_inicio = {
        gte: new Date(filters.data_inicio)
      };
    }

    if (filters.data_fim) {
      where.data_fim = {
        lte: new Date(filters.data_fim)
      };
    }

    const [eventos, total] = await Promise.all([
      prisma.evento.findMany({
        where,
        include: {
          organizador: {
            select: {
              id: true,
              nome: true,
              email: true
            }
          }
        },
        orderBy: {
          data_inicio: 'desc'
        },
        skip,
        take: tamanho
      }),
      prisma.evento.count({ where })
    ]);

    // Adicionar quantidade_inscritos para cada evento
    const eventosComInscritos = await Promise.all(
      eventos.map(async (evento) => {
        const quantidade_inscritos = await prisma.inscricao.count({
          where: {
            evento_id: evento.id,
            status: 'confirmada'
          }
        });
        return {
          ...evento,
          quantidade_inscritos
        };
      })
    );

    const total_paginas = Math.ceil(total / tamanho);

    return {
      pagina,
      tamanho,
      total_paginas,
      total,
      eventos: eventosComInscritos
    };
  }

  static async getOrganizerEvents(organizadorId: number, filters: EventFilters = {}, pagination: PaginationParams = {}): Promise<any[]> {
    const pagina = pagination.pagina || 1;
    const tamanho = pagination.tamanho || 10;
    const skip = (pagina - 1) * tamanho;

    const where: any = {
      organizador_id: organizadorId
    };

    if (filters.pesquisa) {
      where.OR = [
        { nome: { contains: filters.pesquisa } },
        { descricao: { contains: filters.pesquisa } },
        { local: { contains: filters.pesquisa } }
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const eventos = await prisma.evento.findMany({
      where,
      include: {
        organizador: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: {
        data_inicio: 'desc'
      },
      skip,
      take: tamanho
    });

    // Adicionar quantidade_inscritos para cada evento
    const eventosComInscritos = await Promise.all(
      eventos.map(async (evento) => {
        const quantidade_inscritos = await prisma.inscricao.count({
          where: {
            evento_id: evento.id,
            status: 'confirmada'
          }
        });
        return {
          ...evento,
          quantidade_inscritos
        };
      })
    );

    return eventosComInscritos;
  }

  static async updateEventStatus(id: number, status: string): Promise<any> {
    const evento = await prisma.evento.findUnique({
      where: { id }
    });

    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    const eventoAtualizado = await prisma.evento.update({
      where: { id },
      data: { status },
      include: {
        organizador: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    // Adicionar quantidade_inscritos
    const quantidade_inscritos = await prisma.inscricao.count({
      where: {
        evento_id: eventoAtualizado.id,
        status: 'confirmada'
      }
    });

    return {
      ...eventoAtualizado,
      quantidade_inscritos
    };
  }

  static async createViews(): Promise<void> {
    // Implementação de views se necessário
  }

  static async createProcedures(): Promise<void> {
    // Implementação de procedures se necessário
  }
} 