
# Test Generator - Aplicação Web com OpenAI API

Esta aplicação permite gerar **User Stories**, **Critérios de Aceite**, **Cenários de Teste (BDD)** e **Testes Automatizados em Cypress**, utilizando a API da OpenAI.

## Tecnologias Utilizadas
- Frontend: HTML, CSS (Bootstrap) e JavaScript
- Backend: Node.js com Express, Axios e dotenv
- API: OpenAI (`gpt-4o`)
## Estrutura do Projeto
```
test-generator/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── index.html
│   └── script.js
└── README.md
```

## Configuração e Execução

### Pré-requisitos:
- Node.js instalado (recomendado v18 ou superior)

### Instalar dependências do backend:
```bash
cd backend
npm install
```

### Configurar a API Key da OpenAI:
Crie ou edite o arquivo `.env` na pasta backend:
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Executar o servidor backend:
```bash
cd backend
npm start
```
Backend rodando em: `http://localhost:3000`

### Instalar dependências do frontend:
```bash
cd backend
npm install
```

### Executar o frontend:
Para executar o front-end com um servidor local (evitando problemas de CORS), utilize:

```bash
cd frontend
npm start
```
Acesse `http://localhost:8080`, se essa porta não estiver disponível consultar qual foi a porta utilizada no terminal

## Fluxo de Funcionamento
1. Preencha URLs, Componentes e Informações adicionais.
2. Clique em "Generate Tests".
3. São geradas sequencialmente:
   - User Stories
   - Acceptance Criteria
   - Test Scenarios (BDD)
   - Cypress Code
4. Cada etapa tem loading individual, vira um accordion com botão de download.

## Autor
Leonardo Gonçalves Serafin
