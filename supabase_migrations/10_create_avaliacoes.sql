-- 10_create_avaliacoes.sql

CREATE TABLE IF NOT EXISTS public.avaliacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    plantao_id UUID REFERENCES public.plantoes(id) ON DELETE CASCADE,
    solicitacao_id UUID REFERENCES public.familias_solicitacoes(id) ON DELETE CASCADE,
    profissional_id UUID REFERENCES public.profissionais_cadastros(id) ON DELETE CASCADE,
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT
);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_plantao_id ON public.avaliacoes (plantao_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_profissional_id ON public.avaliacoes (profissional_id);

NOTIFY pgrst, 'reload schema';
