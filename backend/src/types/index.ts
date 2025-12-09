import { Request } from 'express';

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    total?: number;
    error?: boolean;
    details?: any;
}

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public details?: any
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export interface TypedRequest<T = any> extends Request {
    body: T;
}

export interface CreateClienteDTO {
    nome: string;
    telefone: string;
    email?: string;
    endereco?: string;
    observacoes?: string;
}

export interface UpdateClienteDTO {
    nome?: string;
    telefone?: string;
    email?: string;
    endereco?: string;
    observacoes?: string;
}

export interface CreateServicoDTO {
  nome: string;
  descricao?: string;
  preco: number;
  duracao?: number;
}

export interface UpdateServicoDTO {
  nome?: string;
  descricao?: string;
  preco?: number;
  duracao?: number;
}

export interface CreateAgendamentoDTO {
  clienteId: number;
  servicoId: number;
  dataHora: string;
  valor: number;
  observacoes?: string;
}

export interface UpdateAgendamentoDTO {
  dataHora?: string;
  status?: 'pendente' | 'confirmado' | 'concluido' | 'cancelado';
  valor?: number;
  observacoes?: string;
}