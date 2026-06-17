-- 15_pilot_preparation.sql

-- 1. Ocorrencias Updates
ALTER TABLE public.ocorrencias 
ADD COLUMN IF NOT EXISTS resolucao TEXT,
ADD COLUMN IF NOT EXISTS responsavel_interno TEXT,
ADD COLUMN IF NOT EXISTS resolvido_em TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 2. Checklist Operação
CREATE TABLE IF NOT EXISTS public.checklist_operacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    item TEXT NOT NULL,
    categoria TEXT,
    status TEXT DEFAULT 'Pendente',
    observacao TEXT,
    concluido_em TIMESTAMP WITH TIME ZONE,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inserir dados padrão para o checklist (se vazio)
INSERT INTO public.checklist_operacao (item, categoria)
SELECT 'Landing publicada', 'Sistema'
WHERE NOT EXISTS (SELECT 1 FROM public.checklist_operacao LIMIT 1);

INSERT INTO public.checklist_operacao (item, categoria)
SELECT 'Formulário da família funcionando', 'Sistema'
WHERE (SELECT count(*) FROM public.checklist_operacao) = 1;

-- Deletar o parcial e inserir tudo limpo se estiver iniciando
DELETE FROM public.checklist_operacao;

INSERT INTO public.checklist_operacao (item, categoria) VALUES
('Landing publicada', 'Sistema'),
('Formulário da família funcionando', 'Sistema'),
('Cadastro profissional funcionando', 'Sistema'),
('CRM protegido', 'Segurança'),
('Profissionais iniciais cadastrados', 'Operação'),
('Profissionais validados', 'Operação'),
('Geolocalização testada', 'Sistema'),
('Bloqueio de agenda testado', 'Sistema'),
('Financeiro testado', 'Sistema'),
('Pagamento manual testado', 'Sistema'),
('Repasse manual testado', 'Sistema'),
('PWA profissional testado', 'Sistema'),
('Check-in/check-out testado', 'Sistema'),
('Diário de bordo testado', 'Sistema'),
('Portal família testado', 'Sistema'),
('Ocorrências funcionando', 'Sistema'),
('Termos de uso publicados', 'Jurídico'),
('Política de privacidade publicada', 'Jurídico'),
('Mensagens WhatsApp prontas', 'Operação'),
('Operador treinado', 'Operação');

-- 3. Configurações de Sistema (Modo Piloto)
CREATE TABLE IF NOT EXISTS public.configuracoes_sistema (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    piloto_ativo BOOLEAN DEFAULT true,
    regiao_piloto TEXT,
    observacoes_piloto TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

DELETE FROM public.configuracoes_sistema;
INSERT INTO public.configuracoes_sistema (piloto_ativo, regiao_piloto, observacoes_piloto) 
VALUES (true, 'São José, Florianópolis e Região', 'Operação em modo piloto: todas as validações devem ser feitas manualmente.');

-- 4. Checklist Validação do Profissional
ALTER TABLE public.profissionais_cadastros 
ADD COLUMN IF NOT EXISTS checklist_validacao JSONB DEFAULT '{}'::jsonb;

NOTIFY pgrst, 'reload schema';
