-- 19_fix_acesso_token.sql
-- Limpa token_acesso (UUID) antigo e popula acesso_token com OTP (código de 6 caracteres)

-- Remove a coluna antiga em UUID que causou confusão
ALTER TABLE public.profissionais_cadastros DROP COLUMN IF EXISTS token_acesso;

-- Garante que acesso_token existe como texto
ALTER TABLE public.profissionais_cadastros ADD COLUMN IF NOT EXISTS acesso_token TEXT;

-- Gera um OTP numérico ou alfanumérico novo de 6 dígitos
UPDATE public.profissionais_cadastros
SET acesso_token = upper(substring(md5(random()::text) from 1 for 6));
