-- 04_supabase_pricing_setup.sql

-- 1. Criar tabela de configuração de preços
CREATE TABLE public.pricing_regioes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ativo BOOLEAN DEFAULT true,
  estado TEXT,
  cidade TEXT,
  bairro TEXT,
  tipo_servico TEXT, -- Pode ser null se servir para todos
  categoria_profissional TEXT,
  duracao_horas INTEGER, -- Ex: 4, 6, 8, 12, 24
  turno TEXT, -- Ex: 'Dia', 'Noite', 'Qualquer'
  valor_base_profissional NUMERIC(10,2) NOT NULL,
  taxa_zelare_percentual NUMERIC(5,2) DEFAULT 20.00,
  taxa_zelare_minima NUMERIC(10,2) DEFAULT 30.00,
  valor_minimo_cliente NUMERIC(10,2),
  adicional_noturno NUMERIC(10,2) DEFAULT 0.00,
  adicional_urgencia NUMERIC(10,2) DEFAULT 0.00,
  adicional_fim_semana NUMERIC(10,2) DEFAULT 0.00,
  adicional_complexidade NUMERIC(10,2) DEFAULT 0.00,
  observacoes TEXT
);

-- RLS para pricing_regioes
ALTER TABLE public.pricing_regioes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir leitura pública de pricing_regioes" ON public.pricing_regioes FOR SELECT USING (true);
CREATE POLICY "Permitir full access admin pricing_regioes" ON public.pricing_regioes FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

-- 2. Adicionar campos na tabela profissionais_cadastros
ALTER TABLE public.profissionais_cadastros 
  ADD COLUMN IF NOT EXISTS valor_minimo_4h NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS valor_minimo_6h NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS valor_minimo_8h NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS valor_minimo_12h NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS valor_minimo_24h NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS adicional_noturno NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS adicional_urgencia NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS aceita_negociacao BOOLEAN DEFAULT true;

-- 3. Adicionar campos de controle financeiro na tabela plantoes
ALTER TABLE public.plantoes
  ADD COLUMN IF NOT EXISTS pricing_id UUID REFERENCES public.pricing_regioes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS valor_base_regiao NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS valor_minimo_profissional_usado NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS margem_percentual NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS adicionais_aplicados JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS houve_ajuste_manual BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS motivo_ajuste_manual TEXT,
  ADD COLUMN IF NOT EXISTS preco_calculado_em TIMESTAMP WITH TIME ZONE DEFAULT now();

-- 4. Inserir dados mockados para o MVP
-- Regra padrão Brasil (Fallback de última instância)
INSERT INTO public.pricing_regioes (estado, cidade, valor_base_profissional, taxa_zelare_percentual, taxa_zelare_minima, observacoes) 
VALUES ('BR', 'PADRAO', 120.00, 20.00, 30.00, 'Regra Padrão Brasil - Fallback');

-- Dados de São José, SC
INSERT INTO public.pricing_regioes (estado, cidade, duracao_horas, valor_base_profissional, taxa_zelare_percentual, taxa_zelare_minima, observacoes) 
VALUES ('SC', 'São José', 12, 150.00, 20.00, 30.00, 'São José - 12h');

INSERT INTO public.pricing_regioes (estado, cidade, duracao_horas, valor_base_profissional, taxa_zelare_percentual, taxa_zelare_minima, observacoes) 
VALUES ('SC', 'São José', 24, 250.00, 20.00, 30.00, 'São José - 24h');

-- Dados de Florianópolis, SC
INSERT INTO public.pricing_regioes (estado, cidade, duracao_horas, valor_base_profissional, taxa_zelare_percentual, taxa_zelare_minima, observacoes) 
VALUES ('SC', 'Florianópolis', 12, 160.00, 20.00, 30.00, 'Florianópolis - 12h');

INSERT INTO public.pricing_regioes (estado, cidade, duracao_horas, valor_base_profissional, taxa_zelare_percentual, taxa_zelare_minima, observacoes) 
VALUES ('SC', 'Florianópolis', 24, 280.00, 20.00, 30.00, 'Florianópolis - 24h');

-- Dados de Palhoça, SC
INSERT INTO public.pricing_regioes (estado, cidade, duracao_horas, valor_base_profissional, taxa_zelare_percentual, taxa_zelare_minima, observacoes) 
VALUES ('SC', 'Palhoça', 12, 140.00, 20.00, 30.00, 'Palhoça - 12h');

-- Dados de Biguaçu, SC
INSERT INTO public.pricing_regioes (estado, cidade, duracao_horas, valor_base_profissional, taxa_zelare_percentual, taxa_zelare_minima, observacoes) 
VALUES ('SC', 'Biguaçu', 12, 140.00, 20.00, 30.00, 'Biguaçu - 12h');
