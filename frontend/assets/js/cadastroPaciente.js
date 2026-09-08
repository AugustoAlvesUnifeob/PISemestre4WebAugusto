const API_URL = 'http://localhost:5000';

const selectTag = document.getElementById('tag');
const selectPlano = document.getElementById('plano');

// Recupera os dados da clínica do usuário logado
function obterClinicaCnpj() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    return usuarioLogado ? usuarioLogado.clinica_cnpj : null;
}

// Preenche um <select> com os itens vindos da API
function preencherSelect(selectElement, itens, campoValor, campoTexto) {
    itens.forEach((item) => {
        const option = document.createElement('option');
        option.value = item[campoValor];
        option.textContent = item[campoTexto];
        selectElement.appendChild(option);
    });
}

// Carrega as Tags cadastradas da clínica
async function carregarTags() {
    try {
        const response = await fetch(`${API_URL}/tags`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao buscar tags.');
        }

        preencherSelect(selectTag, data.tags || [], 'idtag', 'descricao');

    } catch (error) {
        console.error('Erro ao carregar tags:', error);
    }
}

// Carrega os Planos cadastrados da clínica
async function carregarPlanos() {
    try {
        const response = await fetch(`${API_URL}/planos`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao buscar planos.');
        }

        preencherSelect(selectPlano, data.planos || [], 'idplano', 'descricao');

    } catch (error) {
        console.error('Erro ao carregar planos:', error);
    }
}

document.getElementById('btnCadastrarPaciente').addEventListener('click', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const complemento = document.getElementById('complemento').value;
    const tag_idtag = selectTag.value;
    const plano_idplano = selectPlano.value;

    if (!nome || !cpf || !telefone || !email) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }

    const clinica_cnpj = obterClinicaCnpj();

    if (!clinica_cnpj) {
        alert('Não foi possível identificar a clínica. Faça login novamente.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/pacientes/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome,
                cpf,
                telefone,
                email,
                complemento,
                tag_idtag,
                plano_idplano,
                clinica_cnpj
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const msg = data.message || (data.errors && data.errors[0]?.msg) || JSON.stringify(data);
            throw new Error(msg);
        }

        alert('Paciente cadastrado com sucesso!');
        window.location.href = 'pacientes.html';

    } catch (error) {
        console.error('Erro ao cadastrar paciente:', error);
        alert(error.message);
    }
});

carregarTags();
carregarPlanos();
