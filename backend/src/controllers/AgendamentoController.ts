import { Request, Response, NextFunction } from 'express';
import AgendamentoService from '../services/AgendamentoService';
import { TypedRequest, CreateAgendamentoDTO, UpdateAgendamentoDTO } from '../types/index';

class AgendamentoController {

  async create(req: TypedRequest<CreateAgendamentoDTO>, res: Response, next: NextFunction): Promise<void> {
    try {
      const resultado = await AgendamentoService.createAgendamento(req.body);
      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resultado = await AgendamentoService.getAllAgendamentos();
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const resultado = await AgendamentoService.getAgendamentoById(Number(id));
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async getByCliente(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { clienteId } = req.params;
      const resultado = await AgendamentoService.getAgendamentosByCliente(Number(clienteId));
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async getByStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status } = req.params;
      const resultado = await AgendamentoService.getAgendamentosByStatus(status);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async getByPeriodo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { inicio, fim } = req.query;
      const resultado = await AgendamentoService.getAgendamentosByPeriodo(inicio as string, fim as string);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async update(req: TypedRequest<UpdateAgendamentoDTO>, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const resultado = await AgendamentoService.updateAgendamento(Number(id), req.body);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async cancelar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const resultado = await AgendamentoService.cancelarAgendamento(Number(id));
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const resultado = await AgendamentoService.deleteAgendamento(Number(id));
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  async getEstatisticas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resultado = await AgendamentoService.getEstatisticas();
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
}

export default new AgendamentoController();