const API_URL = 'http://localhost:5000';

function obterHeadersAutenticados() {
    const token = localStorage.getItem('@App:token');
    if (!token) {
        throw new Error('Sessão expirada. Faça login novamente.');
    }
    return { Authorization: `Bearer ${token}` };
}

document
    .getElementById('btnCadastrarProfissional')
    .addEventListener('click', async (event) => {

        event.preventDefault();

        const nome =
            document.getElementById('nome').value;

        const especialidade =
            document.getElementById('especialidade').value;

        if (!nome || !especialidade) {

            alert('Preencha todos os campos!');

            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/doutores/register`,
                {
                    method: 'POST',

                    headers: {
                        ...obterHeadersAutenticados(),
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({
                        nome,
                        especialidade
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    'Erro ao cadastrar profissional.'
                );
            }

            alert(
                'Profissional cadastrado com sucesso!'
            );

            window.location.href =
                'profissionais.html';

        } catch (error) {

            console.error(error);

            alert(error.message);

        }

    });