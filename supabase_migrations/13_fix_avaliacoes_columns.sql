-- 13_fix_avaliacoes_columns.sql

ALTER TABLE public.avaliacoes
ADD COLUMN IF NOT EXISTS quem_avaliou TEXT CHECK (quem_avaliou IN ('familia', 'profissional'));

-- Forçar o reload do schema do PostgREST
NOTIFY pgrst, 'reload schema';
