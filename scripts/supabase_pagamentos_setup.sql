-- Criação da tabela de pagamentos caso não exista (fallback)
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitacao_id UUID REFERENCES familias_solicitacoes(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar as novas colunas Pix caso a tabela já existisse com estrutura antiga
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pagamentos' AND column_name='valor_centavos') THEN
        ALTER TABLE pagamentos ADD COLUMN valor_centavos INTEGER;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pagamentos' AND column_name='status') THEN
        ALTER TABLE pagamentos ADD COLUMN status VARCHAR(50) DEFAULT 'PENDING';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pagamentos' AND column_name='gateway') THEN
        ALTER TABLE pagamentos ADD COLUMN gateway VARCHAR(50) DEFAULT 'abacatepay';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pagamentos' AND column_name='gateway_id') THEN
        ALTER TABLE pagamentos ADD COLUMN gateway_id VARCHAR(255);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pagamentos' AND column_name='qr_code_url') THEN
        ALTER TABLE pagamentos ADD COLUMN qr_code_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pagamentos' AND column_name='pix_emv') THEN
        ALTER TABLE pagamentos ADD COLUMN pix_emv TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pagamentos' AND column_name='webhook_payload') THEN
        ALTER TABLE pagamentos ADD COLUMN webhook_payload JSONB;
    END IF;
END $$;

-- Criação da tabela de repasses
CREATE TABLE IF NOT EXISTS repasses_profissionais (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plantao_id UUID, -- Referência futura se existir tabela plantoes
  solicitacao_id UUID REFERENCES familias_solicitacoes(id) ON DELETE SET NULL,
  profissional_id UUID REFERENCES profissionais_cadastros(id) ON DELETE SET NULL,
  valor_centavos INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  comprovante_url TEXT,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adiciona colunas na tabela de solicitações se não existirem
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='familias_solicitacoes' AND column_name='valor_cobrado_centavos') THEN
        ALTER TABLE familias_solicitacoes ADD COLUMN valor_cobrado_centavos INTEGER;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='familias_solicitacoes' AND column_name='pagamento_status') THEN
        ALTER TABLE familias_solicitacoes ADD COLUMN pagamento_status VARCHAR(50) DEFAULT 'PENDING';
    END IF;
END $$;
