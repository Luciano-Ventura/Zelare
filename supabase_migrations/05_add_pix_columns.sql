-- 05_add_pix_columns.sql

-- Adicionar colunas bancárias/pix no profissional
ALTER TABLE public.profissionais_cadastros
ADD COLUMN IF NOT EXISTS pix_tipo TEXT,
ADD COLUMN IF NOT EXISTS pix_chave TEXT;

-- Recarregar cache do postgrest do Supabase para refletir a alteração instantaneamente
NOTIFY pgrst, 'reload schema';
