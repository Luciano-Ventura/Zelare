-- 09_fix_plantoes_columns.sql

-- Garantir que as colunas existam
ALTER TABLE public.plantoes
ADD COLUMN IF NOT EXISTS status_financeiro TEXT DEFAULT 'Aguardando pagamento',
ADD COLUMN IF NOT EXISTS pricing_id UUID REFERENCES public.pricing_regioes(id),
ADD COLUMN IF NOT EXISTS valor_base_regiao NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS valor_minimo_profissional_usado NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS margem_percentual NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS houve_ajuste_manual BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS motivo_ajuste_manual TEXT;

-- Forçar o reload do cache do PostgREST
NOTIFY pgrst, 'reload schema';
