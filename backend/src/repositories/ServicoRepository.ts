import { eq, like } from 'drizzle-orm';
import db from '../database/connection';
import { servicos, Servico } from '../database/schema';
import { CreateServicoDTO, UpdateServicoDTO } from '../types/index';

class ServicoRepository {
  
  async create(servicoData: CreateServicoDTO): Promise<Servico> {
    const [novoServico] = await db
      .insert(servicos)
      .values(servicoData)
      .returning();
    
    return novoServico;
  }

  async findAll(): Promise<Servico[]> {
    return await db.select().from(servicos).orderBy(servicos.nome);
  }

  async findById(id: number): Promise<Servico | undefined> {
    const [servico] = await db
      .select()
      .from(servicos)
      .where(eq(servicos.id, id));
    
    return servico;
  }

  async findByNome(nome: string): Promise<Servico[]> {
    return await db
      .select()
      .from(servicos)
      .where(like(servicos.nome, `%${nome}%`))
      .orderBy(servicos.nome);
  }

  async update(id: number, servicoData: UpdateServicoDTO): Promise<Servico | undefined> {
    const [servicoAtualizado] = await db
      .update(servicos)
      .set({
        ...servicoData,
        updatedAt: new Date().toISOString()
      })
      .where(eq(servicos.id, id))
      .returning();
    
    return servicoAtualizado;
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(servicos)
      .where(eq(servicos.id, id));
    
    return result.changes > 0;
  }

  async count(): Promise<number> {
    const result = await db.select().from(servicos);
    return result.length;
  }
}

export default new ServicoRepository();