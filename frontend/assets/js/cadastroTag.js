const API_URL = 'http://localhost:5000';

function obterHeadersAutenticados() {
    const token = localStorage.getItem('@App:token');
    if (!token) {
        throw new Error('Sessão expirada. Faça login novamente.');
    }
    return { Authorization: `Bearer ${token}` };
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
     
    // Requisição api
    try {
        const response = await fetch(`${API_URL}/tag/register`, {
            method: 'POST',
            headers: {
                ...obterHeadersAutenticados(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                descricao: nome
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