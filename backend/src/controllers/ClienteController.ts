import { Request, Response, NextFunction } from 'express';
import ClienteService from '../services/ClienteService';
import { TypedRequest, CreateClienteDTO, UpdateClienteDTO } from '../types/index';

class ClienteController {

  async create(req: TypedRequest<CreateClienteDTO>, res: Response, next: NextFunction): Promise<void> {
    try {
      const resultado = await ClienteService.createCliente(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resultado = await ClienteService.getAllClientes();
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const resultado = await ClienteService.getClienteById(Number(id));
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { termo } = req.query;
      const resultado = await ClienteService.searchClientes(termo as string);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async update(req: TypedRequest<UpdateClienteDTO>, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const resultado = await ClienteService.updateCliente(Number(id), req.body);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const resultado = await ClienteService.deleteCliente(Number(id));
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async getEstatisticas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resultado = await ClienteService.getEstatisticas();
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
}

export default new ClienteController();