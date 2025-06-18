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

    const cypressCodePrompt = gerarPromptCypress(scenariosResponse);
    const cypressResponse = await callBackend(cypressCodePrompt);
    transformCardToAccordion('Cypress Code', '```javascript\n' + cypressResponse + '\n```');
}

function gerarPromptUserStory(urls, components, additionalInfo) {
    return `Com esses dados de url, componentes e informações adicionais sobre o meu sistema gere um título de história de usuário.\n\nURL: ${urls.join(', ')}\n\nComponentes:\n${components.map(c => `- ${c.type}: ${c.selector}`).join('\n')}\n\nInformação adicional:\n${additionalInfo}\n`;
}

function gerarPromptAcceptance(storyResponse) {
    return `Utilizando esses critérios de aceite como base, crie os critérios de aceite para os dados enviados anteriormente:\n\nHistória de usuário:\n${storyResponse}\n`;
}

function gerarPromptScenarios(storyResponse, acceptanceResponse) {
    return `Utilizando os critérios de aceite abaixo, gere cenários de testes BDD para o sistema descrito:\n\nHistória de usuário:\n${storyResponse}\n\nCritérios de aceite:\n${acceptanceResponse}\n`;
}

function gerarPromptCypress(scenariosResponse) {
    return `Utilizando esses cenários de teste:\n\n${scenariosResponse}\n\nGere os testes automatizados em Cypress utilizando PageObject e boas práticas de DRY.`;
}

addUrl();
addComponent();
