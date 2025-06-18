
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
npm start
```
Backend rodando em: `http://localhost:3000`

### Executar o frontend:
Método mais simples:
- Abra `frontend/index.html` diretamente no navegador.

Método recomendado (evitar problemas de CORS):
```bash
cd frontend
npx http-server
```
Acesse `http://localhost:8080`

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
