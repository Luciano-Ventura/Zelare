# Zelare - Forms

## Objetivo do Documento

Este documento define os formulários iniciais da Zelare.

Os formulários serão usados no MVP para captar:

1. Solicitações de famílias que precisam de cuidado
2. Cadastros de profissionais interessados em receber oportunidades de plantão

A primeira versão dos formulários deve ser simples, clara e suficiente para permitir a operação manual da Zelare.

---

## Formulários do MVP

A Zelare terá inicialmente dois formulários principais:

1. Formulário de solicitação de cuidado
2. Formulário de cadastro profissional

---

# 1. Formulário de Solicitação de Cuidado

## Objetivo

Coletar informações suficientes para entender a necessidade da família, classificar o tipo de cuidado e buscar profissionais compatíveis.

---

## Público

Famílias ou responsáveis que precisam contratar:

* Cuidador de idoso
* Cuidador para pessoa acamada
* Babá
* Técnico de enfermagem
* Enfermeiro
* Acompanhante hospitalar
* Profissional para pós-cirúrgico
* Profissional para plantão avulso ou recorrente

---

## Título do Formulário

Solicite um cuidado pela Zelare

---

## Descrição do Formulário

Preencha as informações abaixo para que a Zelare entenda sua necessidade e busque profissionais disponíveis para o atendimento.

Após o envio, nossa equipe poderá entrar em contato pelo WhatsApp para confirmar os detalhes.

---

## Campos do Formulário

### 1. Nome do responsável

Tipo: texto curto
Obrigatório: sim

Descrição:

Nome da pessoa que está solicitando o cuidado.

---

### 2. Telefone com WhatsApp

Tipo: telefone
Obrigatório: sim

Descrição:

Número que será usado para contato da Zelare.

Validação:

* Deve conter DDD
* Deve aceitar apenas números válidos
* Exemplo: (48) 99999-9999

---

### 3. Cidade

Tipo: texto curto ou seleção
Obrigatório: sim

Opções iniciais sugeridas:

* São José
* Florianópolis
* Palhoça
* Biguaçu
* Outra

---

### 4. Bairro

Tipo: texto curto
Obrigatório: sim

Descrição:

Bairro onde o atendimento será realizado.

---

### 5. Tipo de cuidado necessário

Tipo: seleção única
Obrigatório: sim

Opções:

* Cuidador de idoso
* Pessoa acamada
* Plantão noturno
* Acompanhamento hospitalar
* Pós-cirúrgico
* Técnico de enfermagem
* Enfermeiro
* Babá
* Ainda não sei qual profissional preciso

---

### 6. Para quem será o cuidado?

Tipo: seleção única
Obrigatório: sim

Opções:

* Idoso
* Adulto
* Criança
* Pessoa acamada
* Pessoa em recuperação
* Pessoa com deficiência
* Paciente hospitalizado
* Outro

---

### 7. Idade da pessoa que receberá o cuidado

Tipo: número
Obrigatório: não

Descrição:

Ajuda a entender melhor o perfil do atendimento.

---

### 8. A pessoa possui alguma condição específica?

Tipo: múltipla escolha
Obrigatório: não

Opções:

* Alzheimer
* Parkinson
* Demência
* Acamado
* Pós-cirúrgico
* Mobilidade reduzida
* Usa cadeira de rodas
* Necessita auxílio para banho
* Necessita auxílio para alimentação
* Necessita acompanhamento em hospital
* Não possui condição específica
* Outro

---

### 9. Qual a data do atendimento?

Tipo: data
Obrigatório: sim

Descrição:

Data em que o atendimento deve acontecer.

---

### 10. Horário de início

Tipo: horário
Obrigatório: sim

Exemplo:

08:00, 19:00, 20:00

---

### 11. Duração do atendimento

Tipo: seleção única
Obrigatório: sim

Opções:

* Até 4 horas
* 4 a 6 horas
* 8 horas
* 12 horas
* Plantão noturno
* 24 horas
* Recorrente
* Ainda não sei

---

### 12. O atendimento será recorrente?

Tipo: seleção única
Obrigatório: sim

Opções:

* Não, será apenas um plantão
* Sim, todos os dias
* Sim, alguns dias por semana
* Sim, finais de semana
* Sim, plantão 12x36
* Ainda não sei

---

### 13. Quais atividades o profissional precisará realizar?

Tipo: múltipla escolha
Obrigatório: sim

Opções:

* Companhia
* Alimentação
* Higiene
* Banho
* Troca de roupas
* Troca de fraldas
* Auxílio para locomoção
* Acompanhamento em consulta
* Acompanhamento hospitalar
* Administração de medicação conforme orientação
* Verificação de sinais vitais
* HGT/glicemia capilar
* Apoio no pós-cirúrgico
* Cuidado infantil
* Outro

---

### 14. Existe algum familiar no local durante o atendimento?

Tipo: seleção única
Obrigatório: não

Opções:

* Sim
* Não
* Em alguns horários
* Ainda não sei

---

### 15. Preferência de profissional

Tipo: seleção única
Obrigatório: não

Opções:

* Sem preferência
* Prefiro profissional mulher
* Prefiro profissional homem
* Preciso avaliar conforme o perfil

---

### 16. Valor sugerido para o plantão

Tipo: valor monetário
Obrigatório: não

Descrição:

A família pode sugerir um valor. O profissional poderá aceitar, recusar ou enviar uma contraproposta.

Exemplo:

R$ 200,00

---

### 17. O atendimento é urgente?

Tipo: seleção única
Obrigatório: sim

Opções:

* Sim, preciso hoje
* Sim, preciso em até 24 horas
* Não, posso aguardar
* É para uma data futura

---

### 18. Observações importantes

Tipo: texto longo
Obrigatório: não

Descrição:

Campo para informações adicionais.

Exemplos:

* Peso aproximado da pessoa
* Se mora em casa ou apartamento
* Se tem escadas
* Se há animais no local
* Se precisa de experiência específica
* Se já existe rotina de cuidado

---

### 19. Aceite de contato

Tipo: checkbox
Obrigatório: sim

Texto:

Autorizo a Zelare a entrar em contato pelo WhatsApp para dar continuidade à solicitação.

---

### 20. Aceite de responsabilidade das informações

Tipo: checkbox
Obrigatório: sim

Texto:

Confirmo que as informações fornecidas são verdadeiras e entendo que elas serão usadas para buscar profissionais compatíveis com a necessidade informada.

---

## Mensagem Após Envio

Obrigado por solicitar um cuidado pela Zelare.

Recebemos suas informações e nossa equipe poderá entrar em contato pelo WhatsApp para confirmar os detalhes e buscar profissionais disponíveis.

---

## Status Inicial Após Envio

Toda solicitação enviada pelo formulário deve entrar com status:

Novo pedido

---

## Destino dos Dados

Os dados devem ser enviados para:

* Planilha de solicitações
* CRM simples
* Notificação interna
* WhatsApp ou e-mail da operação, se possível

---

# 2. Formulário de Cadastro Profissional

## Objetivo

Coletar informações dos profissionais interessados em receber oportunidades de plantão pela Zelare.

---

## Público

Profissionais como:

* Cuidadores
* Babás
* Técnicos de enfermagem
* Enfermeiros
* Acompanhantes hospitalares

---

## Título do Formulário

Cadastre-se como profissional da Zelare

---

## Descrição do Formulário

A Zelare está cadastrando profissionais de cuidado para receber oportunidades de plantão avulso ou recorrente.

Preencha suas informações para análise inicial.

O cadastro não garante envio imediato de oportunidades. As solicitações dependem da demanda das famílias, região, disponibilidade e perfil do atendimento.

---

## Campos do Formulário

### 1. Nome completo

Tipo: texto curto
Obrigatório: sim

---

### 2. Telefone com WhatsApp

Tipo: telefone
Obrigatório: sim

Validação:

* Deve conter DDD
* Exemplo: (48) 99999-9999

---

### 3. Cidade

Tipo: texto curto ou seleção
Obrigatório: sim

Opções iniciais:

* São José
* Florianópolis
* Palhoça
* Biguaçu
* Outra

---

### 4. Bairro

Tipo: texto curto
Obrigatório: sim

---

### 5. Categoria profissional

Tipo: seleção única
Obrigatório: sim

Opções:

* Cuidador de idosos
* Babá
* Técnico de enfermagem
* Enfermeiro
* Acompanhante hospitalar
* Outro

---

### 6. Você possui formação ou curso na área?

Tipo: seleção única
Obrigatório: sim

Opções:

* Sim
* Não
* Estou cursando
* Tenho experiência prática

---

### 7. Descreva sua experiência

Tipo: texto longo
Obrigatório: sim

Descrição:

Informar experiência com cuidado, tempo de atuação, tipos de pacientes ou crianças atendidas e rotinas que já realizou.

---

### 8. Quais tipos de atendimento você aceita?

Tipo: múltipla escolha
Obrigatório: sim

Opções:

* Idosos
* Pessoas acamadas
* Alzheimer
* Parkinson
* Demência
* Pós-cirúrgico
* Acompanhamento hospitalar
* Crianças
* Plantão noturno
* Plantão diurno
* Plantão 12 horas
* Plantão 24 horas
* Atendimento recorrente
* Atendimento avulso

---

### 9. Quais atividades você realiza?

Tipo: múltipla escolha
Obrigatório: sim

Opções:

* Companhia
* Alimentação
* Higiene
* Banho
* Troca de roupas
* Troca de fraldas
* Auxílio para locomoção
* Acompanhamento em consultas
* Acompanhamento hospitalar
* Administração de medicação conforme orientação
* Verificação de sinais vitais
* HGT/glicemia capilar
* Apoio no pós-cirúrgico
* Cuidado infantil
* Outro

---

### 10. Disponibilidade

Tipo: múltipla escolha
Obrigatório: sim

Opções:

* Manhã
* Tarde
* Noite
* Madrugada
* Finais de semana
* Plantão 12x36
* Plantão 24h
* Atendimento avulso
* Atendimento recorrente

---

### 11. Regiões que atende

Tipo: múltipla escolha ou texto longo
Obrigatório: sim

Opções iniciais:

* São José
* Florianópolis
* Palhoça
* Biguaçu
* Apenas meu bairro
* Outras regiões

---

### 12. Valor médio por plantão

Tipo: valor monetário ou texto curto
Obrigatório: não

Descrição:

Informar valor médio que costuma cobrar por atendimento.

Exemplos:

* R$ 150 por 8 horas
* R$ 200 por 12 horas
* R$ 250 plantão noturno
* A combinar

---

### 13. Você aceita receber propostas com valor sugerido pela família?

Tipo: seleção única
Obrigatório: sim

Opções:

* Sim
* Não
* Depende do caso
* Prefiro fazer contraproposta

---

### 14. Você aceita fazer contraproposta?

Tipo: seleção única
Obrigatório: sim

Opções:

* Sim
* Não
* Depende do atendimento

---

### 15. Você possui referências profissionais?

Tipo: seleção única
Obrigatório: sim

Opções:

* Sim
* Não
* Posso enviar depois

---

### 16. Nome e contato de uma referência

Tipo: texto longo
Obrigatório: não

Descrição:

Pode ser uma família atendida, empresa, clínica, curso, colega ou responsável anterior.

---

### 17. Você possui certificados ou documentos da área?

Tipo: seleção única
Obrigatório: sim

Opções:

* Sim
* Não
* Posso enviar depois

---

### 18. Upload de documento pessoal

Tipo: upload
Obrigatório: sim no cadastro completo
Obrigatório no pré-cadastro: não

Descrição:

Documento usado para análise interna da Zelare.

---

### 19. Upload de certificado ou comprovante

Tipo: upload
Obrigatório: não

Descrição:

Cursos, certificados ou comprovantes de formação.

---

### 20. Foto para perfil

Tipo: upload
Obrigatório: não no MVP
Obrigatório no cadastro completo futuro: sim

Descrição:

Foto que poderá ser usada no perfil, mediante autorização.

---

### 21. Autorização de contato

Tipo: checkbox
Obrigatório: sim

Texto:

Autorizo a Zelare a entrar em contato pelo WhatsApp para continuidade do cadastro e envio de oportunidades compatíveis com meu perfil.

---

### 22. Aceite de veracidade

Tipo: checkbox
Obrigatório: sim

Texto:

Confirmo que as informações fornecidas são verdadeiras e entendo que meu cadastro poderá passar por análise antes de ser indicado para famílias.

---

## Mensagem Após Envio

Cadastro recebido pela Zelare.

Nossa equipe poderá entrar em contato pelo WhatsApp para confirmar informações e concluir a análise do seu perfil.

O envio do cadastro não garante oportunidades imediatas. As oportunidades dependem da demanda das famílias, região, disponibilidade e compatibilidade com o atendimento.

---

## Status Inicial Após Envio

Todo profissional cadastrado pelo formulário deve entrar com status:

Novo cadastro

---

## Destino dos Dados

Os dados devem ser enviados para:

* Planilha de profissionais
* CRM simples
* Notificação interna
* WhatsApp ou e-mail da operação, se possível

---

# Campos Obrigatórios no MVP

## Família

Campos obrigatórios mínimos:

* Nome do responsável
* Telefone com WhatsApp
* Cidade
* Bairro
* Tipo de cuidado necessário
* Para quem será o cuidado
* Data
* Horário de início
* Duração
* Atividades necessárias
* Urgência
* Aceite de contato
* Aceite de responsabilidade

---

## Profissional

Campos obrigatórios mínimos:

* Nome completo
* Telefone com WhatsApp
* Cidade
* Bairro
* Categoria profissional
* Formação ou experiência
* Descrição da experiência
* Tipos de atendimento aceitos
* Atividades realizadas
* Disponibilidade
* Regiões atendidas
* Aceite de contato
* Aceite de veracidade

---

# Regras de Validação

## Telefone

Todo telefone deve conter DDD.

---

## Cidade e Bairro

Cidade e bairro são obrigatórios porque a Zelare depende da proximidade regional no MVP.

---

## Tipo de Cuidado

O tipo de cuidado é obrigatório para classificar a necessidade e acionar profissionais compatíveis.

---

## Categoria Profissional

A categoria profissional é obrigatória para evitar confusão entre cuidador, babá, técnico de enfermagem e enfermeiro.

---

## Urgência

Urgência é obrigatória para priorizar atendimento e definir tempo de resposta.

---

## Aceites

Os campos de aceite são obrigatórios para registrar autorização de contato e responsabilidade pelas informações fornecidas.

---

# Integrações Recomendadas

## MVP Simples

Opções:

* Tally
* Google Forms
* Airtable Forms
* Typeform
* Formulário próprio na landing page

---

## Destino dos Dados

Opções:

* Google Sheets
* Airtable
* Notion
* CRM simples
* Banco de dados futuro

---

## Automação

Opções:

* n8n
* Make
* Zapier

Automação inicial recomendada:

1. Formulário enviado
2. Dados salvos na planilha
3. Notificação enviada para WhatsApp ou e-mail interno
4. Status inicial criado
5. Operações inicia atendimento

---

# Recomendação Técnica Inicial

Para o MVP, usar uma solução simples e rápida.

Opção recomendada:

* Landing page
* Formulário Tally ou formulário próprio simples
* Dados enviados para Google Sheets ou Airtable
* Notificação para WhatsApp Business ou e-mail
* Controle manual pela operação

---

# Estrutura da Planilha de Solicitações

Colunas recomendadas:

* ID
* Data de envio
* Nome do responsável
* Telefone
* Cidade
* Bairro
* Tipo de cuidado
* Pessoa atendida
* Idade
* Condições específicas
* Data do atendimento
* Horário
* Duração
* Recorrência
* Atividades necessárias
* Familiar no local
* Preferência de profissional
* Valor sugerido
* Urgência
* Observações
* Status
* Profissionais acionados
* Propostas recebidas
* Profissional escolhido
* Valor final
* Taxa Zelare
* Resultado
* Avaliação
* Ocorrências

---

# Estrutura da Planilha de Profissionais

Colunas recomendadas:

* ID
* Data de cadastro
* Nome completo
* Telefone
* Cidade
* Bairro
* Categoria profissional
* Formação ou curso
* Experiência
* Tipos de atendimento aceitos
* Atividades realizadas
* Disponibilidade
* Regiões atendidas
* Valor médio
* Aceita valor sugerido
* Aceita contraproposta
* Possui referências
* Referência
* Possui certificados
* Documento enviado
* Certificado enviado
* Foto enviada
* Status
* Observações
* Último contato
* Responsividade
* Avaliação média futura

---

# Regras Operacionais dos Formulários

## Família

Quando uma família enviar solicitação:

1. Solicitação entra como Novo pedido
2. Operações revisa informações
3. Se faltar informação, entra em Aguardando informações
4. Se estiver completa, entra em Em análise
5. Operações classifica tipo de cuidado
6. Profissionais compatíveis são acionados

---

## Profissional

Quando um profissional enviar cadastro:

1. Cadastro entra como Novo cadastro
2. Operações revisa informações
3. Se faltar informação, entra em Aguardando informações
4. Se estiver completo, entra em Em análise
5. Após análise mínima, pode virar Validado
6. Quando estiver disponível, pode virar Disponível ou Ativo

---

# Segurança e Cuidados

Os formulários devem evitar prometer aprovação automática.

O formulário do profissional deve deixar claro que o cadastro será analisado.

O formulário da família deve deixar claro que a disponibilidade depende da região, horário e perfil do atendimento.

A Zelare deve evitar aceitar casos complexos sem análise.

A Zelare deve separar claramente categorias profissionais.

---

# Textos de Aviso

## Aviso Para Famílias

A Zelare atua como plataforma de conexão entre famílias e profissionais de cuidado. A disponibilidade depende da região, horário, tipo de cuidado e profissionais cadastrados.

Casos de emergência médica devem ser direcionados aos serviços de saúde adequados.

---

## Aviso Para Profissionais

O cadastro na Zelare não garante oportunidades imediatas. As solicitações dependem da demanda das famílias e da compatibilidade com seu perfil, disponibilidade e região de atendimento.

---

# Métricas dos Formulários

Acompanhar:

## Formulário da Família

* Número de envios
* Cidades mais frequentes
* Bairros mais frequentes
* Tipos de cuidado mais solicitados
* Horários mais solicitados
* Valores sugeridos
* Solicitações urgentes
* Solicitações recorrentes
* Taxa de pedidos qualificados

---

## Formulário do Profissional

* Número de cadastros
* Categorias profissionais
* Regiões atendidas
* Disponibilidade
* Valores médios
* Experiências mais comuns
* Profissionais com documentos
* Profissionais com referência
* Profissionais responsivos
* Profissionais validados

---

# Critérios de Qualidade

Os formulários devem ser:

* Simples
* Mobile-first
* Rápidos de preencher
* Claros
* Sem excesso de campos
* Com linguagem humana
* Com campos essenciais para operação
* Com avisos de responsabilidade
* Com confirmação após envio

---

# Versão Inicial Recomendada

Para não travar a conversão, o formulário da família deve ser menor que o formulário profissional.

A família está em momento de necessidade e pode abandonar se o formulário for longo demais.

Se necessário, coletar o essencial no formulário e complementar pelo WhatsApp.

---

## Formulário Curto Para Família

Versão reduzida inicial:

* Nome
* WhatsApp
* Cidade
* Bairro
* Tipo de cuidado
* Data
* Horário
* Duração
* Atividades necessárias
* Urgência
* Observações

---

## Formulário Completo Para Família

Usar quando for necessário detalhar melhor a solicitação.

Pode ser usado pelo atendimento interno durante o WhatsApp.

---

## Formulário Profissional

Pode ser mais completo, porque o cadastro profissional precisa ser analisado antes de indicação.

---

# Decisão Estratégica

Os formulários da Zelare devem equilibrar conversão e segurança.

Poucos campos podem gerar risco operacional.

Muitos campos podem reduzir conversão.

A decisão inicial será:

* Formulário de família mais simples
* Complemento por WhatsApp
* Formulário profissional mais completo
* Análise manual pela operação

---

## Regra Principal dos Formulários

Os formulários devem coletar informação suficiente para proteger a família, orientar o profissional e permitir que a Zelare opere com organização.

Se o campo não ajuda na decisão, operação ou segurança, ele deve ser reavaliado.
