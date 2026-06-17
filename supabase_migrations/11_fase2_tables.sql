-- 11_fase2_tables.sql

-- 1. Adicionar colunas de acesso PWA na tabela profissionais_cadastros
ALTER TABLE public.profissionais_cadastros
ADD COLUMN IF NOT EXISTS token_acesso UUID UNIQUE,
ADD COLUMN IF NOT EXISTS token_gerado_em TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS ultimo_acesso_app TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS acesso_app_status TEXT DEFAULT 'Ativo';

-- 2. Adicionar colunas de Check-in/Check-out GPS na tabela plantoes
ALTER TABLE public.plantoes
ADD COLUMN IF NOT EXISTS checkin_lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS checkin_lng DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS checkin_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS checkin_distancia_km DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS checkin_status TEXT,

ADD COLUMN IF NOT EXISTS checkout_lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS checkout_lng DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS checkout_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS checkout_distancia_km DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS checkout_status TEXT;

-- 3. Criar tabela de Diário de Bordo
CREATE TABLE IF NOT EXISTS public.diario_bordo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    plantao_id UUID REFERENCES public.plantoes(id) ON DELETE CASCADE,
    profissional_id UUID REFERENCES public.profissionais_cadastros(id) ON DELETE SET NULL,
    
    alimentacao TEXT,
    hidratacao TEXT,
    medicacao TEXT,
    higiene TEXT,
    troca_fralda TEXT,
    sono_repouso TEXT,
    humor TEXT,
    atividades_realizadas TEXT,
    intercorrencias TEXT,
    sinais_alerta BOOLEAN DEFAULT false,
    observacoes TEXT,
    foto_url TEXT,
    confirmacao_profissional BOOLEAN DEFAULT false
);

-- Forçar o reload do cache do PostgREST
NOTIFY pgrst, 'reload schema';
