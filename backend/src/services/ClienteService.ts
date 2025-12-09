import ClienteRepository from '../repositories/ClienteRepository';
import { AppError, ApiResponse, CreateClienteDTO, UpdateClienteDTO } from '../types/index';
import { Cliente } from '../database/schema';

class ClienteService {

  async createCliente(clienteData: CreateClienteDTO): Promise<ApiResponse<Cliente>> {
    const clienteNormalizado: CreateClienteDTO = {
      nome: clienteData.nome.trim(),
      telefone: clienteData.telefone.trim(),
      email: clienteData.email ? clienteData.email.trim().toLowerCase() : undefined,
      endereco: clienteData.endereco ? clienteData.endereco.trim() : undefined,
      observacoes: clienteData.observacoes ? clienteData.observacoes.trim() : undefined
    };

    const novoCliente = await ClienteRepository.create(clienteNormalizado);
    
    return {
      success: true,
      message: 'Cliente criado com sucesso',
      data: novoCliente
    };
  }

  async getAllClientes(): Promise<ApiResponse<Cliente[]>> {
    const clientes = await ClienteRepository.findAll();
    
    return {
      success: true,
      total: clientes.length,
      data: clientes
    };
  }

  async getClienteById(id: number): Promise<ApiResponse<Cliente>> {
    const cliente = await ClienteRepository.findById(id);

    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404);
    }

    return {
      success: true,
      data: cliente
    };
  }

  async searchClientes(termo: string): Promise<ApiResponse<Cliente[]>> {
    if (!termo || termo.trim() === '') {
      throw new AppError('Termo de busca não pode estar vazio', 400);
    }

    const clientes = await ClienteRepository.findByNome(termo);

    return {
      success: true,
      total: clientes.length,
      data: clientes
    };
  }

  async updateCliente(id: number, clienteData: UpdateClienteDTO): Promise<ApiResponse<Cliente>> {
    const clienteExistente = await ClienteRepository.findById(id);
    if (!clienteExistente) {
      throw new AppError('Cliente não encontrado', 404);
    }

    const dadosNormalizados: UpdateClienteDTO = {};
    if (clienteData.nome) dadosNormalizados.nome = clienteData.nome.trim();
    if (clienteData.telefone) dadosNormalizados.telefone = clienteData.telefone.trim();
    if (clienteData.email !== undefined) {
      dadosNormalizados.email = clienteData.email ? clienteData.email.trim().toLowerCase() : undefined;
    }
    if (clienteData.endereco !== undefined) {
      dadosNormalizados.endereco = clienteData.endereco ? clienteData.endereco.trim() : undefined;
    }
    if (clienteData.observacoes !== undefined) {
      dadosNormalizados.observacoes = clienteData.observacoes ? clienteData.observacoes.trim() : undefined;
    }

    const clienteAtualizado = await ClienteRepository.update(id, dadosNormalizados);

    if (!clienteAtualizado) {
      throw new AppError('Falha ao atualizar cliente', 500);
    }

    return {
      success: true,
      message: 'Cliente atualizado com sucesso',
      data: clienteAtualizado
    };
  }

  async deleteCliente(id: number): Promise<ApiResponse> {
    const cliente = await ClienteRepository.findById(id);
    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404);
    }

    const deletado = await ClienteRepository.delete(id);

    if (!deletado) {
      throw new AppError('Falha ao deletar cliente', 500);
    }

    return {
      success: true,
      message: 'Cliente deletado com sucesso'
    };
  }

  
  async getEstatisticas(): Promise<ApiResponse<{ total_clientes: number }>> {
    const total = await ClienteRepository.count();

    return {
      success: true,
      data: {
        total_clientes: total
      }
    };
  }
}

export default new ClienteService();