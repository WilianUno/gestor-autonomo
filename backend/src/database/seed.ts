import db from './connection';
import { clientes, servicos } from './schema';

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  await db.insert(clientes).values([
    {
      nome: 'João Silva',
      telefone: '(49) 99999-1111',
      email: 'joao@email.com',
      endereco: 'Rua A, 123',
      observacoes: 'Cliente frequente'
    },
    {
      nome: 'Maria Santos',
      telefone: '(49) 99999-2222',
      email: 'maria@email.com',
      endereco: 'Rua B, 456'
    },
    {
      nome: 'Pedro Oliveira',
      telefone: '(49) 99999-3333',
      observacoes: 'Indicado por João'
    }
  ]);

  await db.insert(servicos).values([
    {
      nome: 'Corte Masculino',
      descricao: 'Corte de cabelo masculino tradicional',
      preco: 35.00,
      duracao: 30
    },
    {
      nome: 'Barba',
      descricao: 'Aparar e modelar barba',
      preco: 25.00,
      duracao: 20
    },
    {
      nome: 'Corte + Barba',
      descricao: 'Pacote completo',
      preco: 55.00,
      duracao: 45
    }
  ]);

  console.log('✅ Seed concluído com sucesso!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Erro ao fazer seed:', error);
  process.exit(1);
});