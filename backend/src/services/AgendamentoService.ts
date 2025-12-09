import AgendamentoRepository from '../repositories/AgendamentoRepository';
import ClienteRepository from '../repositories/ClienteRepository';
import ServicoRepository from '../repositories/ServicoRepository';
import { AppError, ApiResponse, CreateAgendamentoDTO, UpdateAgendamentoDTO } from '../types/index';

class AgendamentoService {

  async createAgendamento(agendamentoData: CreateAgendamentoDTO): Promise<ApiResponse> {
    const cliente = await ClienteRepository.findById(agendamentoData.clienteId);
    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404);
    }

    const servico = await ServicoRepository.findById(agendamentoData.servicoId);
    if (!servico) {
      throw new AppError('Serviço não encontrado', 404);
    }

    const dataAgendamento = new Date(agendamentoData.dataHora);
    const agora = new Date();
    if (dataAgendamento < agora) {
      throw new AppError('Não é possível agendar para uma data passada', 400);
    }

    const novoAgendamento = await AgendamentoRepository.create(agendamentoData);
    
    return {
      success: true,
      message: 'Agendamento criado com sucesso',
      data: novoAgendamento
    };
  }

  async getAllAgendamentos(): Promise<ApiResponse> {
    const agendamentos = await AgendamentoRepository.findAll();
    
    return {
      success: true,
      total: agendamentos.length,
      data: agendamentos
    };
  }

  async getAgendamentoById(id: number): Promise<ApiResponse> {
    const agendamento = await AgendamentoRepository.findById(id);

    if (!agendamento) {
      throw new AppError('Agendamento não encontrado', 404);
    }

    return {
      success: true,
      data: agendamento
    };
  }

  async getAgendamentosByCliente(clienteId: number): Promise<ApiResponse> {
    const cliente = await ClienteRepository.findById(clienteId);
    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404);
    }

    const agendamentos = await AgendamentoRepository.findByCliente(clienteId);

    return {
      success: true,
      total: agendamentos.length,
      data: agendamentos
    };
  }

  async getAgendamentosByStatus(status: string): Promise<ApiResponse> {
    const statusValidos = ['pendente', 'confirmado', 'concluido', 'cancelado'];
    if (!statusValidos.includes(status)) {
      throw new AppError('Status inválido. Valores aceitos: pendente, confirmado, concluido, cancelado', 400);
    }

    const agendamentos = await AgendamentoRepository.findByStatus(status);

    return {
      success: true,
      total: agendamentos.length,
      data: agendamentos
    };
  }

  async getAgendamentosByPeriodo(dataInicio: string, dataFim: string): Promise<ApiResponse> {
    if (!dataInicio || !dataFim) {
      throw new AppError('Data de início e fim são obrigatórias', 400);
    }

    const agendamentos = await AgendamentoRepository.findByPeriodo(dataInicio, dataFim);

    return {
      success: true,
      total: agendamentos.length,
      data: agendamentos
    };
  }

  async updateAgendamento(id: number, agendamentoData: UpdateAgendamentoDTO): Promise<ApiResponse> {
    const agendamentoExistente = await AgendamentoRepository.findById(id);
    if (!agendamentoExistente) {
      throw new AppError('Agendamento não encontrado', 404);
    }

    if (agendamentoData.dataHora) {
      const dataAgendamento = new Date(agendamentoData.dataHora);
      const agora = new Date();
      if (dataAgendamento < agora) {
        throw new AppError('Não é possível reagendar para uma data passada', 400);
      }
    }

    const agendamentoAtualizado = await AgendamentoRepository.update(id, agendamentoData);

    if (!agendamentoAtualizado) {
      throw new AppError('Falha ao atualizar agendamento', 500);
    }

    return {
      success: true,
      message: 'Agendamento atualizado com sucesso',
      data: agendamentoAtualizado
    };
  }

  async cancelarAgendamento(id: number): Promise<ApiResponse> {
    const agendamento = await AgendamentoRepository.findById(id);
    if (!agendamento) {
      throw new AppError('Agendamento não encontrado', 404);
    }

    if (agendamento.status === 'cancelado') {
      throw new AppError('Agendamento já está cancelado', 400);
    }

    if (agendamento.status === 'concluido') {
      throw new AppError('Não é possível cancelar um agendamento já concluído', 400);
    }

    await AgendamentoRepository.update(id, { status: 'cancelado' });

    return {
      success: true,
      message: 'Agendamento cancelado com sucesso'
    };
  }

  async deleteAgendamento(id: number): Promise<ApiResponse> {
    const agendamento = await AgendamentoRepository.findById(id);
    if (!agendamento) {
      throw new AppError('Agendamento não encontrado', 404);
    }

    const deletado = await AgendamentoRepository.delete(id);

    if (!deletado) {
      throw new AppError('Falha ao deletar agendamento', 500);
    }

    return {
      success: true,
      message: 'Agendamento deletado com sucesso'
    };
  }

  async getEstatisticas(): Promise<ApiResponse> {
    const total = await AgendamentoRepository.count();
    const pendentes = await AgendamentoRepository.countByStatus('pendente');
    const confirmados = await AgendamentoRepository.countByStatus('confirmado');
    const concluidos = await AgendamentoRepository.countByStatus('concluido');
    const cancelados = await AgendamentoRepository.countByStatus('cancelado');

    return {
      success: true,
      data: {
        total_agendamentos: total,
        pendentes,
        confirmados,
        concluidos,
        cancelados
      }
    };
  }
}

export default new AgendamentoService();