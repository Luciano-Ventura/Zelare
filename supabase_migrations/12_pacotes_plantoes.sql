-- 12_pacotes_plantoes.sql

-- 1. Tabela de Pacotes
CREATE TABLE IF NOT EXISTS public.pacotes_plantoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    solicitacao_id UUID REFERENCES public.familias_solicitacoes(id) ON DELETE SET NULL,
    familia_nome TEXT,
    familia_whatsapp TEXT,
    profissional_id UUID REFERENCES public.profissionais_cadastros(id) ON DELETE SET NULL,
    profissional_nome TEXT,
    data_inicio DATE,
    data_fim DATE,
    dias_semana TEXT[],
    horario_inicio TEXT,
    horario_fim TEXT,
    quantidade_prevista INTEGER,
    quantidade_criada INTEGER,
    quantidade_conflito INTEGER,
    valor_por_plantao NUMERIC(10,2),
    valor_profissional_total NUMERIC(10,2),
    taxa_zelare_total NUMERIC(10,2),
    total_familia NUMERIC(10,2),
    status TEXT DEFAULT 'Aguardando pagamento',
    observacoes TEXT
);

-- 2. Atualizações em plantoes
ALTER TABLE public.plantoes
ADD COLUMN IF NOT EXISTS pacote_id UUID REFERENCES public.pacotes_plantoes(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS recorrente BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS numero_no_pacote INTEGER;

-- 3. Atualizações em pagamentos
ALTER TABLE public.pagamentos
ADD COLUMN IF NOT EXISTS pacote_id UUID REFERENCES public.pacotes_plantoes(id) ON DELETE SET NULL;

-- 4. Índice
CREATE INDEX IF NOT EXISTS idx_plantoes_pacote_id ON public.plantoes(pacote_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_pacote_id ON public.pagamentos(pacote_id);

NOTIFY pgrst, 'reload schema';
