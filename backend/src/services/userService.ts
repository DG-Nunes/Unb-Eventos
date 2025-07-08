import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  static async getAll() {
    return prisma.usuario.findMany();
  }

  static async getById(id: number) {
    return prisma.usuario.findUnique({ where: { id } });
  }

  static async create(data: any) {
    return prisma.usuario.create({ data });
  }

  static async update(id: number, data: any) {
    return prisma.usuario.update({ where: { id }, data });
  }

  static async remove(id: number) {
    return prisma.usuario.delete({ where: { id } });
  }
} 