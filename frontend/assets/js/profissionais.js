const API_URL = 'http://localhost:5000';

const listaProfissionais = document.getElementById('listaProfissionais');
const campoPesquisa = document.getElementById('pesquisarProfissional');

let profissionais = [];

function renderizarProfissionais(filtro = '') {

    listaProfissionais.innerHTML = '';

    const termo = filtro.trim().toLowerCase();

    const profissionaisFiltrados = profissionais.filter((profissional) =>
        (profissional.nome || '').toLowerCase().includes(termo)
    );

    if (profissionaisFiltrados.length === 0) {

        const item = document.createElement('li');

        item.classList.add('vazio');

        item.textContent = profissionais.length === 0
            ? 'Nenhum profissional cadastrado ainda.'
            : 'Nenhum profissional encontrado.';

        listaProfissionais.appendChild(item);

        return;
    }

    profissionaisFiltrados.forEach((profissional) => {

        const item = document.createElement('li');

        item.textContent =
            `${profissional.nome} - ${profissional.especialidade}`;

        listaProfissionais.appendChild(item);

    });

}

async function carregarProfissionais() {

    try {

        const response = await fetch(`${API_URL}/doutores`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao buscar profissionais.');
        }

        profissionais = data.doutores || [];

        renderizarProfissionais(campoPesquisa.value);

    } catch (error) {

        console.error(error);

        listaProfissionais.innerHTML = '';

        const item = document.createElement('li');

        item.classList.add('vazio');

        item.textContent =
            'Não foi possível carregar os profissionais.';

        listaProfissionais.appendChild(item);

    }

}

campoPesquisa.addEventListener('input', (event) => {
    renderizarProfissionais(event.target.value);
});

document
    .getElementById('btnNovoProfissional')
    .addEventListener('click', () => {

        window.location.href =
            'cadastroProfissional.html';

    });

carregarProfissionais();