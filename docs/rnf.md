# Requisitos Não Funcionais (RNF)

Os requisitos não funcionais definem as condições de segurança, desempenho, integridade, usabilidade e manutenção do EasyClinic. Complementam os [Requisitos Funcionais](rf.md) e devem orientar a implementação e os testes de aceitação.

Os valores de desempenho e recuperação são metas para homologação, e não resultados já medidos no código atual.

## RNF01 — Proteção das credenciais

Armazenar senhas com bcrypt de custo 12 ou superior; exigir no mínimo 10 caracteres e no máximo 72 bytes em UTF-8, sem truncar; nunca retornar hashes na API.

**Critério de verificação:** Inspecionar persistência e respostas; senha incorreta não autentica.

## RNF02 — Autorização e isolamento

Toda rota administrativa deve conferir JWT, usuário ativo, versão de sessão, perfil e clínica no servidor.

**Critério de verificação:** Repetir operações com duas clínicas e dois perfis; acesso indevido deve falhar sem revelar o registro.

## RNF03 — Sessão e tentativas

Expirar JWT em uma hora; após cinco falhas consecutivas bloquear login por 15 minutos.

**Critério de verificação:** Testar expiração, revogação e sexta tentativa; após bloqueio, reiniciar contador sob controle transacional.

## RNF04 — Validação e integridade

Validar tipos, tamanhos, campos vazios e documentos no servidor; aplicar PK, FK, unicidade e CHECK no banco.

**Critério de verificação:** Submeter referências inexistentes, cruzadas entre clínicas, intervalos invertidos e duplicidades.

## RNF05 — Atomicidade e concorrência

Usar transações em cadastro inicial, recuperação e agenda; serializar reservas concorrentes dos mesmos recursos.

**Critério de verificação:** Duas requisições simultâneas conflitantes não podem gerar duas reservas; falha intermediária deve desfazer a operação.

## RNF06 — Desempenho

Meta de homologação: p95 de até 2 s em listagens de 50 itens, com 10 usuários simultâneos e 10 mil pacientes e consultas por clínica.

**Critério de verificação:** Executar 100 requisições após aquecimento e registrar servidor, rede e massa de dados; não é resultado já medido.

## RNF07 — Usabilidade e acessibilidade

Apresentar interface em português, campos identificados, erros compreensíveis, foco visível e ações operáveis por teclado.

**Critério de verificação:** Percorrer login, cadastros e agenda sem mouse; erros devem indicar o campo sem apagar os demais dados.

## RNF08 — Compatibilidade e adaptação

Homologar em Chrome, Edge e Firefox estáveis na entrega e larguras de 360, 768 e 1366 px.

**Critério de verificação:** Registrar versões; formulários não podem perder controles. A agenda pode usar rolagem dentro do componente.

## RNF09 — Transporte e configuração

Usar HTTPS no ambiente publicado; manter chave JWT, acesso ao banco e URL da API fora do código versionado.

**Critério de verificação:** Verificar configuração de implantação, conexão segura e usuário do banco com privilégios mínimos.

## RNF10 — Privacidade e registros técnicos

Restringir dados pessoais à necessidade administrativa; logs não devem conter senhas, tokens, CPF completo ou corpo integral de consultas.

**Critério de verificação:** Revisar respostas e logs de sucesso e erro; procedimentos de acesso e retenção devem ser definidos pela clínica.

## RNF11 — Recuperação operacional

Meta: backup diário, perda máxima de 24 h e restauração em até 4 h no ambiente de homologação.

**Critério de verificação:** Restaurar uma cópia isolada e conferir contagens e vínculos; registrar data, duração e resultado.

## RNF12 — Manutenção e tratamento de falhas

Separar interface, API, regras e persistência; versionar migrações e executar build e testes antes da entrega.

**Critério de verificação:** Pipeline deve passar; API retorna erros tratados, sem stack trace ou detalhes SQL ao usuário.
