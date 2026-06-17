-- 14_create_ocorrencias.sql

CREATE TABLE IF NOT EXISTS public.ocorrencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    plantao_id UUID REFERENCES public.plantoes(id) ON DELETE CASCADE,
    tipo_ocorrencia TEXT NOT NULL,
    gravidade TEXT NOT NULL CHECK (gravidade IN ('Baixa', 'Média', 'Alta', 'Crítica')),
    descricao TEXT NOT NULL,
    responsavel TEXT,
    status TEXT DEFAULT 'Aberta'
);

-- Dados fictícios para teste
INSERT INTO public.ocorrencias (tipo_ocorrencia, gravidade, descricao, responsavel, status, plantao_id)
VALUES 
('Atraso do Profissional', 'Média', 'Profissional chegou 40 minutos atrasado no plantão.', 'Equipe de Operações', 'Em análise', (SELECT id FROM public.plantoes LIMIT 1 OFFSET 0)),
('Reclamação da Família', 'Alta', 'Família reclamou que profissional estava no celular durante o turno.', 'Coordenação', 'Aberta', (SELECT id FROM public.plantoes LIMIT 1 OFFSET 1)),
('Dúvida sobre Medicamento', 'Baixa', 'Cuidador ligou para confirmar a dosagem do remédio da tarde.', 'Enfermagem', 'Resolvida', (SELECT id FROM public.plantoes LIMIT 1 OFFSET 2)),
('Falta Injustificada', 'Crítica', 'Profissional não apareceu para o plantão noturno.', 'Coordenação', 'Aberta', (SELECT id FROM public.plantoes LIMIT 1 OFFSET 3));

NOTIFY pgrst, 'reload schema';
