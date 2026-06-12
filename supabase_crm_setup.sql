-- SQL Script complementar para o CRM Interno da Zelare

-- ==========================================
-- 1. Tabela: admin_users
-- ==========================================
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'operador')),
    nome TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Apenas admin pode ler e escrever admin_users" ON public.admin_users
    FOR ALL
    USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE role = 'admin'));

-- Policy de leitura para que o proprio usuario possa ler seu role
CREATE POLICY "Usuario pode ler proprio perfil" ON public.admin_users
    FOR SELECT
    USING (auth.uid() = id);

-- ==========================================
-- 2. Tabela: plantoes
-- ==========================================
CREATE TABLE public.plantoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Relacionamentos Opcionais
    solicitacao_id UUID REFERENCES public.familias_solicitacoes(id) ON DELETE SET NULL,
    profissional_id UUID REFERENCES public.profissionais_cadastros(id) ON DELETE SET NULL,
    
    -- Dados Desnormalizados (caso a solicitacao ou profissional sejam excluidos ou nao vinculados)
    familia_nome TEXT NOT NULL,
    familia_whatsapp TEXT NOT NULL,
    profissional_nome TEXT NOT NULL,
    profissional_whatsapp TEXT NOT NULL,
    
    data_plantao TEXT NOT NULL,
    horario_inicio TEXT NOT NULL,
    duracao TEXT NOT NULL,
    cidade TEXT NOT NULL,
    bairro TEXT NOT NULL,
    tipo_cuidado TEXT NOT NULL,
    
    valor_profissional NUMERIC(10, 2),
    taxa_zelare NUMERIC(10, 2),
    total_familia NUMERIC(10, 2),
    
    status TEXT NOT NULL DEFAULT 'Confirmado',
    observacoes_internas TEXT
);

-- RLS
ALTER TABLE public.plantoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Apenas admin_users podem ler e escrever plantoes" ON public.plantoes
    FOR ALL
    USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

-- ==========================================
-- 3. Tabela: avaliacoes
-- ==========================================
CREATE TABLE public.avaliacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    plantao_id UUID REFERENCES public.plantoes(id) ON DELETE CASCADE,
    solicitacao_id UUID REFERENCES public.familias_solicitacoes(id) ON DELETE SET NULL,
    profissional_id UUID REFERENCES public.profissionais_cadastros(id) ON DELETE SET NULL,
    
    nome_familia TEXT,
    nome_profissional TEXT,
    
    nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    quem_avaliou TEXT NOT NULL CHECK (quem_avaliou IN ('familia', 'profissional')),
    teve_ocorrencia BOOLEAN DEFAULT false
);

-- RLS
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Apenas admin_users podem ler e escrever avaliacoes" ON public.avaliacoes
    FOR ALL
    USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

-- ==========================================
-- 4. Tabela: ocorrencias
-- ==========================================
CREATE TABLE public.ocorrencias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    plantao_id UUID REFERENCES public.plantoes(id) ON DELETE CASCADE,
    solicitacao_id UUID REFERENCES public.familias_solicitacoes(id) ON DELETE SET NULL,
    profissional_id UUID REFERENCES public.profissionais_cadastros(id) ON DELETE SET NULL,
    
    tipo_ocorrencia TEXT NOT NULL,
    descricao TEXT NOT NULL,
    gravidade TEXT NOT NULL CHECK (gravidade IN ('Baixa', 'Média', 'Alta', 'Crítica')),
    status TEXT NOT NULL DEFAULT 'Aberta',
    responsavel TEXT, -- Nome do admin que esta tratando
    observacoes_internas TEXT
);

-- RLS
ALTER TABLE public.ocorrencias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Apenas admin_users podem ler e escrever ocorrencias" ON public.ocorrencias
    FOR ALL
    USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

-- ==========================================
-- 5. Tabela: observacoes_internas
-- ==========================================
CREATE TABLE public.observacoes_internas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    entidade_tipo TEXT NOT NULL CHECK (entidade_tipo IN ('solicitacao', 'profissional', 'plantao', 'avaliacao', 'ocorrencia')),
    entidade_id UUID NOT NULL, -- UUID da entidade alvo
    
    autor TEXT NOT NULL, -- Email ou nome do admin
    observacao TEXT NOT NULL
);

-- RLS
ALTER TABLE public.observacoes_internas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Apenas admin_users podem ler e escrever observacoes" ON public.observacoes_internas
    FOR ALL
    USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

-- ==========================================
-- UPDATE nas Tabelas Anteriores (Apenas para garantir que Admins possam acessar tudo)
-- ==========================================
-- Obs: Ja haviamos criado estas tabelas, mas vamos garantir que o dashboard consiga ler os dados autenticados

DROP POLICY IF EXISTS "Leitura de solicitacoes para admin_users" ON public.familias_solicitacoes;
CREATE POLICY "Leitura de solicitacoes para admin_users" ON public.familias_solicitacoes
    FOR SELECT
    USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

DROP POLICY IF EXISTS "Atualizacao de solicitacoes para admin_users" ON public.familias_solicitacoes;
CREATE POLICY "Atualizacao de solicitacoes para admin_users" ON public.familias_solicitacoes
    FOR UPDATE
    USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

DROP POLICY IF EXISTS "Leitura de profissionais para admin_users" ON public.profissionais_cadastros;
CREATE POLICY "Leitura de profissionais para admin_users" ON public.profissionais_cadastros
    FOR SELECT
    USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));

DROP POLICY IF EXISTS "Atualizacao de profissionais para admin_users" ON public.profissionais_cadastros;
CREATE POLICY "Atualizacao de profissionais para admin_users" ON public.profissionais_cadastros
    FOR UPDATE
    USING (auth.uid() IN (SELECT id FROM public.admin_users WHERE is_active = true));
