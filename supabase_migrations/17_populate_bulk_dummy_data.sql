-- 17_populate_bulk_dummy_data.sql

-- Inserindo 15 profissionais
INSERT INTO public.profissionais_cadastros (
  id, nome_completo, whatsapp, status, categoria_profissional, cidade, bairro, 
  endereco_base_completo, endereco_base_numero, latitude_base, longitude_base, 
  raio_atendimento_km, valor_minimo_12h, valor_minimo_24h, localizacao_pendente,
  tipos_atendimento, tempo_experiencia, disponibilidade, regioes_atende,
  privacy_accepted_at, contact_accepted_at, veracity_accepted_at
) VALUES 
(gen_random_uuid(), 'Profissional Teste 1', '11999990001', 'Em análise', 'Técnico de Enfermagem', 'São Paulo', 'Centro', 'Rua Teste', '10', -23.54, -46.62, 20, 130, 240, false, 'Geral', 'Mais de 2 anos', 'Integral', 'São Paulo', now(), now(), now()),
(gen_random_uuid(), 'Profissional Teste 2', '11999990002', 'Validado', 'Enfermeiro', 'Rio de Janeiro', 'Centro', 'Rua Teste', '20', -23.53, -46.61, 20, 140, 260, false, 'Geral', 'Mais de 2 anos', 'Integral', 'Rio de Janeiro', now(), now(), now()),
(gen_random_uuid(), 'Profissional Teste 3', '11999990003', 'Aprovado', 'Cuidador de Idosos', 'Belo Horizonte', 'Centro', 'Rua Teste', '30', -23.52, -46.60, 20, 150, 280, false, 'Geral', 'Mais de 2 anos', 'Integral', 'Belo Horizonte', now(), now(), now()),
(gen_random_uuid(), 'Profissional Teste 4', '11999990004', 'Novo cadastro', 'Técnico de Enfermagem', 'Curitiba', 'Centro', 'Rua Teste', '40', -23.51, -46.59, 20, 160, 300, false, 'Geral', 'Mais de 2 anos', 'Integral', 'Curitiba', now(), now(), now()),
(gen_random_uuid(), 'Profissional Teste 5', '11999990005', 'Em análise', 'Enfermeiro', 'Porto Alegre', 'Centro', 'Rua Teste', '50', -23.50, -46.58, 20, 170, 320, false, 'Geral', 'Mais de 2 anos', 'Integral', 'Porto Alegre', now(), now(), now()),
(gen_random_uuid(), 'Profissional Teste 6', '11999990006', 'Validado', 'Cuidador de Idosos', 'São Paulo', 'Centro', 'Rua Teste', '60', -23.49, -46.57, 20, 180, 340, false, 'Geral', 'Mais de 2 anos', 'Integral', 'São Paulo', now(), now(), now()),
(gen_random_uuid(), 'Profissional Teste 7', '11999990007', 'Aprovado', 'Técnico de Enfermagem', 'Rio de Janeiro', 'Centro', 'Rua Teste', '70', -23.48, -46.56, 20, 190, 360, false, 'Geral', 'Mais de 2 anos', 'Integral', 'Rio de Janeiro', now(), now(), now()),
(gen_random_uuid(), 'Profissional Teste 8', '11999990008', 'Novo cadastro', 'Enfermeiro', 'Belo Horizonte', 'Centro', 'Rua Teste', '80', -23.47, -46.55, 20, 200, 380, false, 'Geral', 'Mais de 2 anos', 'Integral', 'Belo Horizonte', now(), now(), now()),
(gen_random_uuid(), 'Profissional Teste 9', '11999990009', 'Em análise', 'Cuidador de Idosos', 'Curitiba', 'Centro', 'Rua Teste', '90', -23.46, -46.54, 20, 210, 400, false, 'Geral', 'Mais de 2 anos', 'Integral', 'Curitiba', now(), now(), now()),
(gen_random_uuid(), 'Profissional Teste 10', '11999990010', 'Validado', 'Técnico de Enfermagem', 'Porto Alegre', 'Centro', 'Rua Teste', '100', -23.45, -46.53, 20, 220, 420, false, 'Geral', 'Mais de 2 anos', 'Integral', 'Porto Alegre', now(), now(), now()),
(gen_random_uuid(), 'Profissional Teste 11', '11999990011', 'Aprovado', 'Enfermeiro', 'São Paulo', 'Centro', 'Rua Teste', '110', -23.44, -46.52, 20, 230, 440, false, 'Geral', 'Mais de 2 anos', 'Integral', 'São Paulo', now(), now(), now()),
(gen_random_uuid(), 'Profissional Teste 12', '11999990012', 'Novo cadastro', 'Cuidador de Idosos', 'Rio de Janeiro', 'Centro', 'Rua Teste', '120', -23.43, -46.51, 20, 240, 460, false, 'Geral', 'Mais de 2 anos', 'Integral', 'Rio de Janeiro', now(), now(), now()),
(gen_random_uuid(), 'Profissional Teste 13', '11999990013', 'Em análise', 'Técnico de Enfermagem', 'Belo Horizonte', 'Centro', 'Rua Teste', '130', -23.42, -46.50, 20, 250, 480, false, 'Geral', 'Mais de 2 anos', 'Integral', 'Belo Horizonte', now(), now(), now()),
(gen_random_uuid(), 'Profissional Teste 14', '11999990014', 'Validado', 'Enfermeiro', 'Curitiba', 'Centro', 'Rua Teste', '140', -23.41, -46.49, 20, 260, 500, false, 'Geral', 'Mais de 2 anos', 'Integral', 'Curitiba', now(), now(), now()),
(gen_random_uuid(), 'Profissional Teste 15', '11999990015', 'Aprovado', 'Cuidador de Idosos', 'Porto Alegre', 'Centro', 'Rua Teste', '150', -23.40, -46.48, 20, 270, 520, false, 'Geral', 'Mais de 2 anos', 'Integral', 'Porto Alegre', now(), now(), now());


-- Inserindo 20 solicitacoes
INSERT INTO public.familias_solicitacoes (
  nome_completo, whatsapp, endereco_cep, endereco_completo, endereco_numero, bairro,
  endereco_bairro, cidade, endereco_cidade, endereco_estado, latitude, longitude, 
  para_quem, tipo_profissional, data_desejada, horario_desejado, horario_fim, duracao_plantao, 
  preferencia_atendimento, e_urgente, status, codigo_acompanhamento, privacy_accepted_at, contact_accepted_at
) VALUES 
('Familia Teste 1', '11988880001', '01000-000', 'Rua Teste Familia', '100', 'Centro', 'Centro', 'Rio de Janeiro', 'Rio de Janeiro', 'SP', -23.56, -46.64, 'Parente 1', 'Técnico de Enfermagem', '2026-07-02', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', false, 'Em análise', 'FAM-TEST-1', now(), now()),
('Familia Teste 2', '11988880002', '01000-000', 'Rua Teste Familia', '200', 'Centro', 'Centro', 'Belo Horizonte', 'Belo Horizonte', 'SP', -23.57, -46.65, 'Parente 2', 'Enfermeiro', '2026-07-03', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', false, 'Aguardando informações', 'FAM-TEST-2', now(), now()),
('Familia Teste 3', '11988880003', '01000-000', 'Rua Teste Familia', '300', 'Centro', 'Centro', 'Curitiba', 'Curitiba', 'SP', -23.58, -46.66, 'Parente 3', 'Cuidador de Idosos', '2026-07-04', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', true, 'Procurando profissional', 'FAM-TEST-3', now(), now()),
('Familia Teste 4', '11988880004', '01000-000', 'Rua Teste Familia', '400', 'Centro', 'Centro', 'Porto Alegre', 'Porto Alegre', 'SP', -23.59, -46.67, 'Parente 4', 'Técnico de Enfermagem', '2026-07-05', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', false, 'Aguardando pagamento', 'FAM-TEST-4', now(), now()),
('Familia Teste 5', '11988880005', '01000-000', 'Rua Teste Familia', '500', 'Centro', 'Centro', 'São Paulo', 'São Paulo', 'SP', -23.60, -46.68, 'Parente 5', 'Enfermeiro', '2026-07-06', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', false, 'Confirmado', 'FAM-TEST-5', now(), now()),
('Familia Teste 6', '11988880006', '01000-000', 'Rua Teste Familia', '600', 'Centro', 'Centro', 'Rio de Janeiro', 'Rio de Janeiro', 'SP', -23.61, -46.69, 'Parente 6', 'Cuidador de Idosos', '2026-07-07', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', true, 'Em andamento', 'FAM-TEST-6', now(), now()),
('Familia Teste 7', '11988880007', '01000-000', 'Rua Teste Familia', '700', 'Centro', 'Centro', 'Belo Horizonte', 'Belo Horizonte', 'SP', -23.62, -46.70, 'Parente 7', 'Técnico de Enfermagem', '2026-07-08', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', false, 'Concluído', 'FAM-TEST-7', now(), now()),
('Familia Teste 8', '11988880008', '01000-000', 'Rua Teste Familia', '800', 'Centro', 'Centro', 'Curitiba', 'Curitiba', 'SP', -23.63, -46.71, 'Parente 8', 'Enfermeiro', '2026-07-09', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', false, 'Cancelado', 'FAM-TEST-8', now(), now()),
('Familia Teste 9', '11988880009', '01000-000', 'Rua Teste Familia', '900', 'Centro', 'Centro', 'Porto Alegre', 'Porto Alegre', 'SP', -23.64, -46.72, 'Parente 9', 'Cuidador de Idosos', '2026-07-10', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', true, 'Novo pedido', 'FAM-TEST-9', now(), now()),
('Familia Teste 10', '11988880010', '01000-000', 'Rua Teste Familia', '1000', 'Centro', 'Centro', 'São Paulo', 'São Paulo', 'SP', -23.65, -46.73, 'Parente 10', 'Técnico de Enfermagem', '2026-07-11', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', false, 'Em análise', 'FAM-TEST-10', now(), now()),
('Familia Teste 11', '11988880011', '01000-000', 'Rua Teste Familia', '1100', 'Centro', 'Centro', 'Rio de Janeiro', 'Rio de Janeiro', 'SP', -23.66, -46.74, 'Parente 11', 'Enfermeiro', '2026-07-12', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', false, 'Aguardando informações', 'FAM-TEST-11', now(), now()),
('Familia Teste 12', '11988880012', '01000-000', 'Rua Teste Familia', '1200', 'Centro', 'Centro', 'Belo Horizonte', 'Belo Horizonte', 'SP', -23.67, -46.75, 'Parente 12', 'Cuidador de Idosos', '2026-07-13', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', true, 'Procurando profissional', 'FAM-TEST-12', now(), now()),
('Familia Teste 13', '11988880013', '01000-000', 'Rua Teste Familia', '1300', 'Centro', 'Centro', 'Curitiba', 'Curitiba', 'SP', -23.68, -46.76, 'Parente 13', 'Técnico de Enfermagem', '2026-07-14', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', false, 'Aguardando pagamento', 'FAM-TEST-13', now(), now()),
('Familia Teste 14', '11988880014', '01000-000', 'Rua Teste Familia', '1400', 'Centro', 'Centro', 'Porto Alegre', 'Porto Alegre', 'SP', -23.69, -46.77, 'Parente 14', 'Enfermeiro', '2026-07-15', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', false, 'Confirmado', 'FAM-TEST-14', now(), now()),
('Familia Teste 15', '11988880015', '01000-000', 'Rua Teste Familia', '1500', 'Centro', 'Centro', 'São Paulo', 'São Paulo', 'SP', -23.70, -46.78, 'Parente 15', 'Cuidador de Idosos', '2026-07-16', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', true, 'Em andamento', 'FAM-TEST-15', now(), now()),
('Familia Teste 16', '11988880016', '01000-000', 'Rua Teste Familia', '1600', 'Centro', 'Centro', 'Rio de Janeiro', 'Rio de Janeiro', 'SP', -23.71, -46.79, 'Parente 16', 'Técnico de Enfermagem', '2026-07-17', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', false, 'Concluído', 'FAM-TEST-16', now(), now()),
('Familia Teste 17', '11988880017', '01000-000', 'Rua Teste Familia', '1700', 'Centro', 'Centro', 'Belo Horizonte', 'Belo Horizonte', 'SP', -23.72, -46.80, 'Parente 17', 'Enfermeiro', '2026-07-18', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', false, 'Cancelado', 'FAM-TEST-17', now(), now()),
('Familia Teste 18', '11988880018', '01000-000', 'Rua Teste Familia', '1800', 'Centro', 'Centro', 'Curitiba', 'Curitiba', 'SP', -23.73, -46.81, 'Parente 18', 'Cuidador de Idosos', '2026-07-19', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', true, 'Novo pedido', 'FAM-TEST-18', now(), now()),
('Familia Teste 19', '11988880019', '01000-000', 'Rua Teste Familia', '1900', 'Centro', 'Centro', 'Porto Alegre', 'Porto Alegre', 'SP', -23.74, -46.82, 'Parente 19', 'Técnico de Enfermagem', '2026-07-20', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', false, 'Em análise', 'FAM-TEST-19', now(), now()),
('Familia Teste 20', '11988880020', '01000-000', 'Rua Teste Familia', '2000', 'Centro', 'Centro', 'São Paulo', 'São Paulo', 'SP', -23.75, -46.83, 'Parente 20', 'Enfermeiro', '2026-07-21', '08:00', '20:00', 'Apenas 1 dia', 'Nenhuma', false, 'Aguardando informações', 'FAM-TEST-20', now(), now());
