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
  "US-X: Como um usuário responsável pela qualidade, desejo criar uma matriz de critérios de avaliação para oportunidades de melhoria, para que os resultados possam ser analisados e priorizados adequadamente.",
  "US-X: Como um usuário autorizado, desejo modificar os detalhes, responsáveis e prazos de uma oportunidade de melhoria registrada, para que as informações reflitam o planejamento atual.",
  "US-X: Como um usuário, desejo registrar uma oportunidade de melhoria, para que ela possa ser avaliada e priorizada."
];

export const EXAMPLES_ACCEPTANCE_TEXT = `
Ex1:
* O usuário deve conseguir **escolher a dimensão da matriz** no momento da configuração.
* As opções de dimensão disponíveis devem ser:
  * 3×3
  * 4×4
  * 5×5
* Os **rótulos internos da matriz** devem ser editáveis.
* Os **rótulos dos eixos** da matriz devem ser editáveis.
* O **valor exibido em cada célula** deve poder ser alterado ao clicar sobre ela.
* Após a matriz ser configurada pela primeira vez, **a dimensão não pode mais ser alterada**.
* Se houver tentativa de mudar a dimensão posteriormente, **o sistema deve exibir uma mensagem informativa de bloqueio**.
* A mensagem informativa deve ser possível de **fechar pelo botão de encerramento (“X”)**.
* Em dispositivos móveis ou tablets, deve ser possível **mover somente a matriz na tela**, sem interferir em outros elementos.
* Deve existir um **ícone de ajuda** informando quais partes da matriz são editáveis.
* Em modo móvel, o texto de ajuda deve ser exibido apenas como **uma breve legenda abaixo da matriz**.

Ex2:
* A partir da tela de detalhes, deve ser possível **editar as informações previamente registradas** pelo usuário.
* A edição deve permitir **alterar responsáveis e prazos** de itens que **ainda estejam em andamento**.
* Caso o item **não esteja mais em andamento**, os campos de responsável e prazo devem **permanecer bloqueados** para edição.

Ex3:
* Campos de **texto** devem permitir edição de informações adicionais do registro
* Campos de texto devem possuir **limite de 500 caracteres**
* Devem existir campos para seleção de **categorias relacionadas ao item**
  (ex.: Categoria A, Categoria B, Categoria C…)
* Devem existir campos para indicar **localidade ou setor associado ao item**
  (informação organizacional genérica, sem dados pessoais)
* Deve ser possível **anexar um arquivo** ao registro
* O **código identificador** do item deve:
  * possuir **limite de 10 caracteres**
  * ser **sugerido automaticamente** pelo sistema
  * seguir um **formato sequencial padronizado** com prefixo e numeração (ex.: XX0001, XX0002), sem associação a dados reais
* Deve ser possível adicionar **informações complementares** relacionadas ao item
  (mantendo o limite de 500 caracteres por campo)
* O usuário deve **selecionar um resultado desejado** associado ao item
* Deve ser necessário **definir responsáveis por atividades** relacionadas ao registro
  (sem definição de cargos ou funções reais)
* Deve ser necessário **informar um prazo** em **dias inteiros**
* O prazo deve vir **predefinido com 30 dias**, podendo ser alterado
* Ao salvar as alterações, o usuário deve ser **redirecionado para a área onde as atividades estão listadas**
* Após salvar com sucesso, o sistema deve **exibir uma notificação de confirmação** ao usuário
`.trim();

export const EXAMPLES_SCENARIOS_TEXT = `
Ex1:
**Cenário 1 — Configurar matriz 5×5**
DADO QUE estou configurando uma matriz ajustável
QUANDO altero a dimensão para 5×5
E finalizo a configuração
ENTÃO devo visualizar a matriz com a dimensão 5×5 aplicada

**Cenário 2 — Configurar matriz 4×4**
DADO QUE estou configurando uma matriz ajustável
QUANDO altero a dimensão para 4×4
E finalizo a configuração
ENTÃO devo visualizar a matriz com a dimensão 4×4 aplicada

**Cenário 3 — Dimensão inicial padrão**
DADO QUE estou configurando uma matriz ajustável
QUANDO verifico a dimensão da matriz
ENTÃO devo visualizar inicialmente a matriz no padrão 3×3
E ao finalizar a configuração
ENTÃO devo visualizar a matriz atualizada conforme a seleção realizada

**Cenário 4 — Editar rótulos**
DADO QUE estou configurando uma matriz ajustável
QUANDO edito os rótulos das células
E edito os rótulos dos eixos
ENTÃO devo visualizar os rótulos atualizados na matriz

**Cenário 5 — Reexibição do alerta**
DADO QUE estou configurando uma matriz ajustável
QUANDO fecho o alerta relacionado à edição da matriz
E retorno para a tela da matriz
ENTÃO o alerta deve ser exibido novamente

**Cenário 6 — Impedir mudança da dimensão após configuração**
DADO QUE estou editando um item já configurado
QUANDO tento alterar a dimensão da matriz
ENTÃO devo visualizar uma mensagem informando que a alteração não é permitida

Ex2:
**Cenário 1 — Atualização de dados**
DADO QUE existe um item cadastrado
E acesso a tela de edição
QUANDO altero os campos permitidos
E salvo as alterações
ENTÃO devo ser direcionado para a tela de detalhes
E visualizar as informações atualizadas

**Cenário 2 — Edição permitida durante andamento**
DADO QUE existe um item que ainda permite edições
QUANDO altero responsáveis e prazos
E acesso a lista de atividades
ENTÃO devo visualizar os dados atualizados corretamente

**Cenário 3 — Edição bloqueada quando não permitido**
DADO QUE existe um item em estado que bloqueia edições
E estou na tela de edição
QUANDO tento alterar responsáveis e prazos
ENTÃO o sistema deve impedir a edição

**Cenário 4 — Atualização refletida na lista**
DADO QUE existe um item editável
E acesso a tela de edição
QUANDO atualizo responsáveis e prazos
E retorno à lista de atividades
ENTÃO os novos dados devem ser exibidos corretamente

**Cenário 5 — Campos ocultos quando não permitido editar**
DADO QUE existe um item finalizado
E estou na tela de edição
QUANDO busco campos relacionados a responsabilidades
ENTÃO esses campos não devem ser apresentados

**Cenário 6 — Validação de campo obrigatório**
DADO QUE estou editando um item
QUANDO limpo um campo obrigatório
ENTÃO o botão de salvar deve ser desabilitado
E a navegação para as próximas etapas também deve ser bloqueada

Ex3:
**Cenário 1 — Cadastro com sucesso**
DADO QUE estou criando um novo item
E estou na primeira etapa do cadastro
QUANDO preencho todos os campos obrigatórios
E visualizo um código gerado automaticamente
E finalizo o cadastro
ENTÃO o sistema deve exibir uma mensagem de sucesso
E devo ser direcionado para a lista de itens

**Cenário 2 — Código sequencial automático**
DADO QUE já existem itens cadastrados
QUANDO inicio um novo cadastro
ENTÃO devo visualizar um novo código sequencial sugerido automaticamente

**Cenário 3 — Cadastro com anexo**
DADO QUE estou criando um novo item
QUANDO preencho os campos obrigatórios
E adiciono um anexo ao item
E finalizo o cadastro
ENTÃO devo visualizar uma tarefa/atividade associada ao item criado

**Cenário 4 — Lista vazia**
DADO QUE estou na lista de itens
E não existem registros cadastrados
QUANDO tento aplicar um filtro
ENTÃO devo visualizar uma mensagem informando que não há resultados

**Cenário 5 — Filtro sem retorno**
DADO QUE estou na lista de itens
E existem registros cadastrados
QUANDO aplico um filtro sem correspondência
ENTÃO devo visualizar uma mensagem informando que nenhum resultado foi encontrado

**Cenário 6 — Mensagem com link para detalhes**
DADO QUE estou cadastrando um novo item
E adiciono um usuário relacionado ao registro
QUANDO finalizo o cadastro
ENTÃO o sistema deve exibir mensagem de sucesso com link de acesso
E ao clicar no link devo ser direcionado para a tela de detalhes

**Cenário 7 — Bloqueio quando campo obrigatório está vazio**
DADO QUE estou preenchendo um novo item
E completei todos os campos obrigatórios
QUANDO removo um campo obrigatório
ENTÃO o botão de salvar deve ser desabilitado
E a navegação para as próximas etapas deve ser bloqueada
`;

const joinUrls = (urls = []) => urls.filter(Boolean).join(', ');
const listComponents = (components = []) =>
  components.map(c => `- ${c.type}: ${c.selector}`).join('\n');
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


Exemplos de cenários de teste:
${EXAMPLES_SCENARIOS_TEXT}
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