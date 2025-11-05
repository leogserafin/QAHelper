const API_URL =
  (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/generate'                 // DEV
    : 'https://qahelper.onrender.com/generate';     // PROD
const accordionData = {};

import { 
  buildUserStoryPrompt, 
  buildAcceptancePrompt, 
  buildScenariosPrompt, 
  buildCypressPrompt 
} from './prompts.js';

function addUrl() {
    const div = document.createElement('div');
    div.className = 'input-group mb-2';
    div.innerHTML = `<input type="text" class="form-control" placeholder="Enter URL">
                     <button class="btn btn-danger" onclick="this.parentElement.remove()">Remover</button>`;
    document.getElementById('urlContainer').appendChild(div);
}

function addComponent() {
    const div = document.createElement('div');
    div.className = 'input-group mb-2';
    div.innerHTML = `<input type="text" class="form-control" placeholder="Component Type">
                     <input type="text" class="form-control" placeholder="CSS Selector">
                     <button class="btn btn-danger" onclick="this.parentElement.remove()">Remover</button>`;
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

    const userStoryPrompt = buildUserStoryPrompt({ urls, components, additionalInfo });
    const storyResponse = await callBackend(userStoryPrompt);
    transformCardToAccordion('User Stories', storyResponse);

    const acceptanceCriteriaPrompt = buildAcceptancePrompt({ storyResponse, urls, components, additionalInfo });
    const acceptanceResponse = await callBackend(acceptanceCriteriaPrompt);
    transformCardToAccordion('Acceptance Criteria', acceptanceResponse);

    const testScenariosPrompt = buildScenariosPrompt({ storyResponse, acceptanceResponse, urls, components, additionalInfo });
    const scenariosResponse = await callBackend(testScenariosPrompt);
    transformCardToAccordion('Test Scenarios', scenariosResponse);

    const cypressCodePrompt = buildCypressPrompt({ storyResponse, acceptanceResponse, scenariosResponse, urls, components, additionalInfo });
    const cypressResponse = await callBackend(cypressCodePrompt);
    transformCardToAccordion('Cypress Code', cypressResponse);const id = 'CypressCode';
    const btn = document.createElement('button');
    btn.className = 'btn btn-success mt-2';
    btn.innerText = 'Download Cypress ZIP';
    btn.onclick = () => downloadCypressZip(cypressResponse);

    document.getElementById(`collapse${id}`).querySelector('.accordion-body').appendChild(btn);
}

addUrl();
addComponent();

window.addUrl = addUrl;
window.addComponent = addComponent;
window.downloadFile = downloadFile;
window.generateTests = generateTests;
