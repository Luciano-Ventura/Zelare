-- SQL Script: Fase 2 - PWA do Profissional e Portal Família

-- ==========================================
-- 1. Alterações em profissionais_cadastros
-- ==========================================
ALTER TABLE public.profissionais_cadastros
ADD COLUMN IF NOT EXISTS acesso_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS status_acesso TEXT DEFAULT 'Ativo' CHECK (status_acesso IN ('Ativo', 'Bloqueado', 'Expirado')),
ADD COLUMN IF NOT EXISTS ultimo_acesso TIMESTAMP WITH TIME ZONE;

-- Criar índice no token para acelerar o login
CREATE INDEX IF NOT EXISTS idx_profissionais_acesso_token ON public.profissionais_cadastros (acesso_token);

-- ==========================================
-- 2. Alterações em familias_solicitacoes
-- ==========================================
ALTER TABLE public.familias_solicitacoes
ADD COLUMN IF NOT EXISTS codigo_acompanhamento TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS status_publico TEXT,
ADD COLUMN IF NOT EXISTS proximo_passo_publico TEXT;

CREATE INDEX IF NOT EXISTS idx_solicitacoes_codigo ON public.familias_solicitacoes (codigo_acompanhamento);

-- ==========================================
-- 3. Alterações em plantoes
-- ==========================================
ALTER TABLE public.plantoes
ADD COLUMN IF NOT EXISTS status_profissional TEXT,
ADD COLUMN IF NOT EXISTS saiu_para_local_em TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS chegou_ao_local_em TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS iniciado_em TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS finalizado_em TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS observacoes_profissional TEXT,
ADD COLUMN IF NOT EXISTS checklist_finalizacao JSONB;

-- ==========================================
-- 4. Nova Tabela: oportunidades_profissionais
-- ==========================================
CREATE TABLE IF NOT EXISTS public.oportunidades_profissionais (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    solicitacao_id UUID REFERENCES public.familias_solicitacoes(id) ON DELETE CASCADE,
    profissional_id UUID REFERENCES public.profissionais_cadastros(id) ON DELETE CASCADE,
    plantao_id UUID REFERENCES public.plantoes(id) ON DELETE SET NULL,
    
    status TEXT NOT NULL DEFAULT 'Enviada' CHECK (status IN ('Enviada', 'Visualizada', 'Aceita', 'Recusada', 'Contraproposta', 'Expirada', 'Cancelada')),
    
    valor_oferecido NUMERIC(10, 2),
    valor_contraproposta NUMERIC(10, 2),
    observacao_contraproposta TEXT,
    
    resposta_em TIMESTAMP WITH TIME ZONE,
    motivo_recusa TEXT
);

-- RLS para oportunidades
ALTER TABLE public.oportunidades_profissionais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Apenas admin_users podem ler e escrever oportunidades" ON public.oportunidades_profissionais
    FOR ALL
    USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

-- ==========================================
-- AVISO: Recarregar schema cache do Supabase
-- ==========================================
NOTIFY pgrst, 'reload schema';
