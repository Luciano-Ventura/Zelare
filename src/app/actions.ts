"use server";

import { createAdminClient } from "@/lib/supabaseAdmin";
import { familiaSchema, profissionalSchema, FamiliaData, ProfissionalData } from "@/lib/schemas";
import { geocodeAddress } from "@/lib/geo";
import { getPaymentGateway } from "@/lib/payments";

export async function submitFamilia(data: FamiliaData) {
  // 1. Validação no lado do servidor para garantir que os dados não foram adulterados
  const parsed = familiaSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() };
  }

  const validData = parsed.data;

  // 2. Extrair booleanos para conversão em timestamp
  const now = new Date().toISOString();
  
  const codigoAcompanhamento = `ZEL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const enderecoCompletoBusca = `${validData.endereco}, ${validData.numero}, ${validData.bairro}, ${validData.cidade}, ${validData.estado}, ${validData.cep}, Brasil`;
  const geo = await geocodeAddress(enderecoCompletoBusca);

  // 3. Montar payload do banco (sem as chaves booleanas do frontend que viraram timestamps)
  const dbPayload = {
    nome_completo: validData.nome_completo,
    whatsapp: validData.whatsapp.replace(/\D/g, ""),
    cidade: validData.cidade,
    bairro: validData.bairro,
    
    // Novos campos de endereço
    endereco_completo: validData.endereco,
    endereco_numero: validData.numero,
    endereco_complemento: validData.complemento || null,
    endereco_bairro: validData.bairro,
    endereco_cidade: validData.cidade,
    endereco_estado: validData.estado,
    endereco_cep: validData.cep,
    ponto_referencia: validData.ponto_referencia || null,
    latitude: geo?.latitude || null,
    longitude: geo?.longitude || null,
    localizacao_pendente: geo ? false : true,

    para_quem: validData.para_quem,
    tipo_profissional: validData.tipo_profissional,
    data_desejada: validData.data_desejada,
    horario_desejado: validData.horario_desejado,
    horario_fim: validData.horario_fim,
    duracao_plantao: validData.duracao_plantao,
    e_urgente: validData.e_urgente,
    atividades_necessarias: validData.atividades_necessarias || null,
    // valor_sugerido: validData.valor_sugerido || null,
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

    // Portal Familia
    codigo_acompanhamento: codigoAcompanhamento,
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

  return { success: true, codigo: codigoAcompanhamento };
}

export async function submitProfissional(data: ProfissionalData) {
  // 1. Validação no lado do servidor
  const parsed = profissionalSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Dados inválidos", details: parsed.error.flatten() };
  }

  const validData = parsed.data;
  const now = new Date().toISOString();
  
  const acessoToken = Math.random().toString(36).substring(2, 8).toUpperCase();

  const enderecoCompletoBusca = `${validData.endereco_base}, ${validData.numero_base}, ${validData.bairro}, ${validData.cidade}, ${validData.estado}, ${validData.cep_base}, Brasil`;
  const geo = await geocodeAddress(enderecoCompletoBusca);

  // 3. Montar payload do banco
  const dbPayload = {
    nome_completo: validData.nome_completo,
    whatsapp: validData.whatsapp.replace(/\D/g, ""),
    cidade: validData.cidade,
    bairro: validData.bairro,

    // Novos campos de endereço base
    endereco_base_completo: validData.endereco_base,
    endereco_base_numero: validData.numero_base,
    endereco_base_complemento: validData.complemento_base || null,
    endereco_base_bairro: validData.bairro,
    endereco_base_cidade: validData.cidade,
    endereco_base_estado: validData.estado,
    endereco_base_cep: validData.cep_base,
    latitude_base: geo?.latitude || null,
    longitude_base: geo?.longitude || null,
    raio_atendimento_km: validData.raio_atendimento_km,
    localizacao_pendente: geo ? false : true,

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
    acesso_token: acessoToken,
    
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

export async function gerarCobrancaPix(solicitacaoId: string, valorCentavos: number) {
  const supabase = createAdminClient();
  
  // 1. Obter a solicitação
  const { data: solicitacao, error: fetchError } = await supabase
    .from('familias_solicitacoes')
    .select('*')
    .eq('id', solicitacaoId)
    .single();

  if (fetchError || !solicitacao) {
    return { success: false, error: "Solicitação não encontrada." };
  }

  // 2. Gerar cobrança via AbacatePay
  const gateway = getPaymentGateway();
  const paymentRes = await gateway.createPixPayment({
    amountCentavos: valorCentavos,
    description: `Plantão Zelare - Solicitante: ${solicitacao.nome_completo}`,
    externalId: solicitacao.id,
    customer: {
      name: solicitacao.nome_completo,
      email: `${solicitacao.whatsapp}@whatsapp.zelare.com`, // Email mockado para gateway que exige
      tax_id: "00000000000", // Idealmente capturar CPF real da família
    }
  });

  if (!paymentRes.success) {
    return { success: false, error: paymentRes.error };
  }

  // 3. Salvar pagamento na tabela pagamentos
  const { data: pagamento, error: insertError } = await supabase
    .from('pagamentos')
    .insert([{
      solicitacao_id: solicitacao.id,
      valor_centavos: valorCentavos,
      status: 'PENDING',
      gateway: gateway.name,
      gateway_id: paymentRes.gatewayId,
      qr_code_url: paymentRes.qrCodeUrl,
      pix_emv: paymentRes.pixEmv,
    }])
    .select()
    .single();

  if (insertError) {
    return { success: false, error: "Erro ao registrar pagamento no banco." };
  }

  // 4. Atualizar solicitação para Aguardando Pagamento
  await supabase
    .from('familias_solicitacoes')
    .update({ 
      status: 'Aguardando Pagamento',
      valor_cobrado_centavos: valorCentavos,
      pagamento_status: 'PENDING'
    })
    .eq('id', solicitacao.id);

  return { success: true, pagamento };
}
