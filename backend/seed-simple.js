const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar banco de dados
  await prisma.certificado.deleteMany();
  await prisma.inscricao.deleteMany();
  await prisma.atividade.deleteMany();
  await prisma.arquivo.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.usuario.deleteMany();

  // 1. Criar Usuários
  console.log('👥 Criando usuários...');
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const users = await Promise.all([
    prisma.usuario.create({
      data: {
        nome: 'Administrador',
        email: 'admin@unb.br',
        senha: hashedPassword,
        matricula: '202300001',
        papel: 'admin'
      }
    }),
    prisma.usuario.create({
      data: {
        nome: 'João Silva',
        email: 'joao.silva@unb.br',
        senha: hashedPassword,
        matricula: '202300002',
        papel: 'organizador'
      }
    }),
    prisma.usuario.create({
      data: {
        nome: 'Maria Santos',
        email: 'maria.santos@unb.br',
        senha: hashedPassword,
        matricula: '202300003',
        papel: 'organizador'
      }
    }),
    prisma.usuario.create({
      data: {
        nome: 'Pedro Costa',
        email: 'pedro.costa@unb.br',
        senha: hashedPassword,
        matricula: '202300004',
        papel: 'participante'
      }
    }),
    prisma.usuario.create({
      data: {
        nome: 'Ana Oliveira',
        email: 'ana.oliveira@unb.br',
        senha: hashedPassword,
        matricula: '202300005',
        papel: 'participante'
      }
    })
  ]);

  // 2. Criar Eventos
  console.log('🎉 Criando eventos...');
  const events = await Promise.all([
    prisma.evento.create({
      data: {
        nome: 'Semana de Computação',
        descricao: 'Evento anual do departamento de computação',
        data_inicio: new Date('2024-07-15T09:00:00Z'),
        data_fim: new Date('2024-07-19T18:00:00Z'),
        local: 'Auditório da Reitoria',
        bloco: 'ICC',
        capacidade: 150,
        status: 'ativo',
        organizador_id: users[1].id
      }
    }),
    prisma.evento.create({
      data: {
        nome: 'Workshop de Programação',
        descricao: 'Workshop prático de programação',
        data_inicio: new Date('2024-07-20T14:00:00Z'),
        data_fim: new Date('2024-07-20T18:00:00Z'),
        local: 'Laboratório de Informática',
        bloco: 'ICC',
        capacidade: 30,
        status: 'ativo',
        organizador_id: users[2].id
      }
    }),
    prisma.evento.create({
      data: {
        nome: 'Maratona de Programação',
        descricao: 'Competição de programação',
        data_inicio: new Date('2024-08-10T08:00:00Z'),
        data_fim: new Date('2024-08-10T18:00:00Z'),
        local: 'Sala de Conferências CIC',
        bloco: 'CIC',
        capacidade: 50,
        status: 'ativo',
        organizador_id: users[1].id
      }
    }),
    prisma.evento.create({
      data: {
        nome: 'Seminário de Matemática',
        descricao: 'Seminário sobre matemática aplicada',
        data_inicio: new Date('2024-08-25T10:00:00Z'),
        data_fim: new Date('2024-08-25T13:00:00Z'),
        local: 'Anfiteatro 9',
        bloco: 'ICC',
        capacidade: 80,
        status: 'ativo',
        organizador_id: users[2].id
      }
    }),
    prisma.evento.create({
      data: {
        nome: 'Conferência de Física',
        descricao: 'Conferência sobre física quântica',
        data_inicio: new Date('2024-09-05T14:00:00Z'),
        data_fim: new Date('2024-09-05T20:00:00Z'),
        local: 'Auditório da Reitoria',
        bloco: 'ICC',
        capacidade: 120,
        status: 'ativo',
        organizador_id: users[1].id
      }
    })
  ]);

  // 3. Criar Atividades
  console.log('📋 Criando atividades...');
  await Promise.all([
    prisma.atividade.create({
      data: {
        nome: 'Palestra de Abertura',
        descricao: 'Palestra de abertura da semana de computação',
        data_inicio: new Date('2024-07-15T09:00:00Z'),
        data_fim: new Date('2024-07-15T10:30:00Z'),
        evento_id: events[0].id
      }
    }),
    prisma.atividade.create({
      data: {
        nome: 'Workshop Prático',
        descricao: 'Workshop prático de desenvolvimento',
        data_inicio: new Date('2024-07-15T11:00:00Z'),
        data_fim: new Date('2024-07-15T13:00:00Z'),
        evento_id: events[0].id
      }
    }),
    prisma.atividade.create({
      data: {
        nome: 'Introdução à Programação',
        descricao: 'Aula introdutória de programação',
        data_inicio: new Date('2024-07-20T14:00:00Z'),
        data_fim: new Date('2024-07-20T16:00:00Z'),
        evento_id: events[1].id
      }
    }),
    prisma.atividade.create({
      data: {
        nome: 'Prática de Algoritmos',
        descricao: 'Prática de resolução de problemas',
        data_inicio: new Date('2024-07-20T16:30:00Z'),
        data_fim: new Date('2024-07-20T18:00:00Z'),
        evento_id: events[1].id
      }
    }),
    prisma.atividade.create({
      data: {
        nome: 'Competição Individual',
        descricao: 'Fase individual da maratona',
        data_inicio: new Date('2024-08-10T08:00:00Z'),
        data_fim: new Date('2024-08-10T11:00:00Z'),
        evento_id: events[2].id
      }
    })
  ]);

  // 4. Criar Inscrições
  console.log('📝 Criando inscrições...');
  await Promise.all([
    prisma.inscricao.create({
      data: {
        status: 'confirmada',
        usuario_id: users[3].id,
        evento_id: events[0].id
      }
    }),
    prisma.inscricao.create({
      data: {
        status: 'confirmada',
        usuario_id: users[4].id,
        evento_id: events[0].id
      }
    }),
    prisma.inscricao.create({
      data: {
        status: 'pendente',
        usuario_id: users[3].id,
        evento_id: events[1].id
      }
    }),
    prisma.inscricao.create({
      data: {
        status: 'confirmada',
        usuario_id: users[4].id,
        evento_id: events[1].id
      }
    }),
    prisma.inscricao.create({
      data: {
        status: 'confirmada',
        usuario_id: users[3].id,
        evento_id: events[2].id
      }
    })
  ]);

  // 5. Criar Arquivos
  console.log('📁 Criando arquivos...');
  await Promise.all([
    prisma.arquivo.create({
      data: {
        nome_arquivo: 'programa_semana_computacao.pdf',
        url: '/uploads/programa_semana_computacao.pdf',
        size: 1024000,
        type: 'application/pdf',
        evento_id: events[0].id
      }
    }),
    prisma.arquivo.create({
      data: {
        nome_arquivo: 'material_workshop.pdf',
        url: '/uploads/material_workshop.pdf',
        size: 2048000,
        type: 'application/pdf',
        evento_id: events[1].id
      }
    }),
    prisma.arquivo.create({
      data: {
        nome_arquivo: 'regulamento_maratona.pdf',
        url: '/uploads/regulamento_maratona.pdf',
        size: 512000,
        type: 'application/pdf',
        evento_id: events[2].id
      }
    }),
    prisma.arquivo.create({
      data: {
        nome_arquivo: 'apresentacao_seminario.pdf',
        url: '/uploads/apresentacao_seminario.pdf',
        size: 1536000,
        type: 'application/pdf',
        evento_id: events[3].id
      }
    }),
    prisma.arquivo.create({
      data: {
        nome_arquivo: 'certificado_participante.pdf',
        url: '/uploads/certificado_participante.pdf',
        size: 768000,
        type: 'application/pdf',
        evento_id: events[0].id
      }
    })
  ]);

  // 6. Criar Certificados
  console.log('🎓 Criando certificados...');
  await Promise.all([
    prisma.certificado.create({
      data: {
        inscricao_id: 1, // Pedro Costa na Semana de Computação
        data_emissao: new Date('2024-07-19T18:00:00Z'),
        url: '/certificados/certificado_1_1.pdf'
      }
    }),
    prisma.certificado.create({
      data: {
        inscricao_id: 2, // Ana Oliveira na Semana de Computação
        data_emissao: new Date('2024-07-19T18:00:00Z'),
        url: '/certificados/certificado_1_2.pdf'
      }
    }),
    prisma.certificado.create({
      data: {
        inscricao_id: 4, // Ana Oliveira no Workshop de Programação
        data_emissao: new Date('2024-07-20T18:00:00Z'),
        url: '/certificados/certificado_2_2.pdf'
      }
    }),
    prisma.certificado.create({
      data: {
        inscricao_id: 5, // Pedro Costa na Maratona de Programação
        data_emissao: new Date('2024-08-10T18:00:00Z'),
        url: '/certificados/certificado_3_1.pdf'
      }
    }),
    prisma.certificado.create({
      data: {
        inscricao_id: 3, // Pedro Costa no Workshop de Programação (pendente)
        data_emissao: new Date('2024-07-20T18:00:00Z'),
        url: '/certificados/certificado_2_1.pdf'
      }
    })
  ]);

  console.log('✅ Seed concluído com sucesso!');
  console.log(`📊 Dados criados:`);
  console.log(`   - ${users.length} usuários`);
  console.log(`   - ${events.length} eventos`);
  console.log(`   - 5 atividades`);
  console.log(`   - 5 inscrições`);
  console.log(`   - 5 arquivos`);
  console.log(`   - 5 certificados`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 