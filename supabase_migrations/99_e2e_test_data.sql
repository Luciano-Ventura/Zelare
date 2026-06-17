-- Script para injetar dados do Teste Ponta a Ponta (E2E)

-- 1. Injetar um Profissional de Teste (Ativo e validado)
INSERT INTO public.profissionais_cadastros (
  id, 
  nome_completo, 
  whatsapp, 
  status, 
  cidade, 
  estado, 
  bairro, 
  categoria_profissional,
  cep_base,
  endereco_base,
  numero_base,
  experiencia_anos,
  tipos_atendimento,
  raio_atendimento_km,
  -- Checklist mockado
  doc_identidade_status,
  certificados_status,
  antecedentes_status,
  entrevista_status,
  referencias_status
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Mariana Cuidadora Teste',
  '11999999999',
  'Ativo',
  'São Paulo',
  'SP',
  'Pinheiros',
  'Cuidador',
  '05422000',
  'Rua dos Pinheiros',
  '100',
  5,
  ARRAY['Idosos', 'Pós-operatório'],
  15,
  'Aprovado',
  'Aprovado',
  'Aprovado',
  'Aprovado',
  'Aprovado'
) ON CONFLICT (id) DO UPDATE SET status = 'Ativo';

-- 2. Injetar uma Solicitação de Família (Aguardando Orçamento)
INSERT INTO public.familias_solicitacoes (
  id,
  nome_completo,
  whatsapp,
  status,
  tipo_servico,
  tipo_profissional,
  data_inicio,
  horario_inicio,
  horario_fim,
  duracao_plantao,
  cidade,
  estado,
  bairro,
  cep,
  endereco,
  numero,
  codigo_acompanhamento,
  idade_paciente,
  nivel_dependencia
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'Família Silva Teste E2E',
  '11988888888',
  'Procurando profissional',
  'Plantão único',
  'Cuidador',
  '20/06/2026',
  '08:00',
  '18:00',
  '10h',
  'São Paulo',
  'SP',
  'Jardins',
  '01402000',
  'Alameda Santos',
  '1000',
  'E2ETESTE',
  '75',
  'Cadeirante, precisa de auxílio banho'
) ON CONFLICT (id) DO UPDATE SET status = 'Procurando profissional';

-- 3. Injetar um Convite (Oportunidade) enviado para o Profissional
INSERT INTO public.oportunidades_profissionais (
  id,
  solicitacao_id,
  profissional_id,
  status,
  valor_oferecido
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Enviada',
  100.00
) ON CONFLICT (id) DO UPDATE SET status = 'Enviada';
