import { Request, Response } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  static async getAll(req: Request, res: Response) {
    res.json(await UserService.getAll());
  }
  static async getById(req: Request, res: Response) {
    res.json(await UserService.getById(Number(req.params.id)));
  }
  static async create(req: Request, res: Response) {
    res.json(await UserService.create(req.body));
  }
  static async update(req: Request, res: Response) {
    res.json(await UserService.update(Number(req.params.id), req.body));
  }
  static async remove(req: Request, res: Response) {
    res.json(await UserService.remove(Number(req.params.id)));
  }
} 