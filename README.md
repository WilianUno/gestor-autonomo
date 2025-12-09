# gestor-autonomo
Ferramenta para os autonomos onde vai poder gerenciar sua agenda, clientes, orçamentos, serviços, pagamentos recebidos pendentes e lembretes


🏗️ Arquitetura Sugerida

projeto-autonomos/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Recebe requisições HTTP
│   │   ├── services/       # Lógica de negócio
│   │   ├── repositories/   # Acesso ao banco SQLite
│   │   ├── middlewares/    # Log, erros, validação
│   │   ├── routes/         # Definição das rotas
│   │   └── database/       # Conexão SQLite
│   ├── database.sqlite     # Seu banco
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/            # Pages do Next.js
    │   ├── components/     # Componentes React
    │   ├── services/       # Chamadas à API (fetch/axios)
    │   └── types/          # Types TypeScript
    └── package.json