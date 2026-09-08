document.getElementById('btnEntrar').addEventListener('click', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    if (!email || !senha) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/users/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao realizar login.');
        }

        // Salva as informações do usuário logado na sessão do navegador pra depois(??)
        localStorage.setItem('usuarioLogado', JSON.stringify(data.user));

        alert('Login efetuado com sucesso!');
        
        window.location.href = 'frontend/views/inicio.html'; 

    } catch (error) {
        console.error('Erro de login:', error);
        alert(error.message);
    }

});