# Requisitos Funcionais (RF)

Os requisitos funcionais descrevem as funcionalidades que o EasyClinic deve oferecer para administrar clínicas, usuários, pacientes, profissionais e consultas. Este documento define o comportamento esperado para implementação e validação.

O **master** administra a clínica, colaboradores, profissionais, tags, planos e inativações. O **atendente** cadastra e atualiza pacientes e opera a agenda. Ambos consultam os dados autorizados da própria clínica. Pacientes não possuem acesso próprio ao sistema neste escopo.

Prontuário, prescrição, diagnóstico e faturamento não fazem parte desta versão. Os requisitos de qualidade estão em [Requisitos Não Funcionais](rnf.md).

## RF01 — Cadastro inicial da clínica

O sistema deve cadastrar nome, CNPJ e primeiro usuário master; criar tag Geral e plano Particular sem desconto. O cadastro deve solicitar também nome, e-mail e senha do primeiro usuário master.

**Critério de aceite:** Todos os quatro registros são criados numa transação; qualquer falha desfaz o conjunto.

## RF02 — Dados da clínica

O sistema deve permitir ao master consultar e alterar o nome da sua clínica.

**Critério de aceite:** O CNPJ é identificador imutável na operação comum; outra clínica não pode ser alterada.

## RF03 — Autenticação

O sistema deve permitir acesso por e-mail e senha de usuário ativo.

**Critério de aceite:** Credenciais válidas emitem sessão; dados inválidos retornam mensagem genérica e não liberam acesso.

## RF04 — Encerramento da sessão

O sistema deve disponibilizar a ação Sair e solicitar novo login após expiração.

**Critério de aceite:** Sair revoga as sessões do usuário por versao_sessao; tokens expirados ou revogados recebem rejeição.

## RF05 — Solicitação de recuperação

O sistema deve enviar link de recuperação ao e-mail cadastrado, quando houver conta ativa.

**Critério de aceite:** A resposta pública é igual para e-mail existente ou inexistente; o link vale por 30 minutos.

## RF06 — Redefinição de senha

O sistema deve permitir nova senha mediante token de recuperação válido e não utilizado. O token deve ser aleatório, de uso único, e somente seu hash deve ser armazenado.

**Critério de aceite:** A troca consome os tokens pendentes e revoga sessões; token expirado ou reutilizado é rejeitado.

## RF07 — Edição do próprio perfil

O sistema deve permitir ao usuário alterar nome, e-mail e senha, com confirmação da senha atual para dados de acesso.

**Critério de aceite:** E-mail duplicado é recusado; alterar credenciais revoga sessões. Perfil e clínica não são editáveis por esse fluxo.

## RF08 — Cadastro de colaboradores

O sistema deve permitir ao master cadastrar usuários master ou atendente na própria clínica.

**Critério de aceite:** O vínculo vem da sessão; cadastro em outra clínica ou por atendente é rejeitado.

## RF09 — Gestão de colaboradores

O sistema deve permitir ao master listar usuários, alterar nome e perfil e inativar acessos.

**Critério de aceite:** O último master ativo não pode ser rebaixado ou inativado; mudanças de acesso revogam sessões.

## RF10 — Cadastro de paciente

O sistema deve registrar nome, CPF, e-mail, tag e plano; aceitar telefone e complemento opcionais.

**Critério de aceite:** CPF duplicado na clínica é recusado; tag e plano devem estar ativos e pertencer à mesma clínica.

## RF11 — Consulta de pacientes

O sistema deve listar pacientes da clínica e permitir pesquisa por nome ou CPF e filtro por situação.

**Critério de aceite:** A consulta é paginada e nunca retorna registros de outra clínica.

## RF12 — Atualização de paciente

O sistema deve permitir edição dos dados cadastrais e troca de tag ou plano.

**Critério de aceite:** A atualização mantém o identificador e os agendamentos; aplica as mesmas validações do cadastro.

## RF13 — Inativação de paciente

O sistema deve permitir ao master inativar e reativar o paciente sem apagar consultas anteriores.

**Critério de aceite:** Inativação é recusada se houver consulta futura não cancelada; inativo não recebe novo agendamento.

## RF14 — Cadastro de profissional

O sistema deve permitir ao master registrar nome, especialidade e documento profissional completo.

**Critério de aceite:** Documento repetido na mesma clínica é recusado; conselho e UF integram o documento quando aplicáveis.

## RF15 — Consulta de profissionais

O sistema deve listar profissionais da clínica por nome, especialidade e situação.

**Critério de aceite:** O resultado é paginado e o cadastro inativo é identificado.

## RF16 — Manutenção de profissional

O sistema deve permitir ao master editar dados, inativar e reativar profissionais.

**Critério de aceite:** A inativação preserva o histórico e é recusada enquanto existirem consultas futuras não canceladas.

## RF17 — Gestão de tags

O sistema deve permitir ao master cadastrar, editar, listar e inativar classificações administrativas.

**Critério de aceite:** Descrição única por clínica; tags inativas permanecem no histórico e não entram em novas associações.

## RF18 — Gestão de planos

O sistema deve permitir ao master manter planos com desconto nenhum, percentual ou em reais, além de isenção. O desconto percentual deve estar entre 0 e 100; o desconto em reais não pode ser negativo. Ausência de desconto exige valor zero. A isenção exige tipo nenhum e valor zero. Não há cálculo de cobrança neste escopo.

**Critério de aceite:** Valor e unidade são consistentes; isenção não acumula desconto. Planos inativos não entram em novas associações.

## RF19 — Agendamento de consulta

O sistema deve permitir selecionar paciente e profissional ativos e informar início e término. O término deve ser posterior ao início. Uma consulta pode começar exatamente quando outra termina. Consultas canceladas não bloqueiam horário. As datas devem ser armazenadas em UTC e exibidas no fuso America/Sao_Paulo.

**Critério de aceite:** Os vínculos pertencem à clínica; o início não está no passado e não existe sobreposição para profissional ou paciente.

## RF20 — Agenda semanal

O sistema deve exibir as consultas da clínica em calendário semanal com indicação de status.

**Critério de aceite:** Toda consulta da semana pode ser encontrada; horários fora da faixa inicialmente visível continuam acessíveis.

## RF21 — Detalhes da consulta

O sistema deve apresentar nomes do paciente e profissional, especialidade, início, término e situação.

**Critério de aceite:** Selecionar uma consulta abre seus dados e permite fechar os detalhes sem alterar registros.

## RF22 — Reagendamento

O sistema deve permitir mudar horário e profissional de consulta agendada ou confirmada.

**Critério de aceite:** Revalida disponibilidade e vínculos numa transação; em conflito, mantém integralmente o agendamento anterior.

## RF23 — Situação da consulta

O sistema deve permitir confirmar, concluir ou cancelar consultas conforme as transições definidas nas regras de negócio. As transições permitidas são: agendada para confirmada, realizada ou cancelada; confirmada para realizada ou cancelada. Realizada e cancelada são situações finais. A realização só pode ser registrada após o início da consulta.

**Critério de aceite:** Cancelamento libera o intervalo e preserva o registro; consultas realizadas não são reagendadas.

## RF24 — Filtros da agenda

O sistema deve permitir filtrar período, profissional, paciente e status, incluindo cancelamentos.

**Critério de aceite:** Filtros podem ser combinados e são sempre restritos à clínica autenticada.
