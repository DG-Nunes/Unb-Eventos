const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar banco de dados (ordem correta para evitar violação de FK)
  await prisma.certificado.deleteMany();
  await prisma.avaliacao.deleteMany();
  await prisma.inscricao.deleteMany();
  await prisma.atividade.deleteMany();
  await prisma.arquivo.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.palestrante.deleteMany();
  await prisma.local.deleteMany();
  await prisma.categoria.deleteMany();
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

  // 1. Criar Categorias
  console.log('🏷️ Criando categorias...');
  const categorias = await Promise.all([
    prisma.categoria.create({ data: { nome: 'Tecnologia', descricao: 'Eventos de tecnologia', cor: '#1E90FF' } }),
    prisma.categoria.create({ data: { nome: 'Ciências', descricao: 'Eventos de ciências', cor: '#32CD32' } }),
    prisma.categoria.create({ data: { nome: 'Matemática', descricao: 'Eventos de matemática', cor: '#FFD700' } }),
    prisma.categoria.create({ data: { nome: 'Engenharia', descricao: 'Eventos de engenharia', cor: '#FF4500' } }),
    prisma.categoria.create({ data: { nome: 'Educação', descricao: 'Eventos de educação', cor: '#8A2BE2' } })
  ]);

  // 2. Criar Locais
  console.log('🏛️ Criando locais...');
  const locais = await Promise.all([
    prisma.local.create({ data: { nome: 'Auditório Central', bloco: 'ICC', capacidade: 200, tipo: 'auditorio' } }),
    prisma.local.create({ data: { nome: 'Sala 101', bloco: 'PAT', capacidade: 40, tipo: 'sala' } }),
    prisma.local.create({ data: { nome: 'Lab. Computação', bloco: 'ICC', capacidade: 30, tipo: 'laboratorio' } }),
    prisma.local.create({ data: { nome: 'Anfiteatro 9', bloco: 'ICC', capacidade: 80, tipo: 'anfiteatro' } }),
    prisma.local.create({ data: { nome: 'Sala 205', bloco: 'FGA', capacidade: 50, tipo: 'sala' } })
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
        organizador_id: users[1].id,
        categoria_id: categorias[0].id,
        local_id: locais[0].id
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
        organizador_id: users[2].id,
        categoria_id: categorias[0].id,
        local_id: locais[2].id
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
        organizador_id: users[1].id,
        categoria_id: categorias[0].id,
        local_id: locais[2].id
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
        organizador_id: users[2].id,
        categoria_id: categorias[2].id,
        local_id: locais[3].id
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
        organizador_id: users[1].id,
        categoria_id: categorias[1].id,
        local_id: locais[0].id
      }
    })
  ]);

  // 3. Criar Atividades
  console.log('📋 Criando atividades...');
  const atividades = await Promise.all([
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

  // 6. Criar Palestrantes
  console.log('🎤 Criando palestrantes...');
  const palestrantes = await Promise.all([
    prisma.palestrante.create({ data: { nome: 'Dr. Alice Borges', email: 'alice.borges@unb.br', biografia: 'Especialista em IA', especialidade: 'Inteligência Artificial' } }),
    prisma.palestrante.create({ data: { nome: 'Prof. Bruno Lima', email: 'bruno.lima@unb.br', biografia: 'Doutor em Matemática', especialidade: 'Matemática' } }),
    prisma.palestrante.create({ data: { nome: 'Dra. Carla Souza', email: 'carla.souza@unb.br', biografia: 'Engenharia de Software', especialidade: 'Engenharia de Software' } }),
    prisma.palestrante.create({ data: { nome: 'Prof. Daniel Rocha', email: 'daniel.rocha@unb.br', biografia: 'Física Quântica', especialidade: 'Física' } }),
    prisma.palestrante.create({ data: { nome: 'Dr. Eduardo Martins', email: 'eduardo.martins@unb.br', biografia: 'Banco de Dados', especialidade: 'Banco de Dados' } })
  ]);

  // Relacionar palestrantes a atividades (exemplo)
  await prisma.atividade.update({ where: { id: atividades[0].id }, data: { palestrantes: { connect: [{ id: palestrantes[0].id }] } } });
  await prisma.atividade.update({ where: { id: atividades[1].id }, data: { palestrantes: { connect: [{ id: palestrantes[1].id }] } } });
  await prisma.atividade.update({ where: { id: atividades[2].id }, data: { palestrantes: { connect: [{ id: palestrantes[2].id }] } } });
  await prisma.atividade.update({ where: { id: atividades[3].id }, data: { palestrantes: { connect: [{ id: palestrantes[3].id }] } } });
  await prisma.atividade.update({ where: { id: atividades[4].id }, data: { palestrantes: { connect: [{ id: palestrantes[4].id }] } } });

  // 4. Criar Inscrições
  console.log('📝 Criando inscrições...');
  const inscricoes = await Promise.all([
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
        inscricao_id: inscricoes[0].id, // Pedro Costa na Semana de Computação
        data_emissao: new Date('2024-07-19T18:00:00Z'),
        url: '/certificados/certificado_1_1.pdf'
      }
    }),
    prisma.certificado.create({
      data: {
        inscricao_id: inscricoes[1].id, // Ana Oliveira na Semana de Computação
        data_emissao: new Date('2024-07-19T18:00:00Z'),
        url: '/certificados/certificado_1_2.pdf'
      }
    }),
    prisma.certificado.create({
      data: {
        inscricao_id: inscricoes[3].id, // Ana Oliveira no Workshop de Programação
        data_emissao: new Date('2024-07-20T18:00:00Z'),
        url: '/certificados/certificado_2_2.pdf'
      }
    }),
    prisma.certificado.create({
      data: {
        inscricao_id: inscricoes[4].id, // Pedro Costa na Maratona de Programação
        data_emissao: new Date('2024-08-10T18:00:00Z'),
        url: '/certificados/certificado_3_1.pdf'
      }
    }),
    prisma.certificado.create({
      data: {
        inscricao_id: inscricoes[2].id, // Pedro Costa no Workshop de Programação (pendente)
        data_emissao: new Date('2024-07-20T18:00:00Z'),
        url: '/certificados/certificado_2_1.pdf'
      }
    })
  ]);

  // 7. Criar Avaliações
  console.log('⭐ Criando avaliações...');
  await Promise.all([
    prisma.avaliacao.create({ data: { nota: 5, comentario: 'Excelente evento!', usuario_id: users[3].id, evento_id: events[0].id } }),
    prisma.avaliacao.create({ data: { nota: 4, comentario: 'Muito bom!', usuario_id: users[4].id, evento_id: events[0].id } }),
    prisma.avaliacao.create({ data: { nota: 3, comentario: 'Bom, mas pode melhorar.', usuario_id: users[3].id, evento_id: events[1].id } }),
    prisma.avaliacao.create({ data: { nota: 5, comentario: 'Aprendi muito!', usuario_id: users[4].id, evento_id: events[1].id } }),
    prisma.avaliacao.create({ data: { nota: 2, comentario: 'Organização ruim.', usuario_id: users[3].id, evento_id: events[2].id } })
  ]);

  console.log('✅ Seed concluído com sucesso!');
  console.log('📊 Dados criados:');
  console.log(`   - ${users.length} usuários`);
  console.log(`   - ${categorias.length} categorias`);
  console.log(`   - ${locais.length} locais`);
  console.log(`   - ${events.length} eventos`);
  console.log('   - 5 atividades');
  console.log('   - 5 inscrições');
  console.log('   - 5 arquivos');
  console.log('   - 5 certificados');
  console.log(`   - ${palestrantes.length} palestrantes`);
  console.log('   - 5 avaliações');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });