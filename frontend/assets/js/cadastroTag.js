const API_URL = 'http://localhost:5000';

// Função para pegar o CNPJ
function obterClinicaCnpj() {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    return usuarioLogado ? 
    usuarioLogado.clinica_cnpj : 
    null;
}

// Cadastro Tags
document.getElementById('btnCadastrarTag').addEventListener('click', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value; // ID do input de nome

    // Nome vazio ou diferente = retorna alerta
    if (!nome) {
        alert('Por favor, preencha o nome da tag!');
        return;
    }
     
    const clinica_cnpj = obterClinicaCnpj();

    // Clinica vazia ou diferente = retorna alerta
    if (!clinica_cnpj) {
        alert('Não foi possível identificar a clínica. Faça login novamente.');
        return;
    }

    // Requisição api
    try {
        const response = await fetch(`${API_URL}/tags/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: nome,
                clinica_cnpj
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const msg = data.message || (data.errors && data.errors[0]?.msg) || JSON.stringify(data);
            throw new Error(msg);
        }

        alert('Tag cadastrada com sucesso!');
        window.location.href = 'tags.html'; // Volta para a listagem

    } catch (error) {
        console.error('Erro ao cadastrar tag:', error);
        alert(error.message);
    }
});