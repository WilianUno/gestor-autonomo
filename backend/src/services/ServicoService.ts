import ServicoRepository from '../repositories/ServicoRepository';
import { AppError, ApiResponse, CreateServicoDTO, UpdateServicoDTO } from '../types/index';
import { Servico } from '../database/schema';

class ServicoService {

  async createServico(servicoData: CreateServicoDTO): Promise<ApiResponse<Servico>> {
    if (servicoData.preco < 0) {
      throw new AppError('Preço não pode ser negativo', 400);
    }

    const servicoNormalizado: CreateServicoDTO = {
      nome: servicoData.nome.trim(),
      descricao: servicoData.descricao ? servicoData.descricao.trim() : undefined,
      preco: Number(servicoData.preco),
      duracao: servicoData.duracao ? Number(servicoData.duracao) : undefined
    };

    const novoServico = await ServicoRepository.create(servicoNormalizado);
    
    return {
      success: true,
      message: 'Serviço criado com sucesso',
      data: novoServico
    };
  }

  async getAllServicos(): Promise<ApiResponse<Servico[]>> {
    const servicos = await ServicoRepository.findAll();
    
    return {
      success: true,
      total: servicos.length,
      data: servicos
    };
  }

  async getServicoById(id: number): Promise<ApiResponse<Servico>> {
    const servico = await ServicoRepository.findById(id);

    if (!servico) {
      throw new AppError('Serviço não encontrado', 404);
    }

    return {
      success: true,
      data: servico
    };
  }

  async searchServicos(termo: string): Promise<ApiResponse<Servico[]>> {
    if (!termo || termo.trim() === '') {
      throw new AppError('Termo de busca não pode estar vazio', 400);
    }

    const servicos = await ServicoRepository.findByNome(termo);

    return {
      success: true,
      total: servicos.length,
      data: servicos
    };
  }

  async updateServico(id: number, servicoData: UpdateServicoDTO): Promise<ApiResponse<Servico>> {
    const servicoExistente = await ServicoRepository.findById(id);
    if (!servicoExistente) {
      throw new AppError('Serviço não encontrado', 404);
    }

    if (servicoData.preco !== undefined && servicoData.preco < 0) {
      throw new AppError('Preço não pode ser negativo', 400);
    }

    const dadosNormalizados: UpdateServicoDTO = {};
    if (servicoData.nome) dadosNormalizados.nome = servicoData.nome.trim();
    if (servicoData.descricao !== undefined) {
      dadosNormalizados.descricao = servicoData.descricao ? servicoData.descricao.trim() : undefined;
    }
    if (servicoData.preco !== undefined) dadosNormalizados.preco = Number(servicoData.preco);
    if (servicoData.duracao !== undefined) dadosNormalizados.duracao = servicoData.duracao ? Number(servicoData.duracao) : undefined;

    const servicoAtualizado = await ServicoRepository.update(id, dadosNormalizados);

    if (!servicoAtualizado) {
      throw new AppError('Falha ao atualizar serviço', 500);
    }

    return {
      success: true,
      message: 'Serviço atualizado com sucesso',
      data: servicoAtualizado
    };
  }

  async deleteServico(id: number): Promise<ApiResponse> {
    const servico = await ServicoRepository.findById(id);
    if (!servico) {
      throw new AppError('Serviço não encontrado', 404);
    }
    
    const deletado = await ServicoRepository.delete(id);

    if (!deletado) {
      throw new AppError('Falha ao deletar serviço', 500);
    }

    return {
      success: true,
      message: 'Serviço deletado com sucesso'
    };
  }

  async getEstatisticas(): Promise<ApiResponse<{ total_servicos: number }>> {
    const total = await ServicoRepository.count();

    return {
      success: true,
      data: {
        total_servicos: total
      }
    };
  }
}

export default new ServicoService();