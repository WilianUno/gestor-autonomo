import { Request, Response, NextFunction } from "express";
import { AppError } from '../types/index';

export const validateClienteCreate = (req: Request, res: Response, next: NextFunction): void => {
    const { nome, telefone } = req.body;
    const errors: string[] = [];

    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
     errors.push('Nome é obrigatório');   
    }

    if (!telefone || typeof telefone !== 'string' || telefone.trim() === '') {
        errors.push('Telefone é obrigatório');
    }

    if (errors.length > 0) {
        throw new AppError('Dados inválidos', 400, errors);
    }

    next();
}

export const validateClienteUpdate = (req: Request, res: Response, next: NextFunction): void => {
    const { nome, telefone, email, endereco, observacoes } = req.body;
    
    if (!nome && undefined && (typeof nome !== 'string' || nome.trim() === '')) {
        throw new AppError('Nome não pode esta vazio', 400);
    }

    if (telefone !== undefined && (typeof telefone !== 'string' || telefone.trim() === '')) {
        throw new AppError('Telefone não pode estar vazio', 400);
    }

    next();
};

export const validateId = (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        throw new AppError('ID inválido', 400);
    }

    next();
};

export const validateServicoCreate = (req: Request, res: Response, next: NextFunction): void => {
  const { nome, preco } = req.body;
  const errors: string[] = [];

  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    errors.push('Nome do serviço é obrigatório');
  }

  if (!preco || isNaN(Number(preco)) || Number(preco) <= 0) {
    errors.push('Preço deve ser um valor positivo');
  }

  if (errors.length > 0) {
    throw new AppError('Dados inválidos', 400, errors);
  }

  next();
};

export const validateAgendamentoCreate = (req: Request, res: Response, next: NextFunction): void => {
  const { clienteId, servicoId, dataHora, valor } = req.body;
  const errors: string[] = [];

  if (!clienteId || isNaN(Number(clienteId))) {
    errors.push('Cliente inválido');
  }

  if (!servicoId || isNaN(Number(servicoId))) {
    errors.push('Serviço inválido');
  }

  if (!dataHora || typeof dataHora !== 'string') {
    errors.push('Data e hora são obrigatórios');
  }

  if (!valor || isNaN(Number(valor)) || Number(valor) <= 0) {
    errors.push('Valor deve ser positivo');
  }

  if (errors.length > 0) {
    throw new AppError('Dados inválidos', 400, errors);
  }

  next();
};