import { eq, and, gte, lte } from 'drizzle-orm';
import db from '../database/connection';
import { agendamentos, clientes, servicos, Agendamento } from '../database/schema';
import { CreateAgendamentoDTO, UpdateAgendamentoDTO } from '../types/index';

class AgendamentoRepository {
  
  async create(agendamentoData: CreateAgendamentoDTO): Promise<Agendamento> {
    const [novoAgendamento] = await db
      .insert(agendamentos)
      .values(agendamentoData)
      .returning();
    
    return novoAgendamento;
  }

  async findAll() {
    return await db
      .select({
        id: agendamentos.id,
        clienteId: agendamentos.clienteId,
        servicoId: agendamentos.servicoId,
        dataHora: agendamentos.dataHora,
        status: agendamentos.status,
        valor: agendamentos.valor,
        observacoes: agendamentos.observacoes,
        createdAt: agendamentos.createdAt,
        updatedAt: agendamentos.updatedAt,
        cliente: {
          id: clientes.id,
          nome: clientes.nome,
          telefone: clientes.telefone
        },
        servico: {
          id: servicos.id,
          nome: servicos.nome,
          preco: servicos.preco,
          duracao: servicos.duracao
        }
      })
      .from(agendamentos)
      .leftJoin(clientes, eq(agendamentos.clienteId, clientes.id))
      .leftJoin(servicos, eq(agendamentos.servicoId, servicos.id))
      .orderBy(agendamentos.dataHora);
  }

  async findById(id: number) {
    const [agendamento] = await db
      .select({
        id: agendamentos.id,
        clienteId: agendamentos.clienteId,
        servicoId: agendamentos.servicoId,
        dataHora: agendamentos.dataHora,
        status: agendamentos.status,
        valor: agendamentos.valor,
        observacoes: agendamentos.observacoes,
        createdAt: agendamentos.createdAt,
        updatedAt: agendamentos.updatedAt,
        cliente: {
          id: clientes.id,
          nome: clientes.nome,
          telefone: clientes.telefone,
          email: clientes.email
        },
        servico: {
          id: servicos.id,
          nome: servicos.nome,
          descricao: servicos.descricao,
          preco: servicos.preco,
          duracao: servicos.duracao
        }
      })
      .from(agendamentos)
      .leftJoin(clientes, eq(agendamentos.clienteId, clientes.id))
      .leftJoin(servicos, eq(agendamentos.servicoId, servicos.id))
      .where(eq(agendamentos.id, id));
    
    return agendamento;
  }

  async findByCliente(clienteId: number) {
    return await db
      .select({
        id: agendamentos.id,
        clienteId: agendamentos.clienteId,
        servicoId: agendamentos.servicoId,
        dataHora: agendamentos.dataHora,
        status: agendamentos.status,
        valor: agendamentos.valor,
        observacoes: agendamentos.observacoes,
        servico: {
          id: servicos.id,
          nome: servicos.nome
        }
      })
      .from(agendamentos)
      .leftJoin(servicos, eq(agendamentos.servicoId, servicos.id))
      .where(eq(agendamentos.clienteId, clienteId))
      .orderBy(agendamentos.dataHora);
  }

  async findByStatus(status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado') {
    return await db
      .select({
        id: agendamentos.id,
        clienteId: agendamentos.clienteId,
        servicoId: agendamentos.servicoId,
        dataHora: agendamentos.dataHora,
        status: agendamentos.status,
        valor: agendamentos.valor,
        cliente: {
          id: clientes.id,
          nome: clientes.nome,
          telefone: clientes.telefone
        },
        servico: {
          id: servicos.id,
          nome: servicos.nome
        }
      })
      .from(agendamentos)
      .leftJoin(clientes, eq(agendamentos.clienteId, clientes.id))
      .leftJoin(servicos, eq(agendamentos.servicoId, servicos.id))
      .where(eq(agendamentos.status, status))
      .orderBy(agendamentos.dataHora);
  }

  async findByPeriodo(dataInicio: string, dataFim: string) {
    return await db
      .select({
        id: agendamentos.id,
        clienteId: agendamentos.clienteId,
        servicoId: agendamentos.servicoId,
        dataHora: agendamentos.dataHora,
        status: agendamentos.status,
        valor: agendamentos.valor,
        cliente: {
          id: clientes.id,
          nome: clientes.nome,
          telefone: clientes.telefone
        },
        servico: {
          id: servicos.id,
          nome: servicos.nome
        }
      })
      .from(agendamentos)
      .leftJoin(clientes, eq(agendamentos.clienteId, clientes.id))
      .leftJoin(servicos, eq(agendamentos.servicoId, servicos.id))
      .where(
        and(
          gte(agendamentos.dataHora, dataInicio),
          lte(agendamentos.dataHora, dataFim)
        )
      )
      .orderBy(agendamentos.dataHora);
  }

  async update(id: number, agendamentoData: UpdateAgendamentoDTO): Promise<Agendamento | undefined> {
    const [agendamentoAtualizado] = await db
      .update(agendamentos)
      .set({
        ...agendamentoData,
        updatedAt: new Date().toISOString()
      })
      .where(eq(agendamentos.id, id))
      .returning();
    
    return agendamentoAtualizado;
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(agendamentos)
      .where(eq(agendamentos.id, id));
    
    return result.changes > 0;
  }

  async count(): Promise<number> {
    const result = await db.select().from(agendamentos);
    return result.length;
  }

  async countByStatus(status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado'): Promise<number> {
    const result = await db
      .select()
      .from(agendamentos)
      .where(eq(agendamentos.status, status));
    return result.length;
  }
}

export default new AgendamentoRepository();