const API_URL = "http://localhost:3000/generate";
const accordionData = {};

function addUrl() {
    const div = document.createElement('div');
    div.className = 'input-group mb-2';
    div.innerHTML = `<input type="text" class="form-control" placeholder="Enter URL">
                     <button class="btn btn-danger" onclick="this.parentElement.remove()">Remove</button>`;
    document.getElementById('urlContainer').appendChild(div);
}

function addComponent() {
    const div = document.createElement('div');
    div.className = 'input-group mb-2';
    div.innerHTML = `<input type="text" class="form-control" placeholder="Component Type">
                     <input type="text" class="form-control" placeholder="CSS Selector">
                     <button class="btn btn-danger" onclick="this.parentElement.remove()">Remove</button>`;
    document.getElementById('componentContainer').appendChild(div);
}

function extractJson(text) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) {
        throw new Error('JSON não encontrado na resposta.');
    }
    const jsonString = text.substring(start, end + 1);
    return JSON.parse(jsonString);
}

function downloadCypressZip(responseText) {
    let data;
    try {
        data = extractJson(responseText);
    } catch (error) {
        alert('Erro ao extrair JSON: ' + error.message);
        return;
    }

    const zip = new JSZip();

    const cypress = zip.folder('cypress');
    const e2e = cypress.folder('e2e');
    const fixtures = cypress.folder('fixtures');
    const pages = cypress.folder('pages');
    const support = cypress.folder('support');

    (data.cypress.e2e || []).forEach(file => {
        e2e.file(file.name, file.content);
    });

    (data.cypress.pages || []).forEach(file => {
        pages.file(file.name, file.content);
    });

    (data.cypress.fixtures || []).forEach(file => {
        fixtures.file(file.name, file.content);
    });

    (data.cypress.support || []).forEach(file => {
        support.file(file.name, file.content);
    });

    zip.file('cypress.config.js', data['cypress.config.js']);

    zip.generateAsync({ type: "blob" }).then(content => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "cypress-tests.zip";
        link.click();
    });
}

function createLoadingCard(title) {
    const id = title.replace(/\s/g, '');
    const accordion = document.getElementById('resultsAccordion');

    const card = document.createElement('div');
    card.className = 'card mb-3';
    card.id = `card-${id}`;
    card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <div id="content-${id}">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <span>Generating ${title}...</span>
            </div>
        </div>
    `;
    accordion.appendChild(card);
}

function transformCardToAccordion(title, content) {
    const id = title.replace(/\s/g, '');
    accordionData[id] = content;

    const card = document.getElementById(`card-${id}`);
    card.className = 'accordion-item';
    card.innerHTML = `
        <h2 class="accordion-header" id="heading${id}">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id}">
                ${title}
            </button>
        </h2>
        <div id="collapse${id}" class="accordion-collapse collapse show" data-bs-parent="#resultsAccordion">
            <div class="accordion-body">
                <div>${marked.parse(content)}</div>
                <button class="btn btn-outline-secondary mt-2" onclick="downloadFile('${title}.md', '${id}')">Download</button>
            </div>
        </div>
    `;
}

function downloadFile(filename, id) {
    const content = accordionData[id] || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

async function callBackend(prompt) {
    const response = await axios.post(API_URL, { prompt });
    return response.data.result;
}

async function generateTests() {
    document.getElementById('resultsAccordion').innerHTML = '';

    const urls = Array.from(document.querySelectorAll('#urlContainer input')).map(i => i.value).filter(v => v);
    const components = Array.from(document.querySelectorAll('#componentContainer div')).map(div => {
        const inputs = div.querySelectorAll('input');
        return { type: inputs[0]?.value, selector: inputs[1]?.value };
    }).filter(c => c.type && c.selector);
    const additionalInfo = document.getElementById('additionalInfo').value;

    const titles = ['User Stories', 'Acceptance Criteria', 'Test Scenarios', 'Cypress Code'];
    titles.forEach(title => createLoadingCard(title));

    const userStoryPrompt = gerarPromptUserStory(urls, components, additionalInfo);
    const storyResponse = await callBackend(userStoryPrompt);
    transformCardToAccordion('User Stories', storyResponse);

    const acceptanceCriteriaPrompt = gerarPromptAcceptance(storyResponse);
    const acceptanceResponse = await callBackend(acceptanceCriteriaPrompt);
    transformCardToAccordion('Acceptance Criteria', acceptanceResponse);

    const testScenariosPrompt = gerarPromptScenarios(storyResponse, acceptanceResponse);
    const scenariosResponse = await callBackend(testScenariosPrompt);
    transformCardToAccordion('Test Scenarios', scenariosResponse);

    const cypressCodePrompt = gerarPromptCypress(storyResponse, acceptanceResponse, scenariosResponse, urls, components, additionalInfo);
    const cypressResponse = await callBackend(cypressCodePrompt);
    transformCardToAccordion('Cypress Code', cypressResponse);const id = 'CypressCode';
    const btn = document.createElement('button');
    btn.className = 'btn btn-success mt-2';
    btn.innerText = 'Download Cypress ZIP';
    btn.onclick = () => downloadCypressZip(cypressResponse);

    document.getElementById(`collapse${id}`).querySelector('.accordion-body').appendChild(btn);
}

const gerarPromptUserStory = (urls, components, additionalInfo) => {
    return `
Com base nas informações abaixo, gere uma User Story no padrão ágil.

URLs:
${urls.join(', ')}

Componentes:
${components.map(c => `- ${c.tipo}: ${c.seletor}`).join('\n')}

Informações adicionais:
${additionalInfo}

Exemplos de User Story:
- US-20: I as a Quality Manager would like to create a new evaluation criteria matrix for the improvement opportunities so that I can analyze and evaluate the results according to the company's needs.
- US-17: I as the quality manager would like to edit the information, responsible parties and deadlines of the registered improvement opportunity/change so that I can update or adjust necessary data.
- US-02: As a company Employee, I would like to register an improvement opportunity, so I can analyze and evaluate its implementation needs.
`;
};


const gerarPromptAcceptance = (storyResponse) => {
    return `
Com base na seguinte User Story, gere os Acceptance Criteria necessários. Só devem ser gerados os critérios de aceite possíveis com as urls e componentes enviados.

User Story:
${storyResponse}

Exemplos de Acceptance Criteria:
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
`;
};

const gerarPromptScenarios = (storyResponse, acceptanceResponse) => {
    return `
Com base na User Story e nos critérios de aceite abaixo, gere os cenários de teste em Gherkin (BDD).

User Story:
${storyResponse}

Acceptance Criteria:
${acceptanceResponse}

Exemplos de Cenários BDD:
Scenario 1:
GIVEN I am setting up evaluation criteria
WHEN I change the matrix dimension to 5x5
AND I complete the configuration
THEN I should see opportunity for improvement with the new matrix dimension

Scenario 2:
GIVEN I am configuring a new improvement opportunity
WHEN I change the matrix dimension to 4x4
THEN I complete the configuration
AND I should see opportunities for improvement with the new matrix dimension

Scenario 3:
GIVEN that I am configuring a new improvement opportunity
WHEN I view the matrix dimension
THEN I should see that 3x3 matrix pattern
AND I complete the configuration
AND I should see improvement opportunities with the new matrix dimension

Scenario 4:
GIVEN that I am configuring evaluation criteria
WHEN I edit the quadrant labels
AND I edit the probability and impact axis labels
THEN I should see opportunity for improvement with the new updated quadrant and axis labels

Scenario 5:
GIVEN I am setting up an improvement opportunity
WHEN I close the matrix editing alert
AND I access the evaluation criteria screen again
THEN I see the alert again

Scenario 6:
GIVEN that I am editing an improvement opportunity
WHEN I try to edit evaluation criteria matrix
THEN I see that it is not possible to change the matrix dimension

Scenario 1:
GIVEN that I have an opportunity created
AND I go to the edit screen of the opportunity
WHEN I edit all the fields in my opportunity
AND save all the changes
THEN I should go to the details screen
AND I should see my edited opportunity information

Scenario 2:
GIVEN I have an opportunity created at the planning step
WHEN I edit the responsible and deadline of my and action plan and effectiveness AND I am in the task screen
THEN  I should see this new data on the task screen

Scenario 3:
GIVEN that I have an opportunity created in the implementation step
AND I go to edit screen
WHEN  I try to edit the responsible and deadline of my action plan
THEN I should see that it is not possible

Scenario 4:
GIVEN that I have an opportunity created in the effectiveness step
AND I am in the edit screen
WHEN I edit the person responsible and deadline for my effectiveness
AND I go to the task screen
THEN I should see this new data on the task screen

Scenario 5:
GIVEN that I have a finalised opportunity
AND I go to the edit screen
WHEN I try to edit the opportunity responsible step
THEN I should not see the step

Scenario 6:
GIVEN that I have an opportunity created in the effectiveness step
AND I am in the edit screen
WHEN I edit the person responsible and deadline for my effectiveness
AND I go to the task screen
THEN I should see this new data on the task screen

Scenario 7:
GIVEN that I have a finalised opportunity
AND I go to the edit screen
WHEN I try to edit the opportunity responsible step
THEN I should not see the step

Scenario 8:
GIVEN I have an opportunity created in the approve action plan step
AND I'm on the edit screen
WHEN I edit the responsible and the deadline for my action plan approve step
AND I go to the tasks screen
THEN I should see this new data on the task screen

Scenario 9:
GIVEN that I'm on the edit opportunity screen
WHEN I clear a required field
THEN I should see the save button disabled in all steps
AND the next button should always be enabled
Scenario 1:
GIVEN that I am on the tasks screen
AND I go to the new improvement opportunity page
WHEN I fill in all the required fields of the information step
AND I see the automatic code consisting of the prefix OP followed by four numbers
AND I evaluate the opportunity
AND select the person responsible for the elaboration and effectiveness evaluation
AND finalize the registration
THEN the system must show a success message
AND I should be redirected to the tasks screen
 
Scenario 2:
GIVEN that I already have an improvement opportunity created
WHEN I go to the new improvement opportunity page
THEN I should see the automatic sequential code
 
Scenario 3:
GIVEN I am on the new improvement opportunity page
WHEN I fill in all the required fields
AND add an attachment
AND finalize registration
THEN I should see the task created to elaborate the action plan
 
Scenario 4:
GIVEN that I am on the tasks screen
AND there is no task registered
WHEN I try to filter to return some task
THEN I should see the message that I have no tasks.
 
Scenario 5:
GIVEN I am on the task screen
AND I have tasks registered
WHEN click to return tasks from other users
THEN I should see the message that No results found

Scenario 6:
GIVEN I am on the “New opportunity” screen in the responsible stage
AND I add another user as the validator
WHEN I finish registering the new opportunity
THEN I should see a success toast with a link button in it
AND when I click on the link button I should be redirected to the details screen.

Scenario 7:
GIVEN that I'm on the new opportunity screen
AND I fill in all the required fields
WHEN I clear a required field
THEN I should see the next steps disabled
AND the next button disabled
`;
};

const gerarPromptCypress = (storyResponse, acceptanceResponse, scenariosResponse, urls, components, additionalInfo) => {
  return `
Com base nas informações abaixo, gere a resposta em formato json da pasta Cypress completa e funcional para ser manipulado os dados e gerado botão de download, pronta para ser executada no projeto utilizando pageObject e DRY.

os testes só deve usar as URLs e componentes informados abaixo, não deve usar nenhum outro seletor ou URL ou informação adicional.

URLs:
${urls.join(', ')}

Componentes:
${components.map(c => `- ${c.tipo}: ${c.seletor}`).join('\n')}

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
`;
};

addUrl();
addComponent();
