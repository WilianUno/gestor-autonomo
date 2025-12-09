export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  endereco?: string;
  observacoes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Servico {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  duracao?: number; 
  createdAt?: string;
  updatedAt?: string;
}

export interface Agendamento {
  id: number;
  clienteId: number;
  servicoId: number;
  dataHora: string;
  status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado';
  valor: number;
  observacoes?: string;
  createdAt?: string;
  updatedAt?: string;
  // Dados relacionados (joins)
  cliente?: {
    id: number;
    nome: string;
    telefone: string;
    email?: string;
  };
  servico?: {
    id: number;
    nome: string;
    preco: number;
    duracao?: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
}

export interface Estatisticas {
  total_clientes?: number;
  total_servicos?: number;
  total_agendamentos?: number;
  pendentes?: number;
  confirmados?: number;
  concluidos?: number;
  cancelados?: number;
}