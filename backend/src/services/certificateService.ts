import { PrismaClient } from '@prisma/client';
import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

export interface CertificateRequest {
  evento_id: number;
  data_emissao: string;
}

export class CertificateService {
  static async generateCertificate(participanteId: number, eventoId: number, dataEmissao: Date, organizadorId: number) {
    // Verificar se o evento existe e pertence ao organizador
    const evento = await prisma.evento.findFirst({
      where: { 
        id: eventoId,
        organizador_id: organizadorId
      }
    });

    if (!evento) {
      throw new Error('Evento não encontrado ou você não tem permissão para gerar certificados');
    }

    // Verificar se existe inscrição
    const inscricao = await prisma.inscricao.findFirst({
      where: {
        evento_id: eventoId,
        usuario_id: participanteId
      }
    });

    if (!inscricao) {
      throw new Error('Participante não está inscrito neste evento');
    }

    // Verificar se já existe certificado
    const certificadoExistente = await prisma.certificado.findFirst({
      where: {
        inscricao_id: inscricao.id
      }
    });

    if (certificadoExistente) {
      throw new Error('Certificado já foi gerado para este participante');
    }

    // Gerar certificado
    return await prisma.certificado.create({
      data: {
        inscricao: {
          connect: { id: inscricao.id }
        },
        data_emissao: dataEmissao,
        url: null // Será gerado posteriormente
      },
      include: {
        inscricao: {
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
        }
      }
    });
  }

  private static async generateCertificateImage(participanteId: number, eventoId: number): Promise<string> {
    try {
      // Buscar dados do participante e evento
      const participante = await prisma.usuario.findUnique({
        where: { id: participanteId },
        select: { nome: true, email: true }
      });

      const evento = await prisma.evento.findUnique({
        where: { id: eventoId },
        select: { 
          nome: true, 
          data_inicio: true, 
          data_fim: true,
          organizador: {
            select: {
              nome: true,
              email: true
            }
          }
        }
      });

      if (!participante || !evento) {
        throw new Error('Dados do participante ou evento não encontrados');
      }

      // Criar canvas para o certificado
      const canvas = createCanvas(1200, 800);
      const ctx = canvas.getContext('2d');

      // Configurar fundo
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, 1200, 800);

      // Borda decorativa
      ctx.strokeStyle = '#007bff';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, 1160, 760);

      // Título
      ctx.fillStyle = '#007bff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('CERTIFICADO DE PARTICIPAÇÃO', 600, 120);

      // Texto do certificado
      ctx.fillStyle = '#333';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Certificamos que', 600, 200);

      // Nome do participante
      ctx.fillStyle = '#007bff';
      ctx.font = 'bold 36px Arial';
      ctx.fillText(participante.nome, 600, 260);

      // Texto de participação
      ctx.fillStyle = '#333';
      ctx.font = '24px Arial';
      ctx.fillText('participou do evento', 600, 320);

      // Nome do evento
      ctx.fillStyle = '#007bff';
      ctx.font = 'bold 32px Arial';
      ctx.fillText(evento.nome, 600, 380);

      // Data do evento
      const dataInicio = new Date(evento.data_inicio).toLocaleDateString('pt-BR');
      const dataFim = new Date(evento.data_fim).toLocaleDateString('pt-BR');
      ctx.fillStyle = '#666';
      ctx.font = '20px Arial';
      ctx.fillText(`Período: ${dataInicio} a ${dataFim}`, 600, 420);

      // Data de emissão
      const dataEmissao = new Date().toLocaleDateString('pt-BR');
      ctx.fillText(`Emitido em: ${dataEmissao}`, 600, 460);

      // Assinatura do organizador
      ctx.fillStyle = '#333';
      ctx.font = '20px Arial';
      ctx.fillText('Organizador:', 600, 520);
      ctx.fillStyle = '#007bff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(evento.organizador.nome, 600, 560);

      // Código do certificado
      const codigo = `${eventoId}-${participanteId}-${Date.now()}`;
      ctx.fillStyle = '#999';
      ctx.font = '16px Arial';
      ctx.fillText(`Código: ${codigo}`, 600, 720);

      // Salvar imagem
      const buffer = canvas.toBuffer('image/png');
      const fileName = `certificado_${eventoId}_${participanteId}_${Date.now()}.png`;
      const filePath = path.join(__dirname, '../public/certificados', fileName);
      
      // Criar diretório se não existir
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, buffer);

      return `/certificados/${fileName}`;
    } catch (error) {
      console.error('Erro ao gerar imagem do certificado:', error);
      throw new Error('Erro ao gerar certificado');
    }
  }

  static async getEventCertificates(eventoId: number, organizadorId: number) {
    // Verificar se o evento existe e pertence ao organizador
    const evento = await prisma.evento.findFirst({
      where: { 
        id: eventoId,
        organizador_id: organizadorId
      }
    });

    if (!evento) {
      throw new Error('Evento não encontrado ou você não tem permissão para visualizar certificados');
    }

    return await prisma.certificado.findMany({
      where: {
        inscricao: {
          evento_id: eventoId
        }
      },
      include: {
        inscricao: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true
              }
            },
            evento: {
              select: {
                id: true,
                nome: true,
                descricao: true
              }
            }
          }
        }
      },
      orderBy: {
        data_emissao: 'desc'
      }
    });
  }

  static async getParticipantCertificates(participanteId: number) {
    return await prisma.certificado.findMany({
      where: {
        inscricao: {
          usuario_id: participanteId
        }
      },
      include: {
        inscricao: {
          include: {
            evento: {
              select: {
                id: true,
                nome: true,
                descricao: true,
                data_inicio: true,
                data_fim: true
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
        }
      },
      orderBy: {
        data_emissao: 'desc'
      }
    });
  }

  static async getById(id: number) {
    return await prisma.certificado.findUnique({
      where: { id },
      include: {
        inscricao: {
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
        }
      }
    });
  }

  static async deleteCertificate(id: number) {
    const certificado = await prisma.certificado.findUnique({
      where: { id }
    });

    if (!certificado) {
      throw new Error('Certificado não encontrado');
    }

    await prisma.certificado.delete({
      where: { id }
    });

    return { mensagem: 'Certificado removido com sucesso' };
  }

  static async getAll() {
    return await prisma.certificado.findMany({
      include: {
        inscricao: {
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
        }
      },
      orderBy: {
        data_emissao: 'desc'
      }
    });
  }

  static async getByRegistrationId(inscricaoId: number) {
    return await prisma.certificado.findUnique({
      where: { inscricao_id: inscricaoId },
      include: {
        inscricao: {
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
        }
      }
    });
  }

  static async create(data: any) {
    return await prisma.certificado.create({
      data: {
        inscricao: {
          connect: { id: data.inscricao_id }
        },
        data_emissao: new Date(data.data_emissao),
        url: data.url
      },
      include: {
        inscricao: {
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
        }
      }
    });
  }

  static async update(id: number, data: any) {
    return await prisma.certificado.update({
      where: { id },
      data: {
        url: data.url
      },
      include: {
        inscricao: {
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
        }
      }
    });
  }

  static async remove(id: number) {
    const certificado = await prisma.certificado.findUnique({
      where: { id }
    });

    if (!certificado) {
      throw new Error('Certificado não encontrado');
    }

    await prisma.certificado.delete({
      where: { id }
    });

    return { mensagem: 'Certificado removido com sucesso' };
  }

  static async generateCertificatesForAllParticipants(eventoId: number, dataEmissao: Date, organizadorId: number) {
    // Verificar se o evento existe e pertence ao organizador
    const evento = await prisma.evento.findFirst({
      where: {
        id: eventoId,
        organizador_id: organizadorId
      }
    });
    if (!evento) {
      throw new Error('Evento não encontrado ou você não tem permissão para gerar certificados');
    }
    // Buscar todos os participantes inscritos
    const inscricoes = await prisma.inscricao.findMany({
      where: {
        evento_id: eventoId,
        status: { in: ['confirmada', 'pendente'] }
      }
    });
    if (!inscricoes.length) {
      throw new Error('Nenhum participante inscrito neste evento');
    }
    const certificadosGerados = [];
    for (const inscricao of inscricoes) {
      // Verificar se já existe certificado
      const certificadoExistente = await prisma.certificado.findFirst({
        where: { inscricao_id: inscricao.id }
      });
      if (!certificadoExistente) {
        const certificado = await prisma.certificado.create({
          data: {
            inscricao: {
              connect: { id: inscricao.id }
            },
            data_emissao: dataEmissao,
            url: null
          },
          include: {
            inscricao: {
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
            }
          }
        });
        certificadosGerados.push(certificado);
      }
    }
    return certificadosGerados;
  }
} 