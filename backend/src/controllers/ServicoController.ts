import { Request, Response, NextFunction } from 'express';
import ServicoService from '../services/ServicoService';
import { TypedRequest, CreateServicoDTO, UpdateServicoDTO } from '../types/index';

class ServicoController {

  async create(req: TypedRequest<CreateServicoDTO>, res: Response, next: NextFunction): Promise<void> {
    try {
      const resultado = await ServicoService.createServico(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resultado = await ServicoService.getAllServicos();
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const resultado = await ServicoService.getServicoById(Number(id));
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { termo } = req.query;
      const resultado = await ServicoService.searchServicos(termo as string);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async update(req: TypedRequest<UpdateServicoDTO>, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const resultado = await ServicoService.updateServico(Number(id), req.body);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const resultado = await ServicoService.deleteServico(Number(id));
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async getEstatisticas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resultado = await ServicoService.getEstatisticas();
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
}

export default new ServicoController();