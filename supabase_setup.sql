-- SQL Script para rodar no SQL Editor do Supabase

-- Tabela: familias_solicitacoes
CREATE TABLE public.familias_solicitacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    cidade TEXT NOT NULL,
    bairro TEXT NOT NULL,
    para_quem TEXT NOT NULL,
    tipo_profissional TEXT NOT NULL,
    data_desejada TEXT NOT NULL,
    horario_desejado TEXT NOT NULL,
    duracao_plantao TEXT NOT NULL,
    e_urgente BOOLEAN NOT NULL DEFAULT false,
    atividades_necessarias TEXT,
    valor_sugerido TEXT,
    observacoes TEXT,
    
    -- Campos de controle e rastreamento
    status TEXT NOT NULL DEFAULT 'Novo pedido',
    source TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    privacy_accepted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    contact_accepted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: profissionais_cadastros
CREATE TABLE public.profissionais_cadastros (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    cidade TEXT NOT NULL,
    bairro TEXT NOT NULL,
    categoria_profissional TEXT NOT NULL,
    tipos_atendimento TEXT NOT NULL,
    tempo_experiencia TEXT NOT NULL,
    possui_formacao BOOLEAN NOT NULL DEFAULT false,
    descricao_experiencia TEXT,
    disponibilidade TEXT NOT NULL,
    regioes_atende TEXT NOT NULL,
    valor_medio TEXT,
    possui_referencias BOOLEAN NOT NULL DEFAULT false,
    observacoes TEXT,
    
    -- Campos de controle e rastreamento
    status TEXT NOT NULL DEFAULT 'Novo cadastro',
    source TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    privacy_accepted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    contact_accepted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    veracity_accepted_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) para proteger os dados (Apenas o servidor / Service Role pode ler/gravar)
ALTER TABLE public.familias_solicitacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profissionais_cadastros ENABLE ROW LEVEL SECURITY;

-- IMPORTANTE: Não criaremos NENHUMA policy (política de acesso) para usuários anônimos.
-- Isso significa que nenhuma requisição vinda diretamente do navegador conseguirá ler ou escrever dados usando apenas a ANON KEY.
-- As inserções serão feitas no Next.js usando Server Actions e a SERVICE_ROLE_KEY ou a ANON KEY (desde que contornada no backend com service_role).
-- No nosso caso, como enviaremos via Server Actions, usaremos a chave de admin (service_role) no servidor, garantindo segurança total.

-- Caso você queira usar a anon_key no servidor (para manter restrito, mas permitir apenas inserção do seu próprio app), 
-- podemos criar uma policy de INSERT apenas (mas o recomendado pelo seu plano é não expor nada, então o RLS sem permissões de rede pública já resolve).
-- Deixe sem policies públicas!
