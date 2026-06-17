-- SQL Script: Fase 2 - Financeiro e Pagamento Online MVP

-- ==========================================
-- 1. Alterações nas tabelas existentes
-- ==========================================

-- Adicionar campos financeiros em plantoes
ALTER TABLE public.plantoes
ADD COLUMN IF NOT EXISTS valor_profissional NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS taxa_zelare NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_familia NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS status_financeiro TEXT DEFAULT 'Aguardando pagamento';

-- Adicionar campos Pix no profissional
ALTER TABLE public.profissionais_cadastros
ADD COLUMN IF NOT EXISTS pix_chave TEXT,
ADD COLUMN IF NOT EXISTS pix_tipo TEXT;

-- ==========================================
-- 2. Criação da tabela de Pagamentos (Família -> Zelare)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.pagamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE,
    plantao_id UUID REFERENCES public.plantoes(id) ON DELETE SET NULL,
    solicitacao_id UUID REFERENCES public.familias_solicitacoes(id) ON DELETE SET NULL,
    familia_nome TEXT,
    familia_whatsapp TEXT,
    valor_profissional NUMERIC(10,2) NOT NULL DEFAULT 0,
    taxa_zelare NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_familia NUMERIC(10,2) NOT NULL DEFAULT 0,
    metodo_pagamento TEXT,
    status_pagamento TEXT NOT NULL DEFAULT 'Aguardando pagamento',
    link_pagamento TEXT,
    payment_provider TEXT,
    provider_payment_id TEXT,
    pago_em TIMESTAMP WITH TIME ZONE,
    observacoes TEXT
);

-- ==========================================
-- 3. Criação da tabela de Repasses (Zelare -> Profissional)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.repasses_profissionais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE,
    plantao_id UUID REFERENCES public.plantoes(id) ON DELETE SET NULL,
    profissional_id UUID REFERENCES public.profissionais_cadastros(id) ON DELETE SET NULL,
    profissional_nome TEXT,
    profissional_pix TEXT,
    valor_profissional NUMERIC(10,2) NOT NULL DEFAULT 0,
    status_repasse TEXT NOT NULL DEFAULT 'Aguardando conclusão',
    data_prevista_repasse DATE,
    repassado_em TIMESTAMP WITH TIME ZONE,
    comprovante_url TEXT,
    observacoes TEXT
);

-- ==========================================
-- 4. Criação da tabela de Disputas (Para log/futuro)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.disputas_financeiras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    plantao_id UUID REFERENCES public.plantoes(id) ON DELETE SET NULL,
    tipo TEXT,
    descricao TEXT,
    status TEXT DEFAULT 'Aberta',
    responsavel TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- 5. Criação de Índices
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_pagamentos_plantao_id ON public.pagamentos (plantao_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON public.pagamentos (status_pagamento);

CREATE INDEX IF NOT EXISTS idx_repasses_plantao_id ON public.repasses_profissionais (plantao_id);
CREATE INDEX IF NOT EXISTS idx_repasses_profissional_id ON public.repasses_profissionais (profissional_id);
CREATE INDEX IF NOT EXISTS idx_repasses_status ON public.repasses_profissionais (status_repasse);

-- Atualiza cache do PostgREST (Supabase API)
NOTIFY pgrst, 'reload schema';
