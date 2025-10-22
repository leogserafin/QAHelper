export const CYPRESS_EXAMPLE_SNIPPET = `
// examples/pages/LoginPage.js
export default class LoginPage {
  username = '#username';
  password = '#password';
  submit   = '#login';

  visit(base = '/') { cy.visit(base); }
  fill(user, pass)  { cy.get(this.username).type(user); cy.get(this.password).type(pass); }
  submitForm()      { cy.get(this.submit).click(); }
}

// examples/e2e/login.cy.js
import LoginPage from '../pages/LoginPage';

const page = new LoginPage();

describe('Login (exemplo enxuto com Page Object + DRY)', () => {
  it('realiza login e valida redirecionamento', () => {
    page.visit('/');
    page.fill('user', '***'); // substitua pelas credenciais de teste
    page.submitForm();
    cy.url().should('include', '/home');
  });
});
`;

export const EXAMPLES_USER_STORY = [
  "US-20: I as a Quality Manager would like to create a new evaluation criteria matrix for the improvement opportunities so that I can analyze and evaluate the results according to the company's needs.",
  "US-17: I as the quality manager would like to edit the information, responsible parties and deadlines of the registered improvement opportunity/change so that I can update or adjust necessary data.",
  "US-02: As a company Employee, I would like to register an improvement opportunity, so I can analyze and evaluate its implementation needs."
];

export const EXAMPLES_ACCEPTANCE_TEXT = `
It should be possible to change the evaluation criteria matrix dimension on the improvement opportunities configuration
It should be possible to choose the matrix dimension between
3x3
4x4
5x5
It should be possible to edit the label quadrants
It should be possible to edit the label of the probability and impact axes
It should be possible to change the result of each quadrant by clicking on it
It should not be possible to change the matrix dimension after the improvement opportunities is configured
It should have and alert saying that is not possible to edit the matrix dimension after the improvement opportunities is configured
It should hide if the user presses the 'X'
It should be possible to drag only the evaluation criteria matrix while in mobile or tablet
It should have an info icon saying what is possible to edit on the evaluation criteria matrix
In mobile it should be only a subtitle

From the details screen it should be possible:
Edit the registration information
information of the improvement opportunity/change
Responsible for the steps and deadlines if still in progress

Description of the improvement opportunity
Text fields it should have a 500 character limit
Process
Organizational Unit
Origin
Internal Environment
External Environment
Type of improvement opportunity
Commercial
Technological
Operational
Environmental
Economic
Compliance
Health and Safety
It should be possible to insert an attachment
Improvement Opportunity Code
It should be limited to 10 characters
It should suggest an automatic code consisting of the prefix OP followed by 4 sequential numbers (e.g. OP0001, OP0002)
It should be possible to describe change management information
Text fields should have a 500 character limit
Expected results
Maintaining the integrity of the QMS
Resource availability
Allocation/Reallocation of authorities and responsibilities
It should be required to select the desired result quadrant
It should be necessary to select the person responsible for:
Drawing up the action plan
Evaluation of effectiveness
It should be necessary to inform the deadline for the demands
The Deadline should be in quantity of days
It should have 30 days by default
It should be redirected to the tasks screen when I save the improvement opportunity
It should return the success toast
`.trim();


const joinUrls = (urls = []) => urls.filter(Boolean).join(', ');
const listComponents = (components = []) =>
  components.map(c => `- ${c.tipo}: ${c.seletor}`).join('\n');
const safeText = (t) => (t ?? '').toString().trim();


export function buildUserStoryPrompt({ urls = [], components = [], additionalInfo = '' }) {
  return `Responda em PT-BR: Com base nas informações abaixo, gere uma User Story no padrão ágil.

URLs:
${joinUrls(urls)}

Componentes:
${listComponents(components)}

Informações adicionais:
${safeText(additionalInfo)}

Exemplos de User Story:
- ${EXAMPLES_USER_STORY.join('\n- ')}
`;
}

export function buildAcceptancePrompt({ storyResponse, urls = [], components = [], additionalInfo = '' }) {
  return `Responda em PT-BR: Com base na seguinte User Story, gere os Acceptance Criteria (critérios de aceite) detalhados.
Considere somente as URLs, componentes e informações adicionais informadas. Não invente campos, URLs ou seletores que não estejam abaixo.

User Story:
${safeText(storyResponse)}

Contexto limitado a:
URLs: ${joinUrls(urls)}
Componentes:
${listComponents(components)}
Informações adicionais:
${safeText(additionalInfo)}

Exemplos de critérios de aceite:
${EXAMPLES_ACCEPTANCE_TEXT}
`;
}

export function buildScenariosPrompt({ storyResponse, acceptanceResponse, urls = [], components = [], additionalInfo = '' }) {
  return `Responda em PT-BR: Com base na User Story e nos critérios de aceite abaixo, gere os cenários de teste em Gherkin (BDD). 
Use DADO/QUANDO/ENTÃO em portugues e mantenha os cenários focados apenas no escopo fornecido (URLs, componentes, informações adicionais).

User Story:
${safeText(storyResponse)}

Acceptance Criteria:
${safeText(acceptanceResponse)}

Contexto limitado a:
URLs: ${joinUrls(urls)}
Componentes:
${listComponents(components)}
Informações adicionais:
${safeText(additionalInfo)}
`;
}


export function buildCypressPrompt({ storyResponse, acceptanceResponse, scenariosResponse, urls = [], components = [], additionalInfo = '' }) {
  return `
Responda em PT-BR: Com base nas informações abaixo, gere a resposta em formato json da pasta Cypress completa e funcional para ser manipulado os dados e gerado botão de download, pronta para ser executada no projeto utilizando pageObject e DRY.

os testes só deve usar as URLs e componentes informados abaixo, não deve usar nenhum outro seletor ou URL ou informação adicional.

URLs:
${urls.join(', ')}

Componentes com seletores juntos, devem ser utilizados esses seletores em específico para os testes gerados sem a necessidade de alteração posterior:
${components.map(c => `- ${c.type}: ${c.selector}`).join('\n')}

Informações adicionais:
${additionalInfo}

A estrutura da pasta Cypress deve conter:
- cypress/
  ├── e2e/
  ├── fixtures/
  ├── pages/
  ├── support/
- cypress.config.js
A resposta deve ser em formato json, contendo o seguinte formato:
{
  "cypress": {
    "e2e": [
        {
          "name": "test_spec.cy.js",
          "content": "Conteúdo do arquivo de teste"
        }
      ],
    "fixtures": [],
    "pages": [
        {
          "name": "test_spec.js",
          "content": "Conteúdo do arquivo de teste"
        }],
    "support": [
        {
          "name": "e2e.js",
          "content": "Conteúdo do arquivo de comandos"
        }
      ]
  },
  "cypress.config.js": "Conteúdo do arquivo de configuração"
}
User Story:
${storyResponse}

Acceptance Criteria:
${acceptanceResponse}

Test Scenarios:
${scenariosResponse}

Exemplos de testes Cypress:
${CYPRESS_EXAMPLE_SNIPPET}
`;
}