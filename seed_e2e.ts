import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeed() {
  console.log("Seeding Mariana Cuidadora...");
  const { error: err1 } = await supabase.from("profissionais_cadastros").upsert({
    id: '11111111-1111-1111-1111-111111111111',
    nome_completo: 'Mariana Cuidadora Teste',
    whatsapp: '11999999999',
    status: 'Ativo',
    status_acesso: 'Ativo',
    acesso_token: '123456',
    categoria_profissional: 'Cuidador',
    cidade: 'São Paulo',
    bairro: 'Pinheiros',
    endereco_base_completo: 'Rua dos Pinheiros',
    endereco_base_numero: '100',
    raio_atendimento_km: 15,
    tipos_atendimento: 'Idosos Acamados',
    tempo_experiencia: '5 anos',
    disponibilidade: 'Integral',
    regioes_atende: 'São Paulo',
    privacy_accepted_at: new Date().toISOString(),
    contact_accepted_at: new Date().toISOString(),
    veracity_accepted_at: new Date().toISOString()
  });
  if (err1) console.error("Error 1:", err1);

  console.log("Seeding Família Silva...");
  const { error: err2 } = await supabase.from("familias_solicitacoes").upsert({
    id: '22222222-2222-2222-2222-222222222222',
    nome_completo: 'Família Silva Teste E2E',
    whatsapp: '11988888888',
    status: 'Procurando profissional',
    tipo_profissional: 'Cuidador',
    data_desejada: '2026-06-20',
    horario_desejado: '08:00',
    horario_fim: '18:00',
    duracao_plantao: '10h',
    cidade: 'São Paulo',
    endereco_cidade: 'São Paulo',
    bairro: 'Jardins',
    endereco_bairro: 'Jardins',
    endereco_estado: 'SP',
    endereco_cep: '01402000',
    endereco_completo: 'Alameda Santos',
    endereco_numero: '1000',
    codigo_acompanhamento: 'E2ETESTE',
    para_quem: 'Avó, 75 anos, precisa de auxílio banho',
    preferencia_atendimento: 'Opção mais econômica',
    privacy_accepted_at: new Date().toISOString(),
    contact_accepted_at: new Date().toISOString()
  });
  if (err2) console.error("Error 2:", err2);

  console.log("Seeding Convite...");
  const { error: err3 } = await supabase.from("oportunidades_profissionais").upsert({
    id: '33333333-3333-3333-3333-333333333333',
    solicitacao_id: '22222222-2222-2222-2222-222222222222',
    profissional_id: '11111111-1111-1111-1111-111111111111',
    status: 'Enviada',
    valor_oferecido: 100.00
  });
  if (err3) console.error("Error 3:", err3);

  console.log("Seed done!");
}

runSeed();
