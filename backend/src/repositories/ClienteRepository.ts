import { eq, like } from 'drizzle-orm';
import db from '../database/connection';
import { clientes, Cliente, NovoCliente } from '../database/schema';
import { CreateClienteDTO, UpdateClienteDTO } from '../types/index';

class ClienteRepository {
  
  async create(clienteData: CreateClienteDTO): Promise<Cliente> {
    const [novoCliente] = await db
      .insert(clientes)
      .values(clienteData)
      .returning();
    
    return novoCliente;
  }

  async findAll(): Promise<Cliente[]> {
    return await db.select().from(clientes).orderBy(clientes.nome);
  }

  async findById(id: number): Promise<Cliente | undefined> {
    const [cliente] = await db
      .select()
      .from(clientes)
      .where(eq(clientes.id, id));
    
    return cliente;
  }

  async findByNome(nome: string): Promise<Cliente[]> {
    return await db
      .select()
      .from(clientes)
      .where(like(clientes.nome, `%${nome}%`))
      .orderBy(clientes.nome);
  }

  async update(id: number, clienteData: UpdateClienteDTO): Promise<Cliente | undefined> {
    const [clienteAtualizado] = await db
      .update(clientes)
      .set({
        ...clienteData,
        updatedAt: new Date().toISOString()
      })
      .where(eq(clientes.id, id))
      .returning();
    
    return clienteAtualizado;
  }

  async delete(id: number): Promise<boolean> {
    const result = await db
      .delete(clientes)
      .where(eq(clientes.id, id));
    
    return result.changes > 0;
  }

  async count(): Promise<number> {
    const result = await db.select().from(clientes);
    return result.length;
  }
}

export default new ClienteRepository();