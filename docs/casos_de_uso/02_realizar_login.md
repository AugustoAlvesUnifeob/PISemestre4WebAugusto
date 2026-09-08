# Realizar Login

## Descrição
Permite que usuários cadastrados acessem o sistema utilizando e-mail e senha.

---

## User Story

Como usuário do sistema  
Quero realizar login com e-mail e senha  
Para acessar o sistema de monitoramento de produção.

---

## Caso de Uso

**Nome:** Realizar Login  
**Ator:** Usuário

### Fluxo Principal

1. O usuário abre o aplicativo.
2. O sistema exibe a tela de login.
3. O usuário insere e-mail e senha.
4. O sistema valida as credenciais.
5. O sistema permite acesso ao dashboard.

### Fluxo Alternativo

**Senha incorreta**

1. O usuário insere senha incorreta.
2. O sistema exibe mensagem de erro.
3. O usuário pode tentar novamente.

---

## Critérios de Aceitação

- O sistema deve validar e-mail e senha.
- Após 5 tentativas inválidas a conta deve ser bloqueada temporariamente.
- Usuários inativos por mais de 90 dias devem autenticar novamente.

---

### Diagrama de Atividade

<img width="775" height="574" alt="image" src="https://github.com/user-attachments/assets/c6c0a944-cb7a-41bb-8c82-cdc0a9300af0" />

---

### Diagrama de Sequência

<img width="610" height="604" alt="image" src="https://github.com/user-attachments/assets/446641b2-0bd9-4c4b-80bf-7a14f7804e9a" />

