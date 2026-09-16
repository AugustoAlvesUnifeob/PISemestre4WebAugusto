const API_URL = 'http://localhost:5000';

function obterClinicaCnpj() {

    const usuarioLogado =
        JSON.parse(localStorage.getItem('usuarioLogado'));

    return usuarioLogado
        ? usuarioLogado.clinica_cnpj
        : null;
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

        const clinica_cnpj =
            obterClinicaCnpj();

        if (!clinica_cnpj) {

            alert(
                'Não foi possível identificar a clínica.'
            );

            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/doutores/register`,
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body: JSON.stringify({
                        nome,
                        especialidade,
                        clinica_cnpj
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