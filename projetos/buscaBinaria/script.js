// Adiciona os eventos aos elementos
document.getElementById('gerarArray').addEventListener('click', gerarArray);
document.getElementById('buscarNumero').addEventListener('click', buscarNumero);
document.getElementById('numeroEscolhido').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        buscarNumero();
    }
});

// Inicializa variáveis
let array = [];
let ordemCrescente = true;  // Variável para indicar a ordem do array
toggleClass('buscarNumero', 'cor-preta', true);  // Cor preta para botão inicialmente

function ehDispositivoMovel() {
    return window.innerWidth <= 600; // Definir um limite típico para dispositivos móveis
}

async function gerarArray() {
    const set = new Set();
    const numeroDeElementos = ehDispositivoMovel() ? 8 : 20; // Decide o número de elementos

    // Continua gerando números até que o Set tenha o número correto de elementos únicos
    while (set.size < numeroDeElementos) {
        set.add(Math.floor(Math.random() * 101));
    }

    array = Array.from(set);
    toggleClass('container2', 'explicacao', true);

    document.querySelector('.container2').classList.add('explicacao');

    const textoDeExplicacao = 'pois a busca binária só funciona em um conjunto de dados que esteja ordenado em ordem crescente ou decrescente.<br>Escolha um número para iniciar a busca.';
    
    // Ordenar o array e definir a explicação
    ordemCrescente = Math.random() < 0.5;
    array.sort((a, b) => ordemCrescente ? a - b : b - a);
    const ordemTexto = ordemCrescente ? 'crescente' : 'decrescente';
    setHTML('explicacao', `Vetor gerado e ordenado em ordem ${ordemTexto}, ${textoDeExplicacao}`);

    exibirArray();
    setText('resultado', '');
    toggleDisabled('buscarNumero', false);
    setAttribute('buscarNumero', 'style', 'color: #fff');
}

function exibirArray() {
    const arrayDiv = document.getElementById('array');
    arrayDiv.innerHTML = '';
    array.forEach((num, index) => {
        const element = document.createElement('div');
        element.className = 'array-element';
        element.id = 'element-' + index;
        element.textContent = num;
        arrayDiv.appendChild(element);
    });
}

async function buscarNumero() {
    document.querySelectorAll('.array-element.azul').forEach(el => el.classList.remove('azul'));

    const numeroEscolhido = parseInt(document.getElementById('numeroEscolhido').value);
    if (isNaN(numeroEscolhido)) {
        alert('Por favor, escolha um número válido.');
        return;
    }

    let inicio = 0;
    let fim = array.length - 1;
    let encontrado = false;
    let contagemMeio = 0;

    setText('explicacao', `Iniciando a busca pelo número ${numeroEscolhido}...`);

    toggleDisabled('numeroEscolhido', true);
    toggleDisabled('buscarNumero', true);
    setAttribute('buscarNumero', 'style', 'color: #000');

    while (inicio <= fim) {
        const meio = Math.floor((inicio + fim) / 2);
        contagemMeio++;
        await destacarElemento(meio);

        const elemento = document.getElementById('element-' + meio);
        elemento.classList.remove('girar');
        void elemento.offsetWidth; // Reflow para reiniciar a animação

        if (array[meio] === numeroEscolhido) {
            elemento.classList.add('girar', 'azul');
            setHTML('explicacao', `O número foi encontrado na posição <span style="color: red;">${meio}</span>, após <b>${contagemMeio}</b> iterações.`);
            setText('resultado', `Número ${numeroEscolhido} encontrado.`);
            encontrado = true;
            break;
        } else if ((array[meio] < numeroEscolhido && ordemCrescente) || (array[meio] > numeroEscolhido && !ordemCrescente)) {
            setText('explicacao', `O número no meio (${array[meio]}) é menor que ${numeroEscolhido}. Buscando na metade superior.`);
            inicio = meio + 1;
        } else {
            setText('explicacao', `O número no meio (${array[meio]}) é maior que ${numeroEscolhido}. Buscando na metade inferior.`);
            fim = meio - 1;
        }
        await delay(3000);
    }

    if (!encontrado) {
        setText('explicacao', `O número ${numeroEscolhido} não foi encontrado no array após ${contagemMeio} iterações.`);
        setText('resultado', `Número ${numeroEscolhido} não encontrado após ${contagemMeio} iterações.`);
    }

    toggleDisabled('numeroEscolhido', false);
    toggleDisabled('buscarNumero', false);
    setAttribute('buscarNumero', 'style', 'color: #fff');
}

function destacarElemento(index1, index2) {
    return new Promise(resolve => {
        document.querySelectorAll('.array-element').forEach(el => el.classList.remove('highlight'));
        toggleClass(`element-${index1}`, 'highlight', true);
        if (index2 !== undefined) {
            toggleClass(`element-${index2}`, 'highlight', true);
        }
        setTimeout(resolve, 600);
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para adicionar ou remover classes
function toggleClass(elementId, className, add) {
    const element = document.getElementById(elementId);
    if (element) {
        add ? element.classList.add(className) : element.classList.remove(className);
    }
}

// Função para manipular texto de um elemento
function setText(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    }
}

// Função para manipular o innerHTML de um elemento
function setHTML(elementId, html) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = html;
    }
}

// Função para manipular atributos de um elemento
function setAttribute(elementId, attribute, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.setAttribute(attribute, value);
    }
}

// Função para desabilitar ou habilitar um elemento
function toggleDisabled(elementId, disabled) {
    const element = document.getElementById(elementId);
    if (element) {
        element.disabled = disabled;
    }
}
