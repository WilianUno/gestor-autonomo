# Relatório do Trabalho Final - Desenvolvimento para Web

---

## 1. Identificação

**Aluno:** Wilian Robal dos Santos
**Curso:** Sistema de informações
**Disciplina:** Desenvolvimento para Web  
**Data de Entrega:** Dezembro de 2025

---

## 2. Repositório GitHub

**Link:** [wilianUno/gestor-autonomo](https://github.com/wilianUno/gestor-autonomo)

O projeto foi desenvolvido seguindo o padrão Conventional Commits, permitindo rastrear a evolução do código desde a configuração inicial até as funcionalidades finais.

---

## 3. Descrição do Tema e Justificativa

### O que é o projeto?

Desenvolvi um sistema web chamado **Gestor Autonomo**, voltado para profissionais autônomos que precisam organizar sua rotina de trabalho. A ideia surgiu quando fiz uma pesquisa de sistemas faltantes na comunidade, e percebi que muitos profissionais como barbeiros, manicures, personal trainers e outros acabam usando agendas de papel ou planilhas confusas, perdendo tempo e às vezes até esquecendo compromissos.

### Por que escolhi este tema?

Escolhi esse tema porque achei que seria útil para pessoas reais, e talvez eu continue com esse projeto para ver o que acontece. 

Além disso, do ponto de vista técnico, o tema permite trabalhar com relacionamentos entre entidades (cliente tem agendamento, agendamento tem serviço), o que torna o sistema mais interessante de desenvolver do que apenas um CRUD isolado.

### Qual problema o sistema resolve?

O Gestor Autonomo resolve principalmente três problemas:
1. **Organização de clientes** - ter todos os contatos em um só lugar, sem perder papéis
2. **Controle de serviços** - saber quanto cobra por cada serviço e quanto tempo leva
3. **Gestão da agenda** - ver compromissos futuros, confirmar horários, marcar como concluído

---

## 4. Público-Alvo

O sistema foi pensado para profissionais autônomos que:
- Trabalham sozinhos ou com poucos funcionários
- Atendem clientes agendados (não trabalham com demanda espontânea o tempo todo)
- Precisam de algo simples, sem curva de aprendizado alta
- Não querem pagar mensalidades caras por sistemas complexos

Exemplos: barbeiros, cabeleireiros, manicures, personal trainers, professores particulares, fisioterapeutas, psicólogos, entre outros.

**Características importantes para esse público:**
- Interface grande e clara (muitos usam no celular, às vezes com pouca familiaridade com tecnologia)
- Cores que significam algo óbvio (verde = confirmado, vermelho = cancelado)
- Textos diretos, sem termos técnicos
- Funcionar offline seria ideal (ainda não implementei, mas fica como melhoria futura)

---

## 5. Arquitetura do Backend

### Visão Geral

O backend foi desenvolvido em Node.js com Express, seguindo a arquitetura em camadas CSR (Controller-Service-Repository). Essa separação ajudou bastante a manter o código organizado e facilitar manutenções futuras.

### Camadas Implementadas

#### 5.1 Controller

A camada de Controller fica em `src/controllers/` e tem a responsabilidade de receber as requisições HTTP, fazer validações básicas e chamar o Service correspondente.

Essa camada é bem enxuta, ela só valida o básico e repassa para quem realmente sabe o que fazer.

#### 5.2 Service

A camada de Service fica em `src/services/` e concentra toda a lógica de negócio. É aqui que ficam validações mais complexas, regras de negócio e coordenação de chamadas ao banco.

Essa camada é onde a logica acontece. Se precisar adicionar uma nova regra (tipo "não permitir agendar no passado"), é aqui que entra.

#### 5.3 Repository

A camada de Repository fica em `src/repositories/` e é responsável por conversar com o banco de dados. Escolhi usar Drizzle ORM com SQLite, e essa camada encapsula todas as queries.

Uma coisa legal do Repository é que se amanhã eu quiser trocar o SQLite por PostgreSQL, só preciso mexer aqui. O resto do código nem fica sabendo.

### Por que escolhi SQLite + Drizzle?

Sinceramente, foi uma decisão bem pensada e o professor já tinha mostrado na aula:

**SQLite** porque:
- Não precisa instalar servidor de banco (facilita para quem vai testar)
- É um arquivo só, super fácil de fazer backup
- Perfeito para um profissional autônomo que vai usar localmente
- Rápido para o volume de dados esperado

**Drizzle ORM** porque:
- TypeScript em todo lugar (auto-complete funcionando)
- Mais leve que o Prisma (que usei em outros projetos)
- Drizzle Studio é muito bom para visualizar os dados
- Queries são mais explícitas, aprendi mais sobre SQL

---

## 6. Middlewares Personalizados

Implementei três middlewares principais, todos em `src/middlewares/`:

### 6.1 Middleware de Log

Registra toda requisição que chega no servidor. Fica no arquivo `logger.ts`:

Parece simples, mas é super útil para debugar, quando algo dá errado, consigo ver no terminal qual rota foi chamada e quando.

### 6.2 Middleware de Tratamento de Erros

Captura erros que acontecem em qualquer lugar da aplicação e retorna uma resposta adequada, fica no arquivo `errorHandler.ts`:

Isso evita que o usuário veja aquelas mensagens de erro feias do Node. Agora ele recebe algo tipo "Cliente não encontrado" ao invés de um stack trace gigante.

### 6.3 Middleware de Validação

Valida dados antes de chegar no controller, por exemplo, o `validarCliente.ts`:

Esse middleware roda antes do controller, evitando processar dados inválidos, é tipo um porteiro que só deixa entrar quem está com os documentos em ordem.

---

## 7. Rotas e API

### 7.1 Estrutura de Rotas

As rotas ficam organizadas em `src/routes/`, uma para cada recurso:

**Clientes** (`/api/clientes`):
- `GET /api/clientes` - Lista todos
- `GET /api/clientes/:id` - Busca um específico
- `POST /api/clientes` - Cria novo
- `PUT /api/clientes/:id` - Atualiza
- `DELETE /api/clientes/:id` - Remove

**Serviços** (`/api/servicos`):
- Mesma estrutura dos clientes

**Agendamentos** (`/api/agendamentos`):
- `GET /api/agendamentos` - Lista todos
- `GET /api/agendamentos/:id` - Busca um específico
- `POST /api/agendamentos` - Cria novo
- `PUT /api/agendamentos/:id` - Atualiza tudo
- `PATCH /api/agendamentos/:id/status` - Atualiza só o status
- `DELETE /api/agendamentos/:id` - Remove

### 7.2 Decisões sobre Métodos HTTP

Usei PATCH para atualizar status porque faz mais sentido semântico: não estou atualizando o agendamento todo, só uma propriedade. Já o PUT uso quando atualizo vários campos de uma vez.

DELETE sempre retorna 204 (No Content) quando dá certo, indicando que a operação foi bem-sucedida mas não há conteúdo para retornar.

---

## 8. Frontend - Reatividade

### 8.1 Tecnologia Escolhida

Usei **React com Next.js 14** (App Router). Escolhi React porque já tinha usado um pouco antes e achei que seria mais produtivo do que aprender Vue do zero agora.

### 8.2 Como funciona a Reatividade

A reatividade no React funciona através de hooks, principalmente `useState` e `useEffect`. Um exemplo da página de clientes:

Quando `setClientes()` é chamado, o React automaticamente re-renderiza a interface, o React faz a comparação do estado anterior com o novo e atualizando só o que mudou.

### 8.3 Atualizações Dinâmicas

Toda vez que o usuário cria, edita ou remove algo, a lista atualiza automaticamente. Por exemplo, ao cadastrar um cliente.

Na página de agendamentos, implementei filtros que atualizam em tempo real.

Isso significa que quando o usuário digita no campo de busca, a lista já vai filtrando ao vivo, não precisa apertar "buscar", acontece sozinho.

### 8.4 Sistema de Toast (Feedback Visual)

Criei um componente de Toast em `src/components/Toast.tsx` que mostra mensagens de sucesso ou erro. Ele usa Context API do React para estar disponível em qualquer lugar da aplicação.

O Toast aparece por 3 segundos e desaparece automaticamente. Achei muito mais elegante que usar `alert()`.

---

## 9. Frontend - Responsividade

### 9.1 Abordagem Mobile-First

Desenvolvi pensando primeiro em mobile e depois expandindo para desktop. Isso porque percebi que o público-alvo (autônomos) provavelmente vai usar mais no celular do que no computador.

### 9.2 Tecnologia: Tailwind CSS

Usei Tailwind porque ele facilita muito criar layouts responsivos, ao invés de escrever media queries manualmente, uso as classes utilitárias.

Isso significa:
- **Mobile** (< 768px): 1 coluna
- **Tablet** (≥ 768px): 2 colunas
- **Desktop** (≥ 1024px): 3 colunas

### 9.3 Elementos Responsivos

**Botões:** Sempre grandes e fáceis de clicar no celular

**Inputs:** Fonte grande (16px+) para não dar zoom no iOS

**Menu de Navegação:** Empilha verticalmente no mobile, horizontal no desktop


### 9.4 Testes de Responsividade

Testei em:
- ✅ iPhone SE (375px) - menor tela que considerei
- ✅ iPad (768px) - tablet
- ✅ Desktop 1920px - tela grande

Usei o DevTools do Chrome para simular diferentes dispositivos. Uma coisa que aprendi: nunca confiar só no simulador, sempre testar no celular real quando possível.

---

## 11. Persistência de Dados

### 11.1 Banco de Dados SQLite

O banco fica no arquivo `backend/database.db`. Toda vez que o servidor reinicia, os dados continuam lá. Não é JSON temporário na memória, é um banco de verdade.

### 11.2 Schema do Banco

Defini o schema no arquivo `src/db/schema.ts` usando Drizzle.

O Drizzle garante que os tipos do TypeScript batem com os tipos do banco. Se tento inserir um número onde deveria ser texto, o TypeScript já reclama antes de rodar.

### 11.3 Relacionamentos

Agendamentos tem foreign keys para clientes e serviços:

Isso garante integridade, não dá para criar agendamento com cliente inexistente.

---

## 12. Aprendizados e Reflexões

### 12.1 O que aprendi

**Arquitetura CSR na prática:** Nsse projeto ficou claro o valor disso, tinha utilizado a arquitetura de MVC antes.

**Drizzle ORM:** Foi minha primeira vez usando, no começo estranhei (estava acostumado com Prisma), mas depois gostei bastante. As queries são mais explícitas, parece que estou escrevendo SQL mas com type-safety.

**React Hooks:** `useState` e `useEffect` já conhecia, mas usar na prática em um projeto maior me fez entender melhor quando usar cada um. Principalmente o array de dependências do `useEffect`, que no começo me confundia.

**Responsividade:** Descobri que pensar mobile-first realmente facilita. É mais fácil expandir um layout simples para desktop do que encolher um layout complexo para mobile.

### 12.2 Dificuldades Encontradas

**1. Relacionamentos no Drizzle:** Demorei para entender como fazer joins corretamente. A documentação não é tão rica quanto a do Prisma. Acabei resolvendo fazendo queries separadas e juntando no Service, não é o ideal mas funciona.

**2 Tratamento de erros assíncrono:** No começo esquecia de usar try-catch nas funções async, aí quando dava erro o servidor travava. Depois que implementei o middleware de erro ficou mais tranquilo.

**3. Estado compartilhado no React:** O sistema de Toast precisava estar disponível em qualquer componente. Aprendi sobre Context API para resolver isso, mas levei um tempo para entender como funciona.

### 12.3 Decisões Técnicas Importantes

**Por que Next.js ao invés de React puro?**
Next.js já vem com roteamento configurado e é mais fácil de organizar páginas. O App Router dele (nova versão) é bem intuitivo.

**Por que SQLite ao invés de PostgreSQL?**
Para um profissional autônomo, SQLite é perfeito: não precisa configurar servidor, o backup é copiar um arquivo, e é rápido o suficiente. Se fosse um sistema com milhares de usuários simultâneos, aí sim PostgreSQL faria sentido.

**Por que não usei biblioteca de componentes pronta (MUI, Ant Design)?**
Queria ter mais controle sobre o design e aprender a fazer componentes do zero. Acabou sendo mais trabalhoso, mas aprendi muito mais sobre CSS e acessibilidade.

**Por que usei Tailwind?**
Porque facilita MUITO fazer responsividade. E uma vez que você pega o jeito das classes utilitárias, desenvolve bem mais rápido.

### 12.4 O que faria diferente?

**1. Testes automatizados:** Não implementei testes (Jest, Vitest) por falta de tempo, mas sei que deveria. Várias vezes quebrei alguma coisa ao adicionar feature nova. Com testes, pegaria antes de commitar.

**2. Validação com biblioteca:** Fiz validações "na mão" no código. Poderia ter usado Zod ou Joi, seria mais robusto e com mensagens de erro melhores.

**3. Paginação:** A listagem traz todos os registros de uma vez. Para poucos clientes não tem problema, mas se tivesse 1000, seria lento. Deveria ter implementado paginação na API.

**4. Loading states mais consistentes:** Alguns lugares mostram spinner, outros não. Deveria ter padronizado melhor.

**5. Docker:** Seria legal ter um `docker-compose.yml` para facilitar rodar o projeto. Assim não depende de ter Node instalado na versão certa.

### 12.5 Pontos Positivos do Projeto

O que acho que ficou bom:

✅ **Interface clara e intuitiva** - minha mãe conseguiu usar sem perguntar nada (testei!)
✅ **Código organizado** - consegui voltar em código de 2 semanas atrás e entender
✅ **Responsivo de verdade** - funciona bem no celular, não só "mais ou menos"
✅ **Feedback visual** - todo botão tem loading, todo action tem toast
✅ **README completo** - outra pessoa consegue rodar seguindo as instruções

### 12.6 Melhorias Futuras

Se fosse continuar desenvolvendo:

- [ ] Sistema de login (autenticação com JWT)
- [ ] Notificações por WhatsApp (usando API do Twilio)
- [ ] Dashboard com gráficos (Chart.js mostrando faturamento)
- [ ] Histórico de pagamentos por cliente
- [ ] Relatório mensal de receita
- [ ] PWA (funcionar offline)
- [ ] Backup automático na nuvem
- [ ] Multi-usuários (para salões com mais de um profissional)

---

## 13. Conclusão

Esse projeto foi desafiador, mas também muito gratificante. Consegui aplicar praticamente tudo que aprendi na disciplina: arquitetura em camadas, middlewares, REST API, reatividade, responsividade. 

O mais legal foi ver que criei algo que pode ser útil de verdade. Não é só um exercício acadêmico, é um sistema que alguém poderia usar no dia a dia. Isso me motivou bastante a caprichar nos detalhes.

Aprendi que desenvolvimento web é bem mais do que só escrever código que funciona. É pensar na experiência do usuário, em como organizar o código para facilitar manutenção futura, em como lidar com erros de forma elegante, em como fazer a aplicação funcionar bem em diferentes dispositivos.

Tenho consciência que tem muita coisa para melhorar ainda (como mencionei nas seções anteriores), mas acredito que o projeto atende os requisitos propostos e demonstra compreensão dos conceitos da disciplina.

Provavelmente vou continuar com essa projeto fazendo melhorias e hospendar na Vercel ou uma Hostinger, para ver onde posso chegar com ele!

---

**Assinatura:** Wilian Robal dos Santos  
**Data:** 09/12/2025