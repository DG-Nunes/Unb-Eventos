import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuthService {
  static async login(email: string, senha: string) {
    const emailPadronizado = email.trim().toLowerCase();
    const usuario = await prisma.usuario.findUnique({
      where: { email: emailPadronizado }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error('Senha incorreta');
    }

    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email, 
        papel: usuario.papel,
        matricula: usuario.matricula
      },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    return {
      access_token: token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        papel: usuario.papel,
        matricula: usuario.matricula
      }
    };
  }

  static async register(dadosUsuario: any) {
    let { email, senha, nome, matricula, papel } = dadosUsuario;
    email = email.trim().toLowerCase();

    // Verificar se o email já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      throw new Error('Email já cadastrado');
    }

    // Verificar se a matrícula foi fornecida
    if (!matricula || matricula.trim() === '') {
      throw new Error('Matrícula é obrigatória');
    }

    // Verificar se a matrícula já existe
    const matriculaExistente = await prisma.usuario.findUnique({
      where: { matricula }
    });

    if (matriculaExistente) {
      throw new Error('Matrícula já cadastrada');
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criar usuário
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        matricula: matricula,
        papel: papel || 'participante'
      }
    });

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
      matricula: usuario.matricula
    };
  }

  static async getProfile(usuarioId: number) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
      matricula: usuario.matricula
    };
  }

  static async updateProfile(usuarioId: number, dadosAtualizacao: any) {
    const { nome, email, senha } = dadosAtualizacao;

    // Verificar se o email já existe (se estiver sendo alterado)
    if (email) {
      const usuarioExistente = await prisma.usuario.findFirst({
        where: {
          email,
          id: { not: usuarioId }
        }
      });

      if (usuarioExistente) {
        throw new Error('Email já cadastrado');
      }
    }

    const camposAtualizacao: any = {};
    if (nome) camposAtualizacao.nome = nome;
    if (email) camposAtualizacao.email = email;
    if (senha) {
      camposAtualizacao.senha = await bcrypt.hash(senha, 10);
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: usuarioId },
      data: camposAtualizacao
    });

    return {
      id: usuarioAtualizado.id,
      nome: usuarioAtualizado.nome,
      email: usuarioAtualizado.email,
      papel: usuarioAtualizado.papel,
      matricula: usuarioAtualizado.matricula
    };
  }

  static async getUserByRegistration(matricula: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { matricula }
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      papel: usuario.papel,
      matricula: usuario.matricula
    };
  }
} 