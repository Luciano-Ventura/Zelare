-- 06_add_horario_fim_familia.sql

ALTER TABLE public.familias_solicitacoes
ADD COLUMN IF NOT EXISTS horario_fim TEXT;

NOTIFY pgrst, 'reload schema';
