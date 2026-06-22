-- Migration para criar tabela de logs de auditoria
-- supabase_migrations/04_audit_logs.sql

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id TEXT,
    user_email TEXT,
    role TEXT,
    acao TEXT NOT NULL,
    entidade TEXT,
    entidade_id TEXT,
    antes JSONB,
    depois JSONB,
    ip TEXT,
    user_agent TEXT,
    metadata JSONB
);

-- Habilitar RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Política de leitura: Somente usuários autenticados (ou apenas admins futuramente, ajustado conforme a role)
-- Por enquanto, service_role bypasses RLS, o que resolve a escrita pelo servidor.
-- Para leitura no frontend (se houver no admin), vamos permitir ler, mas normalmente apenas via dashboard admin protegido.
CREATE POLICY "Admin pode ler audit_logs" 
ON public.audit_logs FOR SELECT 
TO authenticated 
USING (true); 
-- *Nota: O RLS bloqueia inserts anônimos/públicos. O insert pelo servidor (service_role) irá ignorar essa política e gravar com sucesso.

-- Adicionar índice para melhorar buscas futuras
CREATE INDEX IF NOT EXISTS idx_audit_logs_entidade ON public.audit_logs(entidade, entidade_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_acao ON public.audit_logs(acao);
