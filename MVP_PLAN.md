# Zelare - MVP Plan

## Objetivo do Documento

Este documento define o plano do MVP da Zelare.

O objetivo do MVP é validar se existe demanda real de famílias e oferta suficiente de profissionais antes de investir no desenvolvimento de uma plataforma completa ou aplicativo mobile.

A Zelare será validada inicialmente como uma operação simples, manual e de baixo custo.

---

## Decisão Estratégica

A Zelare está aprovada como produto próprio da NexaSync.

O desenvolvimento de aplicativo completo ainda não está aprovado.

A etapa aprovada é:

MVP com landing page, formulários, WhatsApp, cadastro manual de profissionais, controle operacional e validação de plantões.

---

## Objetivo do MVP

Validar se famílias estão dispostas a solicitar cuidadores, babás, técnicos de enfermagem ou enfermeiros por meio da Zelare.

Validar também se profissionais estão dispostos a receber oportunidades de plantão, aceitar solicitações, recusar ou enviar contrapropostas.

---

## Hipótese Principal

Famílias que precisam de cuidado domiciliar possuem dificuldade para encontrar profissionais confiáveis, disponíveis e adequados à necessidade.

Se a Zelare conseguir organizar profissionais cadastrados e facilitar essa conexão, famílias aceitarão pagar uma taxa de serviço pela intermediação, segurança e praticidade.

---

## Hipóteses Secundárias

* Existem profissionais interessados em receber oportunidades de plantão.
* Famílias aceitam pagar taxa adicional se perceberem segurança.
* Plantões avulsos têm demanda local.
* Plantões noturnos possuem boa oportunidade de receita.
* Cuidado recorrente pode gerar receita previsível.
* O processo pode ser validado manualmente antes de virar sistema.
* A contraproposta de valor pode aumentar a taxa de fechamento.
* A confiança será mais importante que o menor preço.

---

## Público Inicial do MVP

O MVP será focado em famílias que precisam de cuidado para:

* Idosos
* Pessoas acamadas
* Pessoas em recuperação
* Pessoas pós-cirúrgicas
* Pessoas com Alzheimer
* Pessoas com Parkinson
* Pessoas com demência
* Familiares que precisam de acompanhamento temporário

Babás e outros tipos de cuidado poderão ser incluídos, mas o foco inicial será cuidado de idosos e pessoas dependentes.

---

## Região Inicial

A validação inicial será feita em região limitada para facilitar operação manual.

Regiões sugeridas:

* Areias
* São José
* Florianópolis
* Palhoça
* Biguaçu

A operação não deve começar em uma área muito ampla.

Quanto menor a região inicial, mais fácil será controlar qualidade, disponibilidade e atendimento.

---

## Escopo do MVP

O MVP terá:

* Landing page institucional
* Formulário para famílias
* Formulário para profissionais
* Cadastro manual de profissionais
* Atendimento via WhatsApp
* Controle de solicitações
* Controle de status dos plantões
* Planilha ou CRM simples
* Processo manual de confirmação
* Registro de avaliações
* Registro de receita por plantão

---

## Fora do Escopo do MVP

O MVP não terá:

* App Android
* App iOS
* Login de família
* Login de profissional
* Pagamento automático interno
* Geolocalização em tempo real
* Chat interno
* Notificações push
* Algoritmo de matching automático
* Sistema completo de avaliações públicas
* Contratos automatizados
* Escala inteligente
* Inteligência artificial avançada
* Painel completo para profissionais
* Painel completo para famílias

Esses recursos poderão ser desenvolvidos somente após validação.

---

## Fluxo do MVP

### 1. Família solicita cuidado

A família acessa a landing page e preenche o formulário de solicitação.

Dados principais:

* Nome
* Telefone
* Cidade
* Bairro
* Tipo de cuidado
* Data
* Horário
* Duração
* Condição da pessoa
* Necessidades específicas
* Valor sugerido
* Observações

---

### 2. Zelare recebe o pedido

A solicitação entra em uma planilha ou CRM.

Operações verifica se as informações estão completas.

Caso falte informação, o atendimento entra em contato pelo WhatsApp.

---

### 3. Zelare classifica a solicitação

A solicitação deve ser classificada por:

* Tipo de profissional necessário
* Urgência
* Bairro
* Horário
* Complexidade
* Valor sugerido
* Risco operacional

---

### 4. Zelare envia para profissionais compatíveis

A equipe envia a oportunidade para profissionais cadastrados que atendem ao perfil.

Exemplo de mensagem:

Nova oportunidade de plantão pela Zelare.

Local: São José
Bairro: Areias
Horário: 20h às 08h
Tipo: cuidador de idoso
Condição: idoso acamado
Valor oferecido: R$ 200,00

Você aceita, recusa ou deseja enviar contraproposta?

---

### 5. Profissional responde

O profissional pode:

* Aceitar o valor
* Recusar
* Fazer contraproposta
* Pedir mais informações

---

### 6. Família recebe opções

A Zelare apresenta para a família os profissionais interessados.

Informações mínimas:

* Nome
* Categoria profissional
* Experiência
* Bairro ou região
* Valor
* Disponibilidade
* Observações relevantes

---

### 7. Família escolhe

A família escolhe o profissional.

Zelare confirma:

* Valor final
* Horário
* Local
* Tipo de atendimento
* Forma de pagamento
* Regras básicas

---

### 8. Plantão é confirmado

A solicitação muda para status Confirmado.

A Zelare envia confirmação para família e profissional.

---

### 9. Plantão acontece

Durante o MVP, o acompanhamento será manual.

A Zelare poderá enviar mensagens simples:

* Confirmação antes do horário
* Verificação no início
* Verificação após conclusão

---

### 10. Avaliação pós-atendimento

Após o plantão, a Zelare coleta avaliação da família e do profissional.

Dados coletados:

* Profissional compareceu?
* Atendimento foi satisfatório?
* Houve algum problema?
* Família contrataria novamente?
* Profissional aceitaria atender novamente?
* Nota de 1 a 5
* Comentários

---

## Status das Solicitações

Toda solicitação deve ter um status.

Status permitidos:

* Novo pedido
* Em análise
* Aguardando informações
* Procurando profissional
* Propostas recebidas
* Aguardando família
* Confirmado
* Em andamento
* Concluído
* Cancelado
* Sem profissional disponível

---

## Ferramentas do MVP

### Landing Page

Opções:

* Next.js
* Framer
* Webflow
* WordPress
* Carrd

Preferência inicial:

Landing page simples e rápida, com formulário integrado.

---

### Formulários

Opções:

* Google Forms
* Tally
* Typeform
* Formulário próprio
* Airtable Form

Preferência inicial:

Tally ou formulário próprio simples.

---

### Controle Operacional

Opções:

* Google Sheets
* Airtable
* Notion
* Trello
* CRM simples

Preferência inicial:

Google Sheets ou Airtable.

---

### Comunicação

Opções:

* WhatsApp Business
* E-mail
* Instagram Direct

Preferência inicial:

WhatsApp Business.

---

### Automação

Opções:

* Make
* n8n
* Zapier

Preferência inicial:

n8n, por já estar alinhado às ferramentas da NexaSync.

---

## Estrutura Mínima da Landing Page

### Seção 1 - Hero

Título:

Precisa de cuidador, babá ou profissional de enfermagem?

Subtítulo:

A Zelare conecta sua família a profissionais de cuidado para plantões avulsos ou recorrentes, com agilidade, segurança e confiança.

Botões:

* Solicitar cuidado agora
* Quero trabalhar com a Zelare

---

### Seção 2 - Como Funciona

1. Você informa sua necessidade
2. A Zelare busca profissionais disponíveis
3. Você recebe opções
4. Escolhe o profissional
5. Confirma o atendimento

---

### Seção 3 - Tipos de Cuidado

* Cuidadores de idosos
* Acompanhamento hospitalar
* Plantão noturno
* Pós-cirúrgico
* Técnicos de enfermagem
* Enfermeiros
* Babás

---

### Seção 4 - Segurança

Texto:

A Zelare trabalha com profissionais cadastrados, informações verificadas e avaliação após os atendimentos.

---

### Seção 5 - Para Famílias

Chamada:

Encontre apoio para cuidar de quem você ama.

Botão:

Solicitar cuidado

---

### Seção 6 - Para Profissionais

Chamada:

Receba oportunidades de plantão e aumente sua renda.

Botão:

Cadastrar como profissional

---

### Seção 7 - FAQ

Perguntas iniciais:

* A Zelare é uma agência de cuidadores?
* Como escolho um profissional?
* Posso pedir plantão urgente?
* Quem define o valor?
* Como funciona a taxa da Zelare?
* Os profissionais são verificados?

---

## Formulário da Família

Campos obrigatórios:

* Nome
* Telefone
* Cidade
* Bairro
* Tipo de cuidado
* Data do atendimento
* Horário inicial
* Duração
* Condição da pessoa atendida
* Necessidades principais
* Valor sugerido
* Observações

Campos opcionais:

* Idade da pessoa atendida
* Peso aproximado
* Mobilidade
* Uso de medicação
* Necessidade de sinais vitais
* Necessidade de banho
* Necessidade de alimentação
* Presença de familiar no local
* Preferência por profissional homem ou mulher

---

## Formulário do Profissional

Campos obrigatórios:

* Nome completo
* Telefone
* Cidade
* Bairro
* Categoria profissional
* Experiência
* Disponibilidade
* Regiões atendidas
* Valor médio por plantão
* Tipos de atendimento que aceita
* Documento
* Foto
* Referência

Campos opcionais:

* Cursos
* Certificados
* Registro profissional, se aplicável
* Experiência com Alzheimer
* Experiência com Parkinson
* Experiência com acamados
* Experiência com crianças
* Experiência hospitalar
* Plantão noturno
* Atendimento de urgência

---

## Critérios de Cadastro de Profissionais

Para entrar na base inicial, o profissional deve informar:

* Dados pessoais básicos
* Telefone válido
* Região de atendimento
* Experiência
* Disponibilidade
* Valor médio
* Categoria profissional
* Tipo de atendimento aceito

Para ser recomendado para famílias, o profissional deve ter cadastro mínimo validado.

---

## Critérios de Segurança no MVP

Nenhum profissional deve ser enviado para família sem cadastro prévio.

A Zelare deve evitar prometer atendimento técnico se o profissional não for habilitado.

A categoria profissional deve ficar clara para a família.

Casos complexos devem ser analisados antes de aceitar.

A Zelare deve registrar ocorrências.

A Zelare deve coletar avaliações.

---

## Política Inicial de Cobrança

Modelo inicial:

* Taxa de serviço de 15%
* Taxa mínima de R$ 20,00
* Cobrança preferencial da família
* Profissional recebe o valor combinado

Exemplo:

Valor do plantão: R$ 200,00
Taxa Zelare: R$ 30,00
Total para família: R$ 230,00
Profissional recebe: R$ 200,00

---

## Política Inicial de Pagamento

Durante o MVP, existem duas opções possíveis:

### Opção 1 - Família paga Zelare

A família paga o valor total para a Zelare.

A Zelare repassa o valor ao profissional após o plantão.

Vantagem:

* Mais controle
* Mais segurança
* Menor inadimplência

Desvantagem:

* Maior responsabilidade operacional

---

### Opção 2 - Família paga separado

A família paga o profissional diretamente e paga a taxa da Zelare separadamente.

Vantagem:

* Mais simples no início

Desvantagem:

* Menor controle
* Maior risco de desintermediação

---

## Recomendação Para o MVP

Começar com:

* Sinal ou taxa Zelare via Pix
* Confirmação manual
* Pagamento do profissional combinado entre família e profissional
* Registro de tudo no CRM

Depois de validar, migrar para pagamento centralizado.

---

## Metas do MVP

### Meta de 7 dias

* Criar landing page
* Criar formulários
* Criar planilha/CRM
* Cadastrar 10 profissionais
* Publicar primeira comunicação

---

### Meta de 15 dias

* Cadastrar 30 profissionais
* Receber 10 solicitações de famílias
* Fechar 3 plantões
* Coletar primeiras avaliações

---

### Meta de 30 dias

* Cadastrar 50 profissionais
* Receber 30 solicitações
* Fechar 10 plantões
* Coletar 5 avaliações positivas
* Validar taxa de serviço
* Identificar ticket médio
* Identificar regiões com mais demanda

---

## Indicadores de Validação

A Zelare estará validando se:

* Famílias preenchem o formulário
* Profissionais querem se cadastrar
* Profissionais respondem oportunidades
* Famílias aceitam pagar taxa
* Plantões são fechados
* Avaliações são positivas
* Existe recorrência
* O processo manual começa a se repetir
* Existe potencial de automação

---

## Indicadores de Alerta

A Zelare deve revisar o modelo se:

* Famílias não solicitam atendimento
* Profissionais não se cadastram
* Famílias não aceitam pagar taxa
* Muitos profissionais recusam
* Há muitos cancelamentos
* A operação manual fica confusa
* Não há confiança suficiente
* O ticket médio é muito baixo
* Não há recorrência

---

## Critério Para Avançar Para Painel Web

A Zelare poderá avançar para um painel web simples quando atingir:

* 50 profissionais cadastrados
* 30 solicitações recebidas
* 10 plantões fechados
* Processo operacional repetitivo
* Dificuldade de controlar tudo por planilha
* Sinais de recorrência

---

## Critério Para Avançar Para App Completo

A Zelare só deve avançar para app completo quando atingir:

* 150 profissionais cadastrados
* 100 solicitações recebidas
* 30 plantões fechados
* Receita recorrente ou semi-recorrente
* Famílias repetindo uso
* Profissionais ativos e responsivos
* Problema claro de escala
* Modelo de cobrança validado

---

## Entregáveis do MVP

### Estratégia

* Product Context
* Business Model
* MVP Plan
* Validation Plan
* Roadmap

---

### Marca

* Nome
* Slogan
* Paleta inicial
* Tom de voz
* Identidade visual simples

---

### Comercial

* Mensagens de prospecção
* Lista de parceiros
* Abordagem para famílias
* Abordagem para profissionais

---

### Design

* Layout da landing page
* Estrutura visual
* Materiais simples para divulgação

---

### Desenvolvimento

* Landing page
* Formulários
* Integração com planilha ou CRM
* Automação básica, se possível

---

### Operações

* Planilha/CRM
* Status das solicitações
* Checklist de profissionais
* Fluxo de atendimento
* Controle de avaliações

---

## Responsabilidades dos Agentes

### CEO

Responsável por:

* Aprovar escopo
* Definir posicionamento
* Validar modelo de negócio
* Decidir avanço ou pausa
* Priorizar o que gera receita e validação

---

### Comercial

Responsável por:

* Captar profissionais
* Captar famílias
* Criar parcerias
* Fazer follow-up
* Validar objeções

---

### Designer

Responsável por:

* Criar identidade inicial
* Criar layout da landing page
* Criar materiais visuais
* Garantir comunicação confiável

---

### Desenvolvedor

Responsável por:

* Implementar landing page
* Implementar formulários
* Integrar dados
* Criar automações simples
* Preparar base para painel futuro

---

### Operações

Responsável por:

* Organizar solicitações
* Controlar status
* Validar cadastros
* Documentar processos
* Registrar plantões
* Coletar avaliações

---

## Cronograma Sugerido

### Semana 1

* Finalizar documentação principal
* Criar identidade visual inicial
* Criar landing page
* Criar formulários
* Criar planilha/CRM
* Começar cadastro de profissionais

---

### Semana 2

* Publicar landing page
* Iniciar divulgação
* Cadastrar mais profissionais
* Receber primeiras solicitações
* Ajustar fluxo operacional

---

### Semana 3

* Fechar primeiros plantões
* Coletar avaliações
* Ajustar mensagens comerciais
* Testar taxa de serviço
* Mapear objeções

---

### Semana 4

* Analisar resultados
* Medir KPIs
* Decidir próximos passos
* Planejar painel web ou ajustes no MVP

---

## Regra Principal do MVP

O MVP não existe para parecer grande.

O MVP existe para provar se a Zelare resolve uma dor real, gera confiança e consegue transformar solicitações em plantões pagos.

Se não validar manualmente, não deve ser automatizado.
