import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const clientes = sqliteTable('clientes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  telefone: text('telefone').notNull(),
  email: text('email'),
  endereco: text('endereco'),
  observacoes: text('observacoes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export const servicos = sqliteTable('servicos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  descricao: text('descricao'),
  preco: real('preco').notNull(),
  duracao: integer('duracao'), // em minutos
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export const agendamentos = sqliteTable('agendamentos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  clienteId: integer('cliente_id').notNull().references(() => clientes.id, { onDelete: 'cascade' }),
  servicoId: integer('servico_id').notNull().references(() => servicos.id, { onDelete: 'restrict' }),
  dataHora: text('data_hora').notNull(),
  status: text('status', { enum: ['pendente', 'confirmado', 'concluido', 'cancelado'] }).default('pendente'),
  valor: real('valor').notNull(),
  observacoes: text('observacoes'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

export type Cliente = typeof clientes.$inferSelect;
export type NovoCliente = typeof clientes.$inferInsert;

export type Servico = typeof servicos.$inferSelect;
export type NovoServico = typeof servicos.$inferInsert;

export type Agendamento = typeof agendamentos.$inferSelect;
export type NovoAgendamento = typeof agendamentos.$inferInsert;