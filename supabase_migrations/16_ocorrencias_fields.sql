-- Migração 16: Adicionar campo aberta_por em ocorrencias

ALTER TABLE public.ocorrencias
ADD COLUMN IF NOT EXISTS aberta_por TEXT; -- Pode ser 'admin', 'familia', 'profissional'

-- Atualizar cache do postgrest
NOTIFY pgrst, 'reload schema';
