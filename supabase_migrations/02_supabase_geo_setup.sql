-- SQL Script: Fase 3 - Base de Geolocalização para CRM

-- ==========================================
-- 1. Alterações em familias_solicitacoes
-- ==========================================
ALTER TABLE public.familias_solicitacoes
ADD COLUMN IF NOT EXISTS endereco_completo TEXT,
ADD COLUMN IF NOT EXISTS endereco_numero TEXT,
ADD COLUMN IF NOT EXISTS endereco_complemento TEXT,
ADD COLUMN IF NOT EXISTS endereco_bairro TEXT,
ADD COLUMN IF NOT EXISTS endereco_cidade TEXT,
ADD COLUMN IF NOT EXISTS endereco_estado TEXT,
ADD COLUMN IF NOT EXISTS endereco_cep TEXT,
ADD COLUMN IF NOT EXISTS ponto_referencia TEXT,
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS localizacao_pendente BOOLEAN DEFAULT false;

-- ==========================================
-- 2. Alterações em profissionais_cadastros
-- ==========================================
ALTER TABLE public.profissionais_cadastros
ADD COLUMN IF NOT EXISTS endereco_base_completo TEXT,
ADD COLUMN IF NOT EXISTS endereco_base_numero TEXT,
ADD COLUMN IF NOT EXISTS endereco_base_complemento TEXT,
ADD COLUMN IF NOT EXISTS endereco_base_bairro TEXT,
ADD COLUMN IF NOT EXISTS endereco_base_cidade TEXT,
ADD COLUMN IF NOT EXISTS endereco_base_estado TEXT,
ADD COLUMN IF NOT EXISTS endereco_base_cep TEXT,
ADD COLUMN IF NOT EXISTS latitude_base DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude_base DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS raio_atendimento_km INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS localizacao_pendente BOOLEAN DEFAULT false;

-- ==========================================
-- 3. Criação de Índices (Geolocalização)
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_familias_solicitacoes_lat_lng ON public.familias_solicitacoes (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_profissionais_cadastros_lat_lng ON public.profissionais_cadastros (latitude_base, longitude_base);
CREATE INDEX IF NOT EXISTS idx_profissionais_cadastros_raio ON public.profissionais_cadastros (raio_atendimento_km);

-- ==========================================
-- 4. Alterações e Índices em plantoes
-- ==========================================
ALTER TABLE public.plantoes
ADD COLUMN IF NOT EXISTS inicio_em TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS fim_em TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_plantoes_profissional_periodo
ON public.plantoes (profissional_id, inicio_em, fim_em);

CREATE INDEX IF NOT EXISTS idx_plantoes_status
ON public.plantoes (status);

-- ==========================================
-- AVISO: Recarregar schema cache do Supabase
-- ==========================================
NOTIFY pgrst, 'reload schema';
