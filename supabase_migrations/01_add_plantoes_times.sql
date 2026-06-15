ALTER TABLE public.plantoes 
ADD COLUMN IF NOT EXISTS inicio_em TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.plantoes 
ADD COLUMN IF NOT EXISTS fim_em TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_plantoes_profissional_periodo
ON public.plantoes (profissional_id, inicio_em, fim_em);

CREATE INDEX IF NOT EXISTS idx_plantoes_status
ON public.plantoes (status);
