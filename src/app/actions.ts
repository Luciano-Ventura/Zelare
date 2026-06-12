"use server";

import { createAdminClient } from "@/lib/supabaseAdmin";
import { familiaSchema, profissionalSchema, FamiliaData, ProfissionalData } from "@/lib/schemas";

export async function submitFamilia(data: FamiliaData) {
  // 1. Validação no lado do servidor para garantir que os dados não foram adulterados
  const parsed = familiaSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() };
  }

  const validData = parsed.data;

  // 2. Extrair booleanos para conversão em timestamp
  const now = new Date().toISOString();
  
  // 3. Montar payload do banco (sem as chaves booleanas do frontend que viraram timestamps)
  const dbPayload = {
    nome_completo: validData.nome_completo,
    whatsapp: validData.whatsapp.replace(/\D/g, ""),
    cidade: validData.cidade,
    bairro: validData.bairro,
    para_quem: validData.para_quem,
    tipo_profissional: validData.tipo_profissional,
    data_desejada: validData.data_desejada,
    horario_desejado: validData.horario_desejado,
    duracao_plantao: validData.duracao_plantao,
    e_urgente: validData.e_urgente,
    atividades_necessarias: validData.atividades_necessarias || null,
    valor_sugerido: validData.valor_sugerido || null,
    observacoes: validData.observacoes || null,
    
    // Status e timestamps
    status: 'Novo pedido',
    privacy_accepted_at: now,
    contact_accepted_at: now,
    
    // Tracking
    source: validData.source || null,
    utm_source: validData.utm_source || null,
    utm_medium: validData.utm_medium || null,
    utm_campaign: validData.utm_campaign || null,
  };

  // 4. Inserir no Supabase usando o cliente admin (Service Role)
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('familias_solicitacoes')
    .insert([dbPayload]);

  if (error) {
    console.error("Erro ao inserir solicitação de família no Supabase:", error);
    return { success: false, error: "Erro interno ao salvar dados. Tente novamente mais tarde." };
  }

  // 5. Notificação Interna (Webhook n8n ou Email - Deixando estrutura pronta)
  // await sendWebhookNotification("familia", dbPayload);

  return { success: true };
}

export async function submitProfissional(data: ProfissionalData) {
  // 1. Validação no lado do servidor
  const parsed = profissionalSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() };
  }

  const validData = parsed.data;
  const now = new Date().toISOString();

  // 3. Montar payload do banco
  const dbPayload = {
    nome_completo: validData.nome_completo,
    whatsapp: validData.whatsapp.replace(/\D/g, ""),
    cidade: validData.cidade,
    bairro: validData.bairro,
    categoria_profissional: validData.categoria_profissional,
    tipos_atendimento: validData.tipos_atendimento,
    tempo_experiencia: validData.tempo_experiencia,
    possui_formacao: validData.possui_formacao,
    descricao_experiencia: validData.descricao_experiencia || null,
    disponibilidade: validData.disponibilidade,
    regioes_atende: validData.regioes_atende,
    valor_medio: validData.valor_medio || null,
    possui_referencias: validData.possui_referencias,
    observacoes: validData.observacoes || null,
    
    // Status e timestamps
    status: 'Novo cadastro',
    privacy_accepted_at: now,
    contact_accepted_at: now,
    veracity_accepted_at: now,
    
    // Tracking
    source: validData.source || null,
    utm_source: validData.utm_source || null,
    utm_medium: validData.utm_medium || null,
    utm_campaign: validData.utm_campaign || null,
  };

  // 4. Inserir no Supabase usando o cliente admin
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('profissionais_cadastros')
    .insert([dbPayload]);

  if (error) {
    console.error("Erro ao inserir cadastro de profissional no Supabase:", error);
    return { success: false, error: "Erro interno ao salvar dados. Tente novamente mais tarde." };
  }

  // 5. Notificação Interna
  // await sendWebhookNotification("profissional", dbPayload);

  return { success: true };
}
