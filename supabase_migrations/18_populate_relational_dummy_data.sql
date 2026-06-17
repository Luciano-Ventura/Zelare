-- 18_populate_relational_dummy_data.sql
-- Vincula profissionais aleatórios às solicitações existentes para gerar Plantões, Pagamentos, Repasses, Ocorrências e Diários de Bordo.

-- Garante que o campo aberta_por existe
ALTER TABLE public.ocorrencias ADD COLUMN IF NOT EXISTS aberta_por TEXT;

DO $$
DECLARE
    sol_record RECORD;
    prof_id UUID;
    prof_nome TEXT;
    prof_whats TEXT;
    novo_plantao_id UUID;
    v_status_plantao TEXT;
    v_status_pagamento TEXT;
    v_status_repasse TEXT;
    v_link_pagamento TEXT;
BEGIN
    FOR sol_record IN 
        SELECT id, nome_completo, whatsapp, cidade, bairro, tipo_profissional, data_desejada, horario_desejado, duracao_plantao, status 
        FROM public.familias_solicitacoes
        WHERE status NOT IN ('Novo pedido', 'Em análise', 'Aguardando informações', 'Procurando profissional')
    LOOP
        -- Pega um profissional aleatorio (qualquer um validado/aprovado para teste)
        SELECT id, nome_completo, whatsapp 
        INTO prof_id, prof_nome, prof_whats
        FROM public.profissionais_cadastros
        WHERE status IN ('Validado', 'Aprovado')
        ORDER BY random()
        LIMIT 1;

        IF prof_id IS NULL THEN
            CONTINUE;
        END IF;

        -- Regras de status baseadas no status da solicitação
        IF sol_record.status = 'Aguardando pagamento' THEN
            v_status_plantao := 'Confirmado';
            v_status_pagamento := 'Aguardando pagamento';
            v_status_repasse := 'Aguardando conclusão';
            v_link_pagamento := 'https://link.mercadopago.com.br/teste_zelare';
        ELSIF sol_record.status = 'Confirmado' THEN
            v_status_plantao := 'Confirmado';
            v_status_pagamento := 'Pago';
            v_status_repasse := 'Aguardando conclusão';
            v_link_pagamento := NULL;
        ELSIF sol_record.status = 'Em andamento' THEN
            v_status_plantao := 'Em andamento';
            v_status_pagamento := 'Pago';
            v_status_repasse := 'Aguardando conclusão';
            v_link_pagamento := NULL;
        ELSIF sol_record.status = 'Concluído' THEN
            v_status_plantao := 'Concluído';
            v_status_pagamento := 'Pago';
            v_status_repasse := 'Repasse concluído';
            v_link_pagamento := NULL;
        ELSIF sol_record.status = 'Cancelado' THEN
            v_status_plantao := 'Cancelado';
            v_status_pagamento := 'Cancelado';
            v_status_repasse := 'Cancelado';
            v_link_pagamento := NULL;
        ELSE
            v_status_plantao := 'Confirmado';
            v_status_pagamento := 'Aguardando pagamento';
            v_status_repasse := 'Aguardando conclusão';
            v_link_pagamento := NULL;
        END IF;

        -- 1. Insere plantao
        INSERT INTO public.plantoes (
            solicitacao_id, profissional_id, familia_nome, familia_whatsapp, 
            profissional_nome, profissional_whatsapp, data_plantao, horario_inicio, duracao,
            cidade, bairro, tipo_cuidado, valor_profissional, taxa_zelare, total_familia, status, status_financeiro
        ) VALUES (
            sol_record.id, prof_id, sol_record.nome_completo, sol_record.whatsapp,
            prof_nome, prof_whats, sol_record.data_desejada, sol_record.horario_desejado, sol_record.duracao_plantao,
            sol_record.cidade, sol_record.bairro, sol_record.tipo_profissional, 
            150.00, 30.00, 180.00, 
            v_status_plantao, v_status_pagamento
        ) RETURNING id INTO novo_plantao_id;

        -- 2. Insere Pagamento
        IF v_status_pagamento IS NOT NULL THEN
            INSERT INTO public.pagamentos (
                plantao_id, solicitacao_id, familia_nome, familia_whatsapp, 
                valor_profissional, taxa_zelare, total_familia, status_pagamento, link_pagamento
            ) VALUES (
                novo_plantao_id, sol_record.id, sol_record.nome_completo, sol_record.whatsapp,
                150.00, 30.00, 180.00, 
                v_status_pagamento,
                v_link_pagamento
            );
        END IF;

        -- 3. Insere Repasse Pendente ou concluido
        IF v_status_pagamento = 'Pago' THEN
            INSERT INTO public.repasses_profissionais (
                plantao_id, profissional_id, profissional_nome, profissional_pix,
                valor_profissional, status_repasse
            ) VALUES (
                novo_plantao_id, prof_id, prof_nome, '11999999999',
                150.00,
                v_status_repasse
            );
        END IF;

        -- 4. Ocorrencias randomicas (30% de chance para cada plantão)
        IF random() > 0.7 THEN
            INSERT INTO public.ocorrencias (
                plantao_id, solicitacao_id, profissional_id, tipo_ocorrencia, descricao, gravidade, status, aberta_por
            ) VALUES (
                novo_plantao_id, sol_record.id, prof_id, 
                CASE WHEN random() > 0.5 THEN 'Atraso' ELSE 'Desentendimento' END, 
                'Relato automático de teste.', 
                CASE WHEN random() > 0.5 THEN 'Baixa' ELSE 'Média' END, 
                CASE WHEN random() > 0.5 THEN 'Resolvida' ELSE 'Aberta' END,
                CASE WHEN random() > 0.5 THEN 'Família (Portal de Acompanhamento)' ELSE 'Profissional (App)' END
            );
        END IF;

        -- 5. Avaliacoes e Diario de Bordo (Se concluido)
        IF sol_record.status = 'Concluído' THEN
            INSERT INTO public.avaliacoes (
                plantao_id, solicitacao_id, profissional_id, nome_familia, nome_profissional, nota, comentario, quem_avaliou
            ) VALUES (
                novo_plantao_id, sol_record.id, prof_id, sol_record.nome_completo, prof_nome,
                floor(random() * 2 + 4), 'Foi muito bom o atendimento, recomendo muito!', 'familia'
            );
            
            INSERT INTO public.diario_bordo (
                plantao_id, profissional_id, alimentacao, hidratacao, medicacao, higiene, 
                atividades_realizadas, sinais_alerta, observacoes, confirmacao_profissional
            ) VALUES (
                novo_plantao_id, prof_id, 'Aceitou bem o almoço', 'Bebeu 1L de água', 'Medicamentos administrados às 12h', 'Banho realizado no leito',
                'Passeio no sol por 20 minutos', false, 'Paciente calmo e cooperativo.', true
            );
        END IF;

    END LOOP;
END $$;
