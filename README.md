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

    # 📅 Agenda Pro - Sistema de Agendamentos para Autônomos

![Status](https://img.shields.io/badge/Status-Completo-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📖 Sobre o Sistema

**Agenda Pro** é um sistema web completo desenvolvido para profissionais autônomos gerenciarem seus negócios de forma simples e eficiente. Ideal para barbeiros, cabeleireiros, manicures, esteticistas, personal trainers, professores particulares e qualquer profissional que precise organizar clientes, serviços e horários.

### 🎯 Para que serve?

O sistema permite que o profissional autônomo:
- 📋 **Organize seus clientes** - cadastre e mantenha informações de contato
- 💼 **Gerencie seus serviços** - cadastre serviços com preços e duração
- 📅 **Controle sua agenda** - marque, confirme e acompanhe horários
- 💰 **Visualize receitas** - veja preços e totalize ganhos
- 📊 **Acompanhe status** - pendentes, confirmados, concluídos, cancelados

---

## ✨ Funcionalidades

### 👥 Gestão de Clientes
- ✅ Cadastrar novos clientes (nome, telefone, email, endereço)
- ✅ Visualizar lista de clientes
- ✅ Buscar clientes por nome ou telefone
- ✅ Editar informações de clientes
- ✅ Remover clientes
- ✅ Ver detalhes completos em modal

### 💼 Gestão de Serviços
- ✅ Cadastrar serviços oferecidos (nome, descrição, preço, duração)
- ✅ Visualizar lista de serviços
- ✅ Buscar serviços por nome
- ✅ Editar serviços existentes
- ✅ Remover serviços
- ✅ Ver preço e duração destacados

### 📅 Gestão de Agenda
- ✅ Criar novos agendamentos (cliente + serviço + data/hora)
- ✅ Visualizar agenda completa
- ✅ Filtrar por status (todos, pendente, confirmado, concluído, cancelado)
- ✅ Buscar por cliente ou serviço
- ✅ Alterar status do agendamento (confirmar, concluir, cancelar)
- ✅ Editar agendamentos
- ✅ Remover agendamentos
- ✅ Cards coloridos por status
- ✅ Resumo visual (contadores por status)

### 🏠 Dashboard
- ✅ Resumo geral do negócio
- ✅ Total de clientes, serviços e agendamentos
- ✅ Contadores por status
- ✅ Acesso rápido às principais funcionalidades

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma ORM** - Gerenciamento de banco de dados
- **PostgreSQL** - Banco de dados relacional
- **CORS** - Middleware para requisições cross-origin

### Frontend
- **Next.js 14** - Framework React
- **React** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn** (vem com o Node.js)
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **Git** (opcional, para clonar o repositório)

---

## 🚀 Instalação e Execução

### 1️⃣ Preparar o Banco de Dados

```bash
# Entre no PostgreSQL
psql -U postgres

# Crie o banco de dados
CREATE DATABASE agenda_pro;

# Saia do psql
\q
```

---

### 2️⃣ Configurar o Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie o arquivo .env na raiz do backend:
cp .env.example .env

# Edite o arquivo .env e configure:
# DATABASE_URL="postgresql://usuario:senha@localhost:5432/agenda_pro"
# PORT=3001
```

**Exemplo de `.env`:**
```env
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/agenda_pro"
PORT=3001
NODE_ENV=development
```

```bash
# Execute as migrações do Prisma
npx prisma migrate dev

# (Opcional) Visualize o banco de dados
npx prisma studio

# Inicie o servidor backend
npm run dev
```

O backend estará rodando em: **http://localhost:3001**

✅ Se aparecer `🚀 Servidor rodando na porta 3001`, está tudo certo!

---

### 3️⃣ Configurar o Frontend

```bash
# Abra um NOVO terminal
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Crie o arquivo .env.local na raiz do frontend:
cp .env.local.example .env.local

# Edite o arquivo .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Exemplo de `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

```bash
# Inicie o servidor frontend
npm run dev
```

O frontend estará rodando em: **http://localhost:3000**

---

### Gerenciar Status - (EM DESENVOLVIMENTO)

Na página `/agenda`, você pode:

- **Confirmar** um agendamento pendente (botão verde)
- **Concluir** um agendamento confirmado (botão azul)
- **Cancelar** um agendamento (botão vermelho)
- **Editar** qualquer agendamento (botão azul "Editar")
- **Excluir** permanentemente (botão cinza "Excluir")

### 📱 Responsividade

O sistema se adapta automaticamente:
- 📱 **Mobile** (< 768px) - Cards empilhados, menu hambúrguer
- 📱 **Tablet** (768px - 1024px) - Grid de 2 colunas
- 💻 **Desktop** (> 1024px) - Grid de 3 colunas

---

## 📊 Endpoints da API

### Clientes
- `GET    /api/clientes` - Lista todos os clientes
- `GET    /api/clientes/:id` - Busca cliente por ID
- `POST   /api/clientes` - Cria novo cliente
- `PUT    /api/clientes/:id` - Atualiza cliente
- `DELETE /api/clientes/:id` - Remove cliente

### Serviços
- `GET    /api/servicos` - Lista todos os serviços
- `GET    /api/servicos/:id` - Busca serviço por ID
- `POST   /api/servicos` - Cria novo serviço
- `PUT    /api/servicos/:id` - Atualiza serviço
- `DELETE /api/servicos/:id` - Remove serviço

### Agendamentos
- `GET    /api/agendamentos` - Lista todos os agendamentos
- `GET    /api/agendamentos/:id` - Busca agendamento por ID
- `POST   /api/agendamentos` - Cria novo agendamento
- `PUT    /api/agendamentos/:id` - Atualiza agendamento
- `PATCH  /api/agendamentos/:id/status` - Atualiza apenas o status
- `DELETE /api/agendamentos/:id` - Remove agendamento

---

## 🐛 Solução de Problemas

### Backend não inicia

**Erro:** `Error: connect ECONNREFUSED 127.0.0.1:5432`
- ✅ Verifique se o PostgreSQL está rodando
- ✅ Confirme usuário e senha no `.env`
- ✅ Verifique se o banco de dados foi criado

**Erro:** `Prisma Client is not able to connect`
- ✅ Execute `npx prisma generate`
- ✅ Execute `npx prisma migrate dev`

### Frontend não conecta ao backend

**Erro:** `Network Error` ou `CORS Error`
- ✅ Verifique se o backend está rodando (`localhost:3001`)
- ✅ Confirme o `.env.local` no frontend
- ✅ Verifique o CORS no backend

### Página em branco

- ✅ Abra o Console do navegador (F12)
- ✅ Verifique se há erros
- ✅ Confirme se o `.env.local` existe no frontend

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma Branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a Branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

---

## 📝 Melhorias Futuras

- [ ] Sistema de autenticação (login/senha)
- [ ] Notificações por WhatsApp/Email
- [ ] Relatórios de receita por período
- [ ] Histórico de agendamentos por cliente
- [ ] Dashboard com gráficos
- [ ] Exportação de dados (PDF/Excel)
- [ ] Multi-idiomas
- [ ] Tema escuro
- [ ] PWA (Progressive Web App)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ para profissionais autônomos

---

## 📞 Suporte

Encontrou algum problema? Tem alguma sugestão?

- 🐛 Abra uma [Issue](https://github.com/seu-usuario/agenda-pro/issues)
- 💬 Entre em contato

---

## ⭐ Gostou do projeto?

Se este sistema foi útil para você, considere dar uma ⭐ no repositório!

---

**Última atualização:** Dezembro 2024