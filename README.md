# 📅 Agenda Pro - Sistema de Agendamentos para Autônomos
---

## 📖 Sobre o Sistema

**Agenda Pro** é um sistema web completo desenvolvido para profissionais autônomos gerenciarem seus negócios de forma simples e eficiente. Ideal para barbeiros, cabeleireiros, manicures, esteticistas, personal trainers, professores particulares e qualquer profissional que precise organizar clientes, serviços e horários.

### 🎯 Para que serve?

O sistema permite que o profissional autônomo:
- 📋 **Organize seus clientes** - cadastre e mantenha informações de contato
- 💼 **Gerencie seus serviços** - cadastre serviços com preços e duração
- 📅 **Controle sua agenda** - marque, confirme e acompanhe horários
- 💰 **Visualize receitas** - veja preços e totalize ganhos *(em desenvolvimento)*
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
- **Drizzle ORM** - ORM moderno e type-safe
- **SQLite** - Banco de dados leve e portátil
- **Better-SQLite3** - Driver nativo para SQLite
- **CORS** - Middleware para requisições cross-origin

### Frontend
- **Next.js 14** - Framework React
- **React** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP
- **date-fns** - Manipulação de datas

---

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** ou **yarn** (vem com o Node.js)
- **Git** (opcional, para clonar o repositório)

⚠️ **Não precisa instalar banco de dados!** O SQLite cria o arquivo automaticamente.

---

## 🚀 Instalação e Execução

### 1️⃣ Clonar o Repositório (opcional)

```bash
git clone https://github.com/seu-usuario/gestor-autonomo.git
cd gestor-autonomo
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
# No Windows:
copy .env.example .env

# No Linux/Mac:
cp .env.example .env
```

**Exemplo de `.env`:**
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=./data/database.db
```

```bash
# Gere o schema do banco de dados
npm run db:push

# (Opcional) Visualize o banco de dados
npm run db:studio

# Inicie o servidor backend
npm run dev
```

O backend estará rodando em: **http://localhost:3001**

✅ Se aparecer `🚀 Servidor rodando na porta 3001`, está tudo certo!

⚡ **Vantagem do SQLite:** O arquivo `database.db` é criado automaticamente na pasta `data/` - não precisa configurar servidor de banco!

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
# No Windows:
copy .env.local.example .env.local

# No Linux/Mac:
cp .env.local.example .env.local
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

✅ Abra o navegador e acesse: **http://localhost:3000**

---

## 🎨 Design e Usabilidade

O sistema foi desenvolvido seguindo as **10 Heurísticas de Nielsen**:

1. ✅ **Visibilidade do Status** - Loading, toasts coloridos, status visuais
2. ✅ **Linguagem Simples** - Termos do dia-a-dia, sem jargões técnicos
3. ✅ **Controle do Usuário** - Botões de voltar e cancelar sempre visíveis
4. ✅ **Consistência** - Mesmos padrões de botões, cores e layouts
5. ✅ **Prevenção de Erros** - Validação em tempo real, modais de confirmação
6. ✅ **Reconhecimento** - Ícones + texto (nunca só ícone)
7. ✅ **Flexibilidade** - Funciona em mobile, tablet e desktop
8. ✅ **Design Minimalista** - Foco no essencial, sem poluição visual
9. ✅ **Mensagens Claras** - Feedback sempre em linguagem natural
10. ✅ **Ajuda e Documentação** - Dicas e exemplos nos formulários

### 🎨 Paleta de Cores

- 🔵 **Azul (Primary)** - Ações principais, navegação
- 🟢 **Verde (Success)** - Confirmações, valores monetários
- 🔴 **Vermelho (Danger)** - Exclusões, cancelamentos
- 🟡 **Amarelo (Warning)** - Avisos, pendências
- ⚪ **Cinza (Secondary)** - Ações secundárias

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

## 📝 Melhorias Futuras

- [ ] Sistema de autenticação (login/senha)
- [ ] Notificações por WhatsApp/Email
- [ ] Relatórios de receita por período
- [ ] Histórico de agendamentos por cliente
- [ ] Dashboard com gráficos
- [ ] Exportação de dados (PDF/Excel)
- [ ] Backup automático do SQLite
- [ ] Multi-idiomas
- [ ] Tema escuro
- [ ] PWA (Progressive Web App)
- [ ] Sincronização na nuvem (opcional)


**Última atualização:** Dezembro 2025
