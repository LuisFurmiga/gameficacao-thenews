# 📖 Backend - Gamificação The News

Este repositório contém o backend da aplicação de gamificação da newsletter *The News*. A API gerencia leitores, newsletters e streaks de leitura, além de fornecer métricas administrativas.

## 🔎 Perguntas a serem Respondidas

### 1. **Stacks**
- **Quais as tecnologias usadas?**
  - Node.js com TypeScript
  - Express.js para a API REST
  - PostgreSQL com Sequelize ORM
  - Autenticação JWT
  - Swagger para documentação da API
  - Node-cron para tarefas agendadas
  - Axios para requisições HTTP
  
- **Quais desafios enfrentou ao desenvolver?**
  - Implementação da lógica de streaks de leitura.
  - Sincronização eficiente entre banco de dados e chamadas webhook.
  - Criação de um sistema escalável para rastreamento de leituras.
  
- **Qual a organização escolhida e por quê?**
  - Arquitetura modular separando *controllers*, *routes*, *models* e *middlewares*, garantindo manutenção e escalabilidade.

### 2. **Dados**
- **Qual a estrutura do seu SQL?**
  - O banco de dados contém as tabelas `readers`, `newsletters`, `streaks` e `openings`.
  - `readers`: armazena os leitores registrados.
  - `newsletters`: identifica cada newsletter por um `resource_id`.
  - `streaks`: gerencia as sequências de leitura contínuas.
  - `openings`: registra cada abertura de newsletter.
  
- **Como lidou com inserções e consultas?**
  - Utilização do ORM Sequelize para operações CRUD.
  - Consultas otimizadas utilizando *indexes* e filtros baseados em UTM.
  - Sincronização automática do banco de dados na inicialização.

- **Ele é escalável? Explique.**
  - Sim. O uso de PostgreSQL permite escalabilidade horizontal.
  - Webhooks são processados de forma assíncrona para não bloquear requisições.
  - O cache de requisições evita reprocessamento de dados já recebidos.

### 3. **Testes**
- **Quais testes você realizou?**
  - Testes manuais dos endpoints via *Postman* e Swagger.
  - Validação da autenticação JWT.
  - Testes de carga com múltiplas requisições simultâneas.

- **Quanto tempo levou no desenvolvimento e testes?**
  - Aproximadamente 2 dias para o backend.

## 🚀 Como rodar o projeto

### 📌 Pré-requisitos
- Node.js versão 22+
- PostgreSQL instalado

### 🔧 Instalação e execução
```sh
# Clonar o repositório
git clone https://github.com/LuisFurmiga/gamificacao-thenews.git
cd gamificacao-thenews/backend

# Instalar dependências
npm install

# Criar um arquivo .env com base no modelo fornecido
PORT = 5000

DB_HOST=localhost
DB_USER=<DB_USER_ADMIN>
DB_PASSWORD=<DB_PASSWORD_ADMIN>
DB_NAME=gamificacao_thenews
DB_PORT=5432

NODE_ENV=development

JWT_SECRET=OlaMundo!Estou4qu1

# Iniciar o servidor em modo de desenvolvimento
npm run dev
```

## 🏗 Estrutura do projeto
```
backend/
│-- src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── swagger.ts
│   ├── controllers/
│   │   ├── admin.controller.ts
│   │   ├── reader.controller.ts
│   │   ├── webhook.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   ├── models/
│   │   ├── reader.model.ts
│   │   ├── newsletter.model.ts
│   │   ├── opening.model.ts
│   │   ├── streak.model.ts
│   ├── routes/
│   │   ├── admin.routes.ts
│   │   ├── reader.routes.ts
│   │   ├── webhook.routes.ts
│   ├── services/
│   │   ├── webhook.service.ts
│   ├── server.ts
│-- package.json
│-- tsconfig.json
│-- .env
```

## 📡 Endpoints principais

### 🔑 Autenticação
- `POST /reader/login` - Faz login do leitor e retorna um token JWT.

### 📬 Webhooks
- `POST /webhook` - Registra abertura de newsletter e atualiza streaks.

### 📊 Administração
- `GET /admin/metrics` - Retorna métricas de engajamento.
- `GET /admin/top-readers` - Lista os leitores mais engajados.

### 📰 Leitor
- `GET /reader/stats` - Retorna o streak do leitor autenticado.
- `GET /reader/openings` - Histórico de aberturas.
- `GET /reader/newsletter` - Retorna nome da newsletter acessada.

## 📖 Documentação da API
A API conta com uma documentação interativa no Swagger:
```
http://localhost:5000/api-docs
```

## 🔄 Webhooks
A API recebe eventos de abertura de newsletters via webhook e processa os dados para manter o sistema de gamificação atualizado.

# Frontend - Gamificação The News

## 🔎 Perguntas a serem Respondidas

### 1. **Stacks**
- **Quais as tecnologias usadas?**
  - O frontend foi desenvolvido com **React** utilizando o **Vite** como bundler para um desenvolvimento mais rápido e eficiente.
  - Utilizamos **TypeScript** para garantir tipagem segura e melhorar a manutenção do código.
  - Para a navegação, foi empregado o **React Router DOM**.
  - As requisições HTTP são feitas com **Axios**.
  - O gerenciamento de formulários é feito com **React Hook Form** e **Yup** para validação.
  - **Recharts** foi usado para exibição de gráficos no dashboard administrativo.
  - O contexto de autenticação foi gerenciado via **React Context API**.
  
- **Quais desafios enfrentou ao desenvolver?**
  - Implementação da proteção de rotas e redirecionamento adequado para usuários logados.
  - Tipagem adequada dos dados no **TypeScript**, principalmente em respostas de API assíncronas.
  - Gerenciamento do estado global de autenticação e persistência do token JWT.
  - Consumo eficiente da API, garantindo atualização de dados em tempo real.
  
- **Qual a organização escolhida e por quê?**
  - A estrutura do projeto foi organizada seguindo o padrão de separação por responsabilidade:
    - **/pages**: Contém as páginas principais da aplicação (Home, Login, Dashboard, etc.).
    - **/components**: Contém componentes reutilizáveis, como o Header.
    - **/contexts**: Gerencia o contexto de autenticação.
    - **/services**: Contém funções para consumo da API.
    - **/routes**: Arquivos para definir rotas protegidas.
    - **/styles**: Arquivos de estilos.
    
### 2. **Dados**
- **Qual a estrutura do seu SQL?**
  - A aplicação consome dados de uma API que se comunica com um banco de dados SQL (PostgreSQL). A estrutura inclui tabelas de usuários, leituras de newsletters e métricas de engajamento.

- **Como lidou com inserções e consultas?**
  - O frontend faz requisições **GET** para buscar estatísticas dos usuários e rankings.
  - As ações de login enviam **POST requests** para a API com o email do usuário.
  - O token JWT é armazenado no localStorage e adicionado aos cabeçalhos das requisições.

- **Ele é escalável? Explique.**
  - Sim, pois a separação de responsabilidades permite fácil adição de novas funcionalidades.
  - O uso de **React Context API** facilita o gerenciamento global de estado, sem depender de bibliotecas externas.
  - As requisições assíncronas com **Axios** são centralizadas, permitindo fácil manutenção.

### 3. **Testes**
- **Quais testes você realizou?**
  - Foram implementados testes com **Jest** e **Testing Library** para verificar componentes críticos, como autenticação e carregamento de dados.
  - Testes unitários garantem que as funções de requisição API retornam os dados esperados.
  - Testes manuais foram feitos para garantir a experiência do usuário e fluxos de autenticação.

- **Quanto tempo levou no desenvolvimento e testes?**
  - O desenvolvimento do frontend levou aproximadamente **3 dias**.

## 🚀 Instalação e Execução

### **1. Pré-requisitos**
Certifique-se de ter instalado:
- **Node.js** (>=16.0.0)
- **NPM** (>=8.0.0)

### **2. Clonar o repositório**
```sh
git clone https://github.com/LuisFurmiga/gamificacao-thenews.git
cd gamificacao-thenews/frontend
```

### **3. Instalar dependências**
```sh
npm install
```

### **4. Configurar variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto e defina a API base:
```sh
VITE_API_BASE_URL=http://localhost:5000
```

### **5. Executar o projeto**
```sh
npm run dev
```
A aplicação estará disponível em `http://localhost:3000`.

## 📁 Estrutura do Projeto
```
frontend/
│── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── contexts/         # Context API para autenticação
│   ├── pages/            # Páginas da aplicação
│   ├── routes/           # Rotas protegidas
│   ├── services/         # Comunicação com a API
│   ├── styles/           # Arquivos de estilo
│   ├── App.tsx           # Arquivo principal do React
│   ├── index.tsx         # Ponto de entrada do React
│── public/
│── package.json          # Dependências e scripts
│── vite.config.ts        # Configuração do Vite
│── tsconfig.json         # Configuração do TypeScript
```

## 🔒 Autenticação e Proteção de Rotas
- O sistema usa **JWT** para autenticação.
- Usuários logados são redirecionados para o dashboard.
- **Administração**: emails terminando em `@admin.com` acessam o painel administrativo.
- O `ProtectedRoute.tsx` garante que usuários não autenticados não acessem páginas restritas.

## 📊 Funcionalidades Principais
- **Home Page**: Apresentação do sistema e opção de login.
- **Login**: Autenticação por email.
- **Dashboard do Usuário**: Exibe estatísticas pessoais e histórico de leituras.
- **Dashboard Admin**: Mostra métricas de uso, ranking e gráficos de engajamento.
- **API Requests**: Feitas via Axios com headers de autenticação.

## 🛠️ Testes e Linter
Para rodar os testes automatizados:
```sh
npm run test
```
Para rodar o linter e formatar o código:
```sh
npm run lint
npm run format
```

## 🛣️ Roadmap
- **Fase 1**: Implementação das funcionalidades básicas de autenticação e dashboard ✅
- **Fase 2**: Integração com mais métricas de engajamento 📊
- **Fase 3**: Melhorias na UI/UX com novas animações e layouts 🎨
- **Fase 4**: Implementação de notificações para alertar usuários sobre novas newsletters 🔔
- **Fase 5**: Deploy contínuo e otimizações de performance 🚀

