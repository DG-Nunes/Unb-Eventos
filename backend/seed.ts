import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.avaliacao.deleteMany();
  await prisma.certificado.deleteMany();
  await prisma.inscricao.deleteMany();
  await prisma.atividade.deleteMany();
  await prisma.arquivo.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.palestrante.deleteMany();
  await prisma.local.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();

  // Criar Usuários
  const senhaHash = await bcrypt.hash('123456', 10);
  
  const usuarios = await Promise.all([
    // Organizadores (Professores)
    prisma.usuario.create({
      data: {
        nome: 'João Silva',
        matricula: '2021001',
        email: 'joao.silva@unb.br',
        senha: senhaHash,
        papel: 'organizador'
      }
    }),
    prisma.usuario.create({
      data: {
        nome: 'Maria Santos',
        matricula: '2021002',
        email: 'maria.santos@unb.br',
        senha: senhaHash,
        papel: 'organizador'
      }
    }),
    prisma.usuario.create({
      data: {
        nome: 'Pedro Oliveira',
        matricula: '2021003',
        email: 'pedro.oliveira@unb.br',
        senha: senhaHash,
        papel: 'organizador'
      }
    }),
    prisma.usuario.create({
      data: {
        nome: 'Ana Costa',
        matricula: '2021004',
        email: 'ana.costa@unb.br',
        senha: senhaHash,
        papel: 'organizador'
      }
    }),
    prisma.usuario.create({
      data: {
        nome: 'Carlos Ferreira',
        matricula: '2021005',
        email: 'carlos.ferreira@unb.br',
        senha: senhaHash,
        papel: 'organizador'
      }
    }),
    // Participantes (Alunos)
    prisma.usuario.create({
      data: {
        nome: 'Lucas Almeida',
        matricula: '2022001',
        email: 'lucas.almeida@unb.br',
        senha: senhaHash,
        papel: 'participante'
      }
    }),
    prisma.usuario.create({
      data: {
        nome: 'Julia Rodrigues',
        matricula: '2022002',
        email: 'julia.rodrigues@unb.br',
        senha: senhaHash,
        papel: 'participante'
      }
    }),
    prisma.usuario.create({
      data: {
        nome: 'Gabriel Lima',
        matricula: '2022003',
        email: 'gabriel.lima@unb.br',
        senha: senhaHash,
        papel: 'participante'
      }
    }),
    prisma.usuario.create({
      data: {
        nome: 'Fernanda Martins',
        matricula: '2022004',
        email: 'fernanda.martins@unb.br',
        senha: senhaHash,
        papel: 'participante'
      }
    }),
    prisma.usuario.create({
      data: {
        nome: 'Rafael Souza',
        matricula: '2022005',
        email: 'rafael.souza@unb.br',
        senha: senhaHash,
        papel: 'participante'
      }
    }),
    // Usuários sem matrícula (opcional)
    prisma.usuario.create({
      data: {
        nome: 'Visitante Silva',
        matricula: 'VIS001',
        email: 'visitante.silva@email.com',
        senha: senhaHash,
        papel: 'participante'
      }
    }),
    prisma.usuario.create({
      data: {
        nome: 'Convidado Santos',
        matricula: 'VIS002',
        email: 'convidado.santos@email.com',
        senha: senhaHash,
        papel: 'participante'
      }
    })
  ]);

  // Criar Eventos
  const eventos = await Promise.all([
    prisma.evento.create({
      data: {
        nome: 'Workshop de Programação Python',
        descricao: 'Aprenda Python do básico ao avançado em um workshop prático',
        data_inicio: new Date('2024-12-20T09:00:00Z'),
        data_fim: new Date('2024-12-20T17:00:00Z'),
        local: 'Sala ICC 101',
        bloco: 'ICC',
        capacidade: 30,
        status: 'ativo',
        organizador_id: usuarios[0].id
      }
    }),
    prisma.evento.create({
      data: {
        nome: 'Palestra: Inteligência Artificial',
        descricao: 'Conceitos fundamentais de IA e machine learning',
        data_inicio: new Date('2024-12-25T14:00:00Z'),
        data_fim: new Date('2024-12-25T16:00:00Z'),
        local: 'Auditório PAT',
        bloco: 'PAT',
        capacidade: 100,
        status: 'ativo',
        organizador_id: usuarios[1].id
      }
    }),
    prisma.evento.create({
      data: {
        nome: 'Seminário de Matemática Aplicada',
        descricao: 'Discussão sobre aplicações da matemática em problemas reais',
        data_inicio: new Date('2024-12-30T10:00:00Z'),
        data_fim: new Date('2024-12-30T12:00:00Z'),
        local: 'Sala FGA 205',
        bloco: 'FGA',
        capacidade: 50,
        status: 'ativo',
        organizador_id: usuarios[2].id
      }
    }),
    prisma.evento.create({
      data: {
        nome: 'Minicurso de Desenvolvimento Web',
        descricao: 'Crie aplicações web modernas com React e Node.js',
        data_inicio: new Date('2025-01-05T08:00:00Z'),
        data_fim: new Date('2025-01-05T18:00:00Z'),
        local: 'Laboratório ICC 203',
        bloco: 'ICC',
        capacidade: 25,
        status: 'ativo',
        organizador_id: usuarios[3].id
      }
    }),
    prisma.evento.create({
      data: {
        nome: 'Conferência de Engenharia de Software',
        descricao: 'Melhores práticas e tendências em desenvolvimento de software',
        data_inicio: new Date('2025-01-10T09:00:00Z'),
        data_fim: new Date('2025-01-10T17:00:00Z'),
        local: 'Auditório Principal',
        bloco: 'PAT',
        capacidade: 150,
        status: 'ativo',
        organizador_id: usuarios[4].id
      }
    })
  ]);

  // Criar Categorias
  const categorias = await Promise.all([
    prisma.categoria.create({
      data: {
        nome: 'Tecnologia',
        descricao: 'Eventos relacionados à tecnologia e inovação',
        cor: '#3B82F6'
      }
    }),
    prisma.categoria.create({
      data: {
        nome: 'Ciências',
        descricao: 'Eventos científicos e acadêmicos',
        cor: '#10B981'
      }
    }),
    prisma.categoria.create({
      data: {
        nome: 'Humanidades',
        descricao: 'Eventos de humanidades e ciências sociais',
        cor: '#F59E0B'
      }
    }),
    prisma.categoria.create({
      data: {
        nome: 'Engenharia',
        descricao: 'Eventos de engenharia e aplicações',
        cor: '#EF4444'
      }
    }),
    prisma.categoria.create({
      data: {
        nome: 'Educação',
        descricao: 'Eventos educacionais e de capacitação',
        cor: '#8B5CF6'
      }
    })
  ]);

  // Criar Locais
  const locais = await Promise.all([
    prisma.local.create({
      data: {
        nome: 'Auditório Principal',
        bloco: 'PAT',
        capacidade: 200,
        tipo: 'auditorio'
      }
    }),
    prisma.local.create({
      data: {
        nome: 'Sala ICC 101',
        bloco: 'ICC',
        capacidade: 50,
        tipo: 'sala'
      }
    }),
    prisma.local.create({
      data: {
        nome: 'Laboratório FGA 203',
        bloco: 'FGA',
        capacidade: 30,
        tipo: 'laboratorio'
      }
    }),
    prisma.local.create({
      data: {
        nome: 'Anfiteatro 9',
        bloco: 'ICC',
        capacidade: 150,
        tipo: 'anfiteatro'
      }
    }),
    prisma.local.create({
      data: {
        nome: 'Sala de Conferências',
        bloco: 'PAT',
        capacidade: 80,
        tipo: 'sala'
      }
    })
  ]);

  // Criar Palestrantes
  const palestrantes = await Promise.all([
    prisma.palestrante.create({
      data: {
        nome: 'Dr. Carlos Mendes',
        email: 'carlos.mendes@unb.br',
        biografia: 'Professor de Ciência da Computação com 15 anos de experiência',
        especialidade: 'Inteligência Artificial'
      }
    }),
    prisma.palestrante.create({
      data: {
        nome: 'Dra. Ana Paula Silva',
        email: 'ana.silva@unb.br',
        biografia: 'Pesquisadora em Engenharia de Software',
        especialidade: 'Desenvolvimento Web'
      }
    }),
    prisma.palestrante.create({
      data: {
        nome: 'Prof. Roberto Santos',
        email: 'roberto.santos@unb.br',
        biografia: 'Professor de Matemática Aplicada',
        especialidade: 'Cálculo Numérico'
      }
    }),
    prisma.palestrante.create({
      data: {
        nome: 'Dra. Fernanda Costa',
        email: 'fernanda.costa@unb.br',
        biografia: 'Especialista em Machine Learning',
        especialidade: 'Data Science'
      }
    }),
    prisma.palestrante.create({
      data: {
        nome: 'Prof. Marcos Oliveira',
        email: 'marcos.oliveira@unb.br',
        biografia: 'Professor de Engenharia de Software',
        especialidade: 'Arquitetura de Software'
      }
    })
  ]);

  // Criar Atividades
  const atividades = await Promise.all([
    prisma.atividade.create({
      data: {
        nome: 'Introdução ao Python',
        descricao: 'Conceitos básicos da linguagem Python',
        data_inicio: new Date('2024-12-20T09:00:00Z'),
        data_fim: new Date('2024-12-20T11:00:00Z'),
        evento_id: eventos[0].id
      }
    }),
    prisma.atividade.create({
      data: {
        nome: 'Estruturas de Dados',
        descricao: 'Implementação de estruturas de dados em Python',
        data_inicio: new Date('2024-12-20T13:00:00Z'),
        data_fim: new Date('2024-12-20T15:00:00Z'),
        evento_id: eventos[0].id
      }
    }),
    prisma.atividade.create({
      data: {
        nome: 'Fundamentos de IA',
        descricao: 'Conceitos básicos de inteligência artificial',
        data_inicio: new Date('2024-12-25T14:00:00Z'),
        data_fim: new Date('2024-12-25T15:00:00Z'),
        evento_id: eventos[1].id
      }
    }),
    prisma.atividade.create({
      data: {
        nome: 'Machine Learning',
        descricao: 'Introdução ao machine learning',
        data_inicio: new Date('2024-12-25T15:00:00Z'),
        data_fim: new Date('2024-12-25T16:00:00Z'),
        evento_id: eventos[1].id
      }
    }),
    prisma.atividade.create({
      data: {
        nome: 'Cálculo Numérico',
        descricao: 'Métodos numéricos aplicados',
        data_inicio: new Date('2024-12-30T10:00:00Z'),
        data_fim: new Date('2024-12-30T12:00:00Z'),
        evento_id: eventos[2].id
      }
    })
  ]);

  // Criar Inscrições
  const inscricoes = await Promise.all([
    prisma.inscricao.create({
      data: {
        usuario_id: usuarios[5].id,
        evento_id: eventos[0].id,
        status: 'confirmada'
      }
    }),
    prisma.inscricao.create({
      data: {
        usuario_id: usuarios[6].id,
        evento_id: eventos[0].id,
        status: 'confirmada'
      }
    }),
    prisma.inscricao.create({
      data: {
        usuario_id: usuarios[7].id,
        evento_id: eventos[1].id,
        status: 'confirmada'
      }
    }),
    prisma.inscricao.create({
      data: {
        usuario_id: usuarios[8].id,
        evento_id: eventos[1].id,
        status: 'confirmada'
      }
    }),
    prisma.inscricao.create({
      data: {
        usuario_id: usuarios[9].id,
        evento_id: eventos[2].id,
        status: 'confirmada'
      }
    })
  ]);

  // Criar Arquivos
  const arquivos = await Promise.all([
    prisma.arquivo.create({
      data: {
        nome_arquivo: 'apresentacao_python.pdf',
        url: '/uploads/apresentacao_python.pdf',
        size: 1024000,
        type: 'application/pdf',
        evento_id: eventos[0].id
      }
    }),
    prisma.arquivo.create({
      data: {
        nome_arquivo: 'material_ia.pdf',
        url: '/uploads/material_ia.pdf',
        size: 2048000,
        type: 'application/pdf',
        evento_id: eventos[1].id
      }
    }),
    prisma.arquivo.create({
      data: {
        nome_arquivo: 'slides_matematica.pdf',
        url: '/uploads/slides_matematica.pdf',
        size: 1536000,
        type: 'application/pdf',
        evento_id: eventos[2].id
      }
    }),
    prisma.arquivo.create({
      data: {
        nome_arquivo: 'codigo_exemplo.zip',
        url: '/uploads/codigo_exemplo.zip',
        size: 512000,
        type: 'application/zip',
        evento_id: eventos[3].id
      }
    }),
    prisma.arquivo.create({
      data: {
        nome_arquivo: 'documentacao_software.pdf',
        url: '/uploads/documentacao_software.pdf',
        size: 3072000,
        type: 'application/pdf',
        evento_id: eventos[4].id
      }
    })
  ]);

  // Criar Certificados
  const certificados = await Promise.all([
    prisma.certificado.create({
      data: {
        inscricao_id: inscricoes[0].id,
        url: '/certificados/certificado_1_1.png'
      }
    }),
    prisma.certificado.create({
      data: {
        inscricao_id: inscricoes[1].id,
        url: '/certificados/certificado_1_2.png'
      }
    }),
    prisma.certificado.create({
      data: {
        inscricao_id: inscricoes[2].id,
        url: '/certificados/certificado_2_3.png'
      }
    }),
    prisma.certificado.create({
      data: {
        inscricao_id: inscricoes[3].id,
        url: '/certificados/certificado_2_4.png'
      }
    }),
    prisma.certificado.create({
      data: {
        inscricao_id: inscricoes[4].id,
        url: '/certificados/certificado_3_5.png'
      }
    })
  ]);

  // Criar Avaliações
  const avaliacoes = await Promise.all([
    prisma.avaliacao.create({
      data: {
        nota: 5,
        comentario: 'Excelente workshop, muito prático!',
        usuario_id: usuarios[5].id,
        evento_id: eventos[0].id
      }
    }),
    prisma.avaliacao.create({
      data: {
        nota: 4,
        comentario: 'Palestra muito informativa sobre IA',
        usuario_id: usuarios[6].id,
        evento_id: eventos[1].id
      }
    }),
    prisma.avaliacao.create({
      data: {
        nota: 5,
        comentario: 'Conteúdo de alta qualidade',
        usuario_id: usuarios[7].id,
        evento_id: eventos[2].id
      }
    }),
    prisma.avaliacao.create({
      data: {
        nota: 4,
        comentario: 'Minicurso muito bem estruturado',
        usuario_id: usuarios[8].id,
        evento_id: eventos[3].id
      }
    }),
    prisma.avaliacao.create({
      data: {
        nota: 5,
        comentario: 'Conferência excepcional!',
        usuario_id: usuarios[9].id,
        evento_id: eventos[4].id
      }
    })
  ]);

  console.log('✅ Seed concluído com sucesso!');
  console.log(`📊 Estatísticas:`);
  console.log(`   - ${usuarios.length} usuários`);
  console.log(`   - ${eventos.length} eventos`);
  console.log(`   - ${categorias.length} categorias`);
  console.log(`   - ${locais.length} locais`);
  console.log(`   - ${palestrantes.length} palestrantes`);
  console.log(`   - ${atividades.length} atividades`);
  console.log(`   - ${inscricoes.length} inscrições`);
  console.log(`   - ${arquivos.length} arquivos`);
  console.log(`   - ${certificados.length} certificados`);
  console.log(`   - ${avaliacoes.length} avaliações`);
  console.log('');
  console.log('🔑 Contas para teste:');
  console.log('   Organizador: joao.silva@unb.br / 123456');
  console.log('   Participante: lucas.almeida@unb.br / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 