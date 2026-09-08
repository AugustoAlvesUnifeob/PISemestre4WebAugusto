# Cadastrar Usuário

## Descrição
Permite que novos colaboradores da empresa criem uma conta no aplicativo para acessar o sistema de monitoramento de produção.

---

## User Story

Como colaborador da empresa  
Quero criar uma conta no aplicativo  
Para acessar o sistema de monitoramento da produção.

---

## Caso de Uso

**Nome:** Cadastrar Usuário  
**Ator:** Usuário

### Fluxo Principal

1. O usuário acessa a tela de cadastro.
2. O sistema solicita nome, e-mail e senha.
3. O usuário preenche os dados.
4. O sistema valida as informações.
5. O sistema cria a conta do usuário.

### Fluxo Alternativo

**E-mail já cadastrado**

1. O usuário informa um e-mail já existente no sistema.
2. O sistema exibe mensagem de erro.
3. O cadastro não é concluído.

---

## Critérios de Aceitação

- O usuário deve informar nome, e-mail e senha.
- Todos os campos obrigatórios devem ser preenchidos corretamente.
- O sistema não deve permitir cadastro com e-mail já existente.
- As senhas devem ser armazenadas de forma segura.

---

### Diagrama de Atividade

<img width="790" height="534" alt="image" src="https://github.com/user-attachments/assets/8d01d880-388b-4556-908d-3852ed5c75c1" />

---

### Diagrama de Sequência

<img width="636" height="769" alt="image" src="https://github.com/user-attachments/assets/16ce0f01-7923-47b4-9fa6-d51e3a1e00bd" />
