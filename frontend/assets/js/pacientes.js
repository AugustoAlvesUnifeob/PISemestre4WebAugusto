const API_URL = 'http://localhost:5000';

const listaPacientes = document.getElementById('listaPacientes');
const campoPesquisa = document.getElementById('pesquisarPaciente');

let pacientes = [];

// Renderiza a lista de pacientes na tela, aplicando o filtro de pesquisa
function renderizarPacientes(filtro = '') {
    listaPacientes.innerHTML = '';

    const termo = filtro.trim().toLowerCase();

    const pacientesFiltrados = pacientes.filter((paciente) =>
        (paciente.nome || '').toLowerCase().includes(termo)
    );

    if (pacientesFiltrados.length === 0) {
        const item = document.createElement('li');
        item.classList.add('vazio');
        item.textContent = pacientes.length === 0
            ? 'Nenhum paciente cadastrado ainda.'
            : 'Nenhum paciente encontrado.';
        listaPacientes.appendChild(item);
        return;
    }

    pacientesFiltrados.forEach((paciente) => {
        const item = document.createElement('li');
        item.textContent = paciente.nome;
        item.dataset.id = paciente.idpaciente;
        listaPacientes.appendChild(item);
    });
}

// Busca os pacientes cadastrados na API
async function carregarPacientes() {
    try {
        const response = await fetch(`${API_URL}/pacientes`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao buscar pacientes.');
        }

        pacientes = data.pacientes || [];
        renderizarPacientes(campoPesquisa.value);

    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);

        listaPacientes.innerHTML = '';
        const item = document.createElement('li');
        item.classList.add('vazio');
        item.textContent = 'Não foi possível carregar os pacientes.';
        listaPacientes.appendChild(item);
    }
}

campoPesquisa.addEventListener('input', (event) => {
    renderizarPacientes(event.target.value);
});

document.getElementById('btnNovoPaciente').addEventListener('click', () => {
    window.location.href = 'cadastroPaciente.html';
});

carregarPacientes();
