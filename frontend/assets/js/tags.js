const API_URL = 'http://localhost:5000';

const listaTags = document.getElementById('listaTags');
const campoPesquisa = document.getElementById('pesquisarTag'); 

let tags = [];

function obterHeadersAutenticados() {
    const token = localStorage.getItem('@App:token');
    if (!token) {
        throw new Error('Sessão expirada. Faça login novamente.');
    }
    return { Authorization: `Bearer ${token}` };
}

// Renderiza a lista de tags na tela, aplicando o filtro de pesquisa
function renderizarTags(filtro = '') {
    listaTags.innerHTML = '';

    const termo = filtro.trim().toLowerCase();

    const tagsFiltradas = tags.filter((tag) =>
        (tag.descricao || '').toLowerCase().includes(termo)
    );

    if (tagsFiltradas.length === 0) {
        const item = document.createElement('li');
        item.classList.add('vazio');
        item.textContent = tags.length === 0
            ? 'Nenhuma tag cadastrada ainda.'
            : 'Nenhuma tag encontrada.';
        listaTags.appendChild(item);
        return;
    }

    tagsFiltradas.forEach((tag) => {
        const item = document.createElement('li');
        item.textContent = tag.descricao.toUpperCase(); // Deixa em maiúsculo como na imagem
        item.dataset.id = tag.idtag;
        listaTags.appendChild(item);
    });
}

// Carregar as tags já cadastradas na API
async function carregarTags() {
    try {
        const response = await fetch(`${API_URL}/tag/listarByCNPJ`, {
            headers: obterHeadersAutenticados()
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao buscar tags.');
        }

        tags = data.tags || [];
        renderizarTags(campoPesquisa.value);

    } catch (error) {
        console.error('Erro ao carregar tags:', error);

        listaTags.innerHTML = '';
        const item = document.createElement('li');
        item.classList.add('vazio');
        item.textContent = 'Não foi possível carregar as tags.';
        listaTags.appendChild(item);
    }
}

// Event Listener
campoPesquisa.addEventListener('input', (event) => {
    renderizarTags(event.target.value);
});

// Evento do botão "+" para ir para a tela de cadastro
document
    .getElementById('btnNovaTag')
    .addEventListener('click', () => {
        window.location.href = 'cadastroTag.html';
    });

carregarTags();
