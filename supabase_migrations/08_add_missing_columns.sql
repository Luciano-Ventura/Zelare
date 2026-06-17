-- 08_add_missing_columns.sql

-- Adicionar colunas que constam no schema zod mas que podem estar faltando no banco de dados
ALTER TABLE public.familias_solicitacoes
ADD COLUMN IF NOT EXISTS preferencia_atendimento TEXT,
ADD COLUMN IF NOT EXISTS atividades_necessarias TEXT,
ADD COLUMN IF NOT EXISTS codigo_acompanhamento TEXT,
ADD COLUMN IF NOT EXISTS source TEXT,
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT;

-- Recarregar cache
NOTIFY pgrst, 'reload schema';
