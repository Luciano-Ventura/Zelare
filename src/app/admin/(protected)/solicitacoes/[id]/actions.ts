"use server";

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { getPaymentGateway } from "@/lib/payments";
import { calcularPrecoPlantao } from "@/lib/financeiro";

export async function createPlantao(data: {
  solicitacao_id: string;
  profissional_id: string;
  data_plantao: string;
  horario_inicio: string;
  horario_fim: string;
  duracao: string;
  valor_profissional: number;
  taxa_zelare: number;
  total_familia: number;
  inicio_em?: string;
  fim_em?: string;
  pricing_id?: string;
  valor_base_regiao?: number;
  valor_minimo_profissional_usado?: number;
  margem_percentual?: number;
  adicionais_aplicados?: any;
  houve_ajuste_manual?: boolean;
  motivo_ajuste_manual?: string;
}) {
  await requireAdmin();

  try {
    // 1. Recalcular inicio_em e fim_em de forma segura no backend (Fuso de SP -03:00)
    let finalInicioEm = data.inicio_em || "";
    let finalFimEm = data.fim_em || "";
    
    if (data.data_plantao && data.horario_inicio && data.horario_fim) {
      // Formato esperado de data_plantao vindo do frontend atual: DD/MM/YYYY
      const dateParts = data.data_plantao.includes('/') ? data.data_plantao.split('/') : data.data_plantao.split('-');
      const [d, m, y] = data.data_plantao.includes('/') ? dateParts : dateParts.reverse();
      const dataIso = `${y}-${m}-${d}`;
      
      const startIso = `${dataIso}T${data.horario_inicio}:00-03:00`;
      const startDate = new Date(startIso);
      const endDate = new Date(`${dataIso}T${data.horario_fim}:00-03:00`);
      
      // Cruza meia-noite
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }
      
      finalInicioEm = startDate.toISOString();
      finalFimEm = endDate.toISOString();
    }

    // 2. Fetch Solicitacao data
    const { data: solic, error: solicError } = await supabaseAdmin
      .from("familias_solicitacoes")
      .select("*")
      .eq("id", data.solicitacao_id)
      .single();

    if (solicError || !solic) {
      throw new Error("Solicitação não encontrada");
    }

    // 3. Fetch Profissional data
    const { data: prof, error: profError } = await supabaseAdmin
      .from("profissionais_cadastros")
      .select("*")
      .eq("id", data.profissional_id)
      .single();

    if (profError || !prof) {
      throw new Error("Profissional não encontrado");
    }

    // 4. Verificação de Conflito de Agenda (Duplo Agendamento)
    if (finalInicioEm && finalFimEm) {
      const { data: conflitos, error: conflitosError } = await supabaseAdmin
        .from("plantoes")
        .select("id")
        .eq("profissional_id", data.profissional_id)
        .in("status", ["Confirmado", "Em andamento", "Reagendado"])
        .lt("inicio_em", finalFimEm)
        .gt("fim_em", finalInicioEm);

      if (conflitosError) {
        throw new Error("Erro ao verificar agenda do profissional: " + conflitosError.message);
      }
      if (conflitos && conflitos.length > 0) {
        return { error: "Este profissional já possui um plantão confirmado ou em andamento neste horário. Escolha outro profissional ou ajuste o horário." };
      }
    }

    // 4.5 Cálculo aceito pelo admin (trusted backend route)
    const valFinalProfissional = parseFloat(data.valor_profissional.toString()) || 0;
    const calcTaxa = parseFloat(data.taxa_zelare.toString()) || 0;
    const calcTotal = parseFloat(data.total_familia.toString()) || 0;

    // 5. Insert Plantão
    const { data: novoPlantao, error: insertError } = await supabaseAdmin
      .from("plantoes")
      .insert({
        solicitacao_id: data.solicitacao_id,
        profissional_id: data.profissional_id,
        familia_nome: solic.nome_completo,
        familia_whatsapp: solic.whatsapp,
        profissional_nome: prof.nome_completo,
        profissional_whatsapp: prof.whatsapp,
        data_plantao: data.data_plantao,
        horario_inicio: data.horario_inicio,
        duracao: data.duracao,
        cidade: solic.cidade,
        bairro: solic.bairro,
        tipo_cuidado: solic.tipo_profissional || "Cuidador",
        valor_profissional: valFinalProfissional,
        taxa_zelare: calcTaxa,
        total_familia: calcTotal,
        inicio_em: finalInicioEm,
        fim_em: finalFimEm,
        status: "Aguardando pagamento",
        status_financeiro: "Aguardando pagamento",
        pricing_id: data.pricing_id || null,
        valor_base_regiao: data.valor_base_regiao || null,
        valor_minimo_profissional_usado: data.valor_minimo_profissional_usado || null,
        margem_percentual: data.margem_percentual || null,
        adicionais_aplicados: data.adicionais_aplicados || {},
        houve_ajuste_manual: data.houve_ajuste_manual || false,
        motivo_ajuste_manual: data.motivo_ajuste_manual || null,
      })
      .select("id")
      .single();

    if (insertError || !novoPlantao) {
      throw new Error("Erro ao criar o plantão: " + (insertError?.message || ""));
    }

    const plantaoId = novoPlantao.id;

    // 6. Insert Pagamento
    const { error: pgError } = await supabaseAdmin
      .from("pagamentos")
      .insert({
        plantao_id: plantaoId,
        solicitacao_id: data.solicitacao_id,
        familia_nome: solic.nome_completo,
        familia_whatsapp: solic.whatsapp,
        valor_profissional: valFinalProfissional,
        taxa_zelare: calcTaxa,
        total_familia: calcTotal,
        status_pagamento: "Aguardando pagamento"
      });

    if (pgError) {
      // Rollback manual (Best effort sem RPC)
      await supabaseAdmin.from("plantoes").delete().eq("id", plantaoId);
      throw new Error("Erro ao gerar pagamento: " + pgError.message);
    }

    // 7. Insert Repasse
    const { error: repasseError } = await supabaseAdmin
      .from("repasses_profissionais")
      .insert({
        plantao_id: plantaoId,
        profissional_id: data.profissional_id,
        profissional_nome: prof.nome_completo,
        profissional_pix: prof.pix_chave ? `${prof.pix_tipo || 'Chave'}: ${prof.pix_chave}` : null,
        valor_profissional: valFinalProfissional,
        status_repasse: "Aguardando conclusão"
      });

    if (repasseError) {
       // Rollback manual
       await supabaseAdmin.from("pagamentos").delete().eq("plantao_id", plantaoId);
       await supabaseAdmin.from("plantoes").delete().eq("id", plantaoId);
       throw new Error("Erro ao gerar repasse: " + repasseError.message);
    }

    // 8. Update Solicitacao Status
    await supabaseAdmin
      .from("familias_solicitacoes")
      .update({ status: "Aguardando pagamento" })
      .eq("id", data.solicitacao_id);

    revalidatePath(`/admin/solicitacoes/${data.solicitacao_id}`);
    revalidatePath(`/admin/plantoes`);
    revalidatePath(`/admin`);

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro desconhecido" };
  }
}

// ==========================================
// PACOTES: PREVIEW EM LOTE
// ==========================================
export async function previewPlantoesEmLote(data: {
  profissional_id: string;
  data_inicial: string;
  data_final: string;
  dias_semana: number[]; // 0=Dom, 1=Seg...
  horario_inicio: string;
  horario_fim: string;
  valor_profissional: number;
  taxa_zelare: number;
  total_familia: number;
}) {
  await requireAdmin();
  
  try {
    const start = new Date(data.data_inicial + "T00:00:00-03:00");
    const end = new Date(data.data_final + "T00:00:00-03:00");
    
    if (start > end) throw new Error("A data inicial não pode ser maior que a final.");
    
    // Gerar datas
    const dates: Date[] = [];
    const curr = new Date(start);
    while (curr <= end) {
      if (data.dias_semana.includes(curr.getDay())) {
        dates.push(new Date(curr));
      }
      curr.setDate(curr.getDate() + 1);
    }
    
    if (dates.length > 60) {
      return { error: "Este pacote possui mais de 60 datas. Reduza o período ou divida em mais de um pacote para evitar lentidão ou erros." };
    }
    if (dates.length === 0) {
      return { error: "Nenhuma data encontrada para os dias da semana selecionados no período." };
    }

    // Preparar arrays de horários
    const agendamentos = dates.map(d => {
      const dIso = d.toISOString().split("T")[0];
      const startIso = `${dIso}T${data.horario_inicio}:00-03:00`;
      const startDate = new Date(startIso);
      const endDate = new Date(`${dIso}T${data.horario_fim}:00-03:00`);
      
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }
      
      return {
        data_plantao_str: `${dIso.split("-")[2]}/${dIso.split("-")[1]}/${dIso.split("-")[0]}`,
        data_iso: dIso,
        inicio_em: startDate.toISOString(),
        fim_em: endDate.toISOString()
      };
    });

    const inicioGeral = agendamentos[0].inicio_em;
    const fimGeral = agendamentos[agendamentos.length - 1].fim_em;

    // Buscar conflitos do profissional no período
    const { data: ocupacoes, error: errOcup } = await supabaseAdmin
      .from("plantoes")
      .select("inicio_em, fim_em")
      .eq("profissional_id", data.profissional_id)
      .in("status", ["Confirmado", "Em andamento", "Reagendado"])
      .gte("fim_em", inicioGeral)
      .lte("inicio_em", fimGeral);

    if (errOcup) throw new Error("Erro ao consultar agenda do profissional.");

    const disponiveis: any[] = [];
    const conflitos: any[] = [];

    for (const ag of agendamentos) {
      const agStart = new Date(ag.inicio_em);
      const agEnd = new Date(ag.fim_em);
      
      let hasConflict = false;
      if (ocupacoes) {
        for (const oc of ocupacoes) {
          const ocStart = new Date(oc.inicio_em);
          const ocEnd = new Date(oc.fim_em);
          if (ocStart < agEnd && ocEnd > agStart) {
            hasConflict = true;
            break;
          }
        }
      }
      
      if (hasConflict) {
        conflitos.push(ag);
      } else {
        disponiveis.push(ag);
      }
    }

    const qtd = disponiveis.length;
    
    return {
      success: true,
      total_datas_previstas: dates.length,
      disponiveis,
      conflitos,
      valor_profissional_total: data.valor_profissional * qtd,
      taxa_zelare_total: data.taxa_zelare * qtd,
      total_familia: data.total_familia * qtd
    };
    
  } catch (err: any) {
    return { error: err.message };
  }
}

// ==========================================
// PACOTES: CREATE EM LOTE
// ==========================================
export async function createPlantoesEmLote(data: {
  solicitacao_id: string;
  profissional_id: string;
  data_inicial: string;
  data_final: string;
  dias_semana: number[];
  horario_inicio: string;
  horario_fim: string;
  duracao_str: string;
  valor_profissional: number;
  taxa_zelare: number;
  total_familia: number;
  datas_aprovadas: any[]; // vem do preview
}) {
  await requireAdmin();
  
  if (!data.datas_aprovadas || data.datas_aprovadas.length === 0) {
    return { error: "Não foi possível criar o pacote porque todas as datas possuem conflito de agenda para este profissional ou nenhuma foi enviada." };
  }

  try {
    // 1. Fetch Solicitacao
    const { data: solic, error: solicError } = await supabaseAdmin
      .from("familias_solicitacoes")
      .select("*")
      .eq("id", data.solicitacao_id)
      .single();
    if (solicError || !solic) throw new Error("Solicitação não encontrada");

    // 2. Fetch Profissional
    const { data: prof, error: profError } = await supabaseAdmin
      .from("profissionais_cadastros")
      .select("*")
      .eq("id", data.profissional_id)
      .single();
    if (profError || !prof) throw new Error("Profissional não encontrado");

    const valFinalProfissional = parseFloat(data.valor_profissional.toString()) || 0;
    const calcTaxa = parseFloat(data.taxa_zelare.toString()) || 0;
    const calcTotal = parseFloat(data.total_familia.toString()) || 0;
    const qtdCriada = data.datas_aprovadas.length;

    // 3. Criar Pacote
    const { data: pacote, error: errPacote } = await supabaseAdmin
      .from("pacotes_plantoes")
      .insert({
        solicitacao_id: data.solicitacao_id,
        familia_nome: solic.nome_completo,
        familia_whatsapp: solic.whatsapp,
        profissional_id: data.profissional_id,
        profissional_nome: prof.nome_completo,
        data_inicio: data.data_inicial,
        data_fim: data.data_final,
        dias_semana: data.dias_semana.map(String),
        horario_inicio: data.horario_inicio,
        horario_fim: data.horario_fim,
        quantidade_prevista: data.datas_aprovadas.length, // O preview já filtrou, então consideramos a prevista igual as aprovadas para simplificar ou passamos isso separado
        quantidade_criada: qtdCriada,
        quantidade_conflito: 0, 
        valor_por_plantao: calcTotal,
        valor_profissional_total: valFinalProfissional * qtdCriada,
        taxa_zelare_total: calcTaxa * qtdCriada,
        total_familia: calcTotal * qtdCriada,
        status: "Aguardando pagamento"
      })
      .select("id")
      .single();

    if (errPacote || !pacote) throw new Error("Erro ao criar o pacote: " + errPacote?.message);

    // 4. Inserir Plantões, Pagamento Único, Repasses
    const insertPlantoes = [];
    const insertRepasses = [];
    
    for (let i = 0; i < data.datas_aprovadas.length; i++) {
      const d = data.datas_aprovadas[i];
      insertPlantoes.push({
        pacote_id: pacote.id,
        numero_no_pacote: i + 1,
        recorrente: true,
        solicitacao_id: data.solicitacao_id,
        profissional_id: data.profissional_id,
        familia_nome: solic.nome_completo,
        familia_whatsapp: solic.whatsapp,
        profissional_nome: prof.nome_completo,
        profissional_whatsapp: prof.whatsapp,
        data_plantao: d.data_plantao_str,
        horario_inicio: data.horario_inicio,
        duracao: data.duracao_str,
        cidade: solic.cidade,
        bairro: solic.bairro,
        tipo_cuidado: solic.tipo_profissional || "Cuidador",
        valor_profissional: valFinalProfissional,
        taxa_zelare: calcTaxa,
        total_familia: calcTotal,
        inicio_em: d.inicio_em,
        fim_em: d.fim_em,
        status: "Aguardando pagamento",
        status_financeiro: "Aguardando pagamento"
      });
    }

    const { data: plantoesCriados, error: errPlantoes } = await supabaseAdmin
      .from("plantoes")
      .insert(insertPlantoes)
      .select("id");

    if (errPlantoes) throw new Error("Erro ao inserir plantões: " + errPlantoes.message);

    // Repasses por plantão
    for (const p of plantoesCriados) {
      insertRepasses.push({
        plantao_id: p.id,
        profissional_id: data.profissional_id,
        profissional_nome: prof.nome_completo,
        profissional_pix: prof.pix_chave ? `${prof.pix_tipo || 'Chave'}: ${prof.pix_chave}` : null,
        valor_profissional: valFinalProfissional,
        status_repasse: "Aguardando conclusão"
      });
    }

    const { error: errRepasses } = await supabaseAdmin
      .from("repasses_profissionais")
      .insert(insertRepasses);

    if (errRepasses) throw new Error("Erro ao criar repasses.");

    // Pagamento único consolidado do Pacote
    const { error: errPg } = await supabaseAdmin
      .from("pagamentos")
      .insert({
        pacote_id: pacote.id,
        solicitacao_id: data.solicitacao_id,
        familia_nome: solic.nome_completo,
        familia_whatsapp: solic.whatsapp,
        valor_profissional: valFinalProfissional * qtdCriada,
        taxa_zelare: calcTaxa * qtdCriada,
        total_familia: calcTotal * qtdCriada,
        status_pagamento: "Aguardando pagamento"
      });

    if (errPg) throw new Error("Erro ao gerar pagamento do pacote.");

    // Atualizar Solicitação
    await supabaseAdmin
      .from("familias_solicitacoes")
      .update({ status: "Aguardando pagamento" })
      .eq("id", data.solicitacao_id);

    revalidatePath(`/admin/solicitacoes/${data.solicitacao_id}`);
    revalidatePath(`/admin/plantoes`);
    revalidatePath(`/admin`);

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro desconhecido ao criar em lote." };
  }
}


export async function enviarConvite(solicitacaoId: string, profissionalId: string, valorOferecido?: number) {
  await requireAdmin();

  try {
    let finalValor = valorOferecido;

    if (!finalValor) {
      const { data: solic } = await supabaseAdmin.from("familias_solicitacoes").select("*").eq("id", solicitacaoId).single();
      const { data: prof } = await supabaseAdmin.from("profissionais_cadastros").select("*").eq("id", profissionalId).single();

      if (solic && prof && solic.duracao_plantao) {
        const duracaoHoras = parseInt(solic.duracao_plantao.replace(/\D/g, "")) || 12;
        
        const resRegra = await fetchPricingConfig({ 
          estado: solic.endereco_estado || solic.cidade?.split(" - ")[1], 
          cidade: solic.endereco_cidade || solic.cidade?.split(" - ")[0], 
          duracao_horas: duracaoHoras 
        });

        if (resRegra?.success && resRegra.data) {
          const regiaoConfig = resRegra.data;
          let minVal = null;
          if (duracaoHoras === 24 && prof.valor_minimo_24h) minVal = prof.valor_minimo_24h;
          else if (duracaoHoras === 12 && prof.valor_minimo_12h) minVal = prof.valor_minimo_12h;
          else if (duracaoHoras === 8 && prof.valor_minimo_8h) minVal = prof.valor_minimo_8h;
          else if (duracaoHoras === 6 && prof.valor_minimo_6h) minVal = prof.valor_minimo_6h;
          else if (duracaoHoras === 4 && prof.valor_minimo_4h) minVal = prof.valor_minimo_4h;

          const calcResult = calcularPrecoPlantao({ regiao: regiaoConfig, profissional: { valor_minimo_usado: minVal || null } });
          if (calcResult.valor_profissional > 0) {
            finalValor = calcResult.valor_profissional;
          }
        }
      }
    }

    const { error } = await supabaseAdmin
      .from("oportunidades_profissionais")
      .insert({
        solicitacao_id: solicitacaoId,
        profissional_id: profissionalId,
        valor_oferecido: finalValor || null,
        status: "Enviada"
      });

    if (error) throw error;

    revalidatePath(`/admin/solicitacoes/${solicitacaoId}`);
    return { success: true };
  } catch (err: any) {
    return { error: "Erro ao enviar convite." };
  }
}

export async function fetchPricingConfig(params: {
  estado?: string;
  cidade?: string;
  bairro?: string;
  tipo_servico?: string;
  duracao_horas?: number;
  turno?: string;
}) {
  await requireAdmin();

  // Ordem de busca sugerida:
  // 1. Estado + cidade + bairro + tipo_servico + duração + turno
  // 2. Estado + cidade + tipo_servico + duração + turno
  // 3. Estado + cidade + tipo_servico + duração
  // 4. Estado + cidade + duração
  // 5. Estado + tipo_servico + duração
  // 6. Regra padrão nacional (BR, PADRAO)

  const { estado, cidade, duracao_horas } = params;
  
  if (!estado) return null;

  try {
    // Busca todas as regras ativas
    const { data: regras, error } = await supabaseAdmin
      .from("pricing_regioes")
      .select("*")
      .eq("ativo", true);
      
    if (error || !regras) throw error;

    let match = null;

    // 4. Estado + cidade + duração
    match = regras.find(r => 
      r.estado === estado && 
      r.cidade === cidade && 
      r.duracao_horas === duracao_horas
    );

    if (match) return { success: true, data: match };

    // 4.1. Estado + cidade genérica (sem duração)
    match = regras.find(r => 
      r.estado === estado && 
      r.cidade === cidade && 
      r.duracao_horas === null
    );

    if (match) return { success: true, data: match };

    // 6. Fallback Nacional
    match = regras.find(r => r.estado === 'BR' && r.cidade === 'PADRAO');

    if (match) return { success: true, data: match };

    return { success: false, error: "Nenhuma regra de preço encontrada." };
  } catch(err) {
    return { success: false, error: "Erro ao buscar regras de preço." };
  }
}

export async function deleteSolicitacao(solicitacaoId: string) {
  await requireAdmin();

  try {
    // Apagar dependentes: plantões (isso em tese deveria apagar os filhos de plantão se cascade estivesse ativo. Vamos apagar manualmente por segurança)
    const { data: plantoes } = await supabaseAdmin.from("plantoes").select("id").eq("solicitacao_id", solicitacaoId);
    if (plantoes && plantoes.length > 0) {
       for (const p of plantoes) {
         await supabaseAdmin.from("pagamentos").delete().eq("plantao_id", p.id);
         await supabaseAdmin.from("repasses_profissionais").delete().eq("plantao_id", p.id);
         await supabaseAdmin.from("avaliacoes").delete().eq("plantao_id", p.id);
       }
    }
    
    // Apagar plantões
    await supabaseAdmin.from("plantoes").delete().eq("solicitacao_id", solicitacaoId);
    // Apagar pagamentos atrelados (seguro)
    await supabaseAdmin.from("pagamentos").delete().eq("solicitacao_id", solicitacaoId);
    // Apagar observacoes e oportunidades
    await supabaseAdmin.from("observacoes_internas").delete().eq("entidade_tipo", "solicitacao").eq("entidade_id", solicitacaoId);
    await supabaseAdmin.from("oportunidades_profissionais").delete().eq("solicitacao_id", solicitacaoId);

    // Finalmente, apagar a solicitacao
    const { error } = await supabaseAdmin.from("familias_solicitacoes").delete().eq("id", solicitacaoId);
    if (error) throw error;

    revalidatePath("/admin/solicitacoes");
    return { success: true };
  } catch (err: any) {
    return { error: "Erro ao apagar solicitação: " + err.message };
  }
}

export async function deletePlantao(plantaoId: string, solicitacaoId: string) {
  await requireAdmin();

  try {
    // Apagar dependentes
    await supabaseAdmin.from("pagamentos").delete().eq("plantao_id", plantaoId);
    await supabaseAdmin.from("repasses_profissionais").delete().eq("plantao_id", plantaoId);
    await supabaseAdmin.from("avaliacoes").delete().eq("plantao_id", plantaoId);

    // Apagar plantão
    const { error } = await supabaseAdmin.from("plantoes").delete().eq("id", plantaoId);
    if (error) throw error;

    revalidatePath(`/admin/solicitacoes/${solicitacaoId}`);
    revalidatePath(`/admin/financeiro`);
    return { success: true };
  } catch (err: any) {
    return { error: "Erro ao apagar plantão: " + err.message };
  }
}

export async function updateSolicitacao(id: string, formData: any) {
  await requireAdmin();

  try {
    const { error } = await supabaseAdmin
      .from("familias_solicitacoes")
      .update(formData)
      .eq("id", id);

    if (error) throw error;

    revalidatePath(`/admin/solicitacoes/${id}`);
    revalidatePath(`/admin/solicitacoes`);
    return { success: true };
  } catch (err: any) {
    return { error: "Erro ao atualizar solicitação: " + err.message };
  }
}

// ==========================================
// EFETIVAR PLANTÃO E GERAR PIX (CAMINHO FELIZ)
// ==========================================
export async function efetivarPlantaoEPix(solicitacaoId: string, profissionalId: string) {
  await requireAdmin();

  try {
    // 1. Validar se a solicitação existe e não está já com plantão
    const { data: solic, error: solicError } = await supabaseAdmin
      .from("familias_solicitacoes")
      .select("*")
      .eq("id", solicitacaoId)
      .single();

    if (solicError || !solic) {
      throw new Error("Solicitação não encontrada.");
    }
    if (solic.status === "Aguardando pagamento" || solic.status === "Pagamento confirmado" || solic.status === "Confirmado") {
      throw new Error("Esta solicitação já possui um plantão ou cobrança gerada.");
    }

    // Verifica se já existe plantão ativo para não duplicar
    const { data: plantaoExistente } = await supabaseAdmin
      .from("plantoes")
      .select("id")
      .eq("solicitacao_id", solicitacaoId)
      .limit(1);

    if (plantaoExistente && plantaoExistente.length > 0) {
      throw new Error("Esta solicitação já possui um plantão ativo.");
    }

    // 2. Validar profissional
    const { data: prof, error: profError } = await supabaseAdmin
      .from("profissionais_cadastros")
      .select("*")
      .eq("id", profissionalId)
      .single();

    if (profError || !prof) {
      throw new Error("Profissional não encontrado.");
    }
    if (prof.status !== "Validado") {
      throw new Error("Profissional não está com status Validado.");
    }

    // 3. Validar convite (oportunidade)
    const { data: convite, error: conviteError } = await supabaseAdmin
      .from("oportunidades_profissionais")
      .select("status")
      .eq("solicitacao_id", solicitacaoId)
      .eq("profissional_id", profissionalId)
      .single();

    if (conviteError || !convite || convite.status !== "Aceita") {
      throw new Error("O profissional não aceitou o convite (ou o status não é 'Aceita').");
    }

    // 4. Calcular horários
    if (!solic.data_desejada || !solic.horario_desejado || !solic.duracao_plantao) {
      throw new Error("A solicitação não possui data_desejada, horario_desejado ou duracao_plantao configurados corretamente.");
    }
    
    // Calcula fim e ISOs
    const baseDate = solic.data_desejada.split("T")[0]; // assumindo formato date ou YYYY-MM-DD
    const horarioInicio = solic.horario_desejado;
    
    // A duração pode vir como "12h" etc
    const duracaoHoras = parseInt(solic.duracao_plantao.replace(/\D/g, "")) || 12;
    
    const startIso = `${baseDate}T${horarioInicio}:00-03:00`;
    const startDate = new Date(startIso);
    if (isNaN(startDate.getTime())) {
       throw new Error("Formato de data e horário inválido na solicitação.");
    }

    const endDate = new Date(startDate.getTime() + duracaoHoras * 60 * 60 * 1000);
    const finalInicioEm = startDate.toISOString();
    const finalFimEm = endDate.toISOString();
    
    // formata horário fim em HH:mm
    const horarioFim = endDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
    const dataPlantaoStr = startDate.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

    // 5. Validar agenda do profissional
    const { data: conflitos, error: conflitosError } = await supabaseAdmin
      .from("plantoes")
      .select("id")
      .eq("profissional_id", profissionalId)
      .in("status", ["Confirmado", "Em andamento", "Reagendado"])
      .lt("inicio_em", finalFimEm)
      .gt("fim_em", finalInicioEm);

    if (conflitosError) throw new Error("Erro ao verificar agenda.");
    if (conflitos && conflitos.length > 0) {
      throw new Error("O profissional já possui conflito de agenda nesse horário.");
    }

    // 6. Calcular Pricing (simula o frontend StartPlantaoModal)
    // Busca a regra da região
    const resRegra = await fetchPricingConfig({ 
      estado: solic.endereco_estado || solic.cidade?.split(" - ")[1], 
      cidade: solic.endereco_cidade || solic.cidade?.split(" - ")[0], 
      duracao_horas: duracaoHoras 
    });

    if (!resRegra?.success || !resRegra.data) {
      throw new Error("Não foi encontrada nenhuma regra de preço para essa região e duração.");
    }

    const regiaoConfig = resRegra.data;
    
    // Valor minimo do prof
    let minVal = null;
    if (duracaoHoras === 24 && prof.valor_minimo_24h) minVal = prof.valor_minimo_24h;
    else if (duracaoHoras === 12 && prof.valor_minimo_12h) minVal = prof.valor_minimo_12h;
    else if (duracaoHoras === 8 && prof.valor_minimo_8h) minVal = prof.valor_minimo_8h;
    else if (duracaoHoras === 6 && prof.valor_minimo_6h) minVal = prof.valor_minimo_6h;
    else if (duracaoHoras === 4 && prof.valor_minimo_4h) minVal = prof.valor_minimo_4h;

    const calcResult = calcularPrecoPlantao({ regiao: regiaoConfig, profissional: { valor_minimo_usado: minVal || null } });
    
    if (calcResult.total_familia <= 0 || calcResult.valor_profissional <= 0) {
      throw new Error("Erro no cálculo financeiro: os valores não podem ser zero ou negativos.");
    }

    // 7. Salva Plantão (Status Pendente de Gateway inicialmente)
    const { data: novoPlantao, error: insertError } = await supabaseAdmin
      .from("plantoes")
      .insert({
        solicitacao_id: solicitacaoId,
        profissional_id: profissionalId,
        familia_nome: solic.nome_completo,
        familia_whatsapp: solic.whatsapp,
        profissional_nome: prof.nome_completo,
        profissional_whatsapp: prof.whatsapp,
        data_plantao: dataPlantaoStr,
        horario_inicio: horarioInicio,
        duracao: solic.duracao_plantao,
        cidade: solic.cidade || solic.endereco_cidade,
        bairro: solic.bairro || solic.endereco_bairro,
        tipo_cuidado: solic.tipo_profissional || "Cuidador",
        valor_profissional: calcResult.valor_profissional,
        taxa_zelare: calcResult.taxa_zelare,
        total_familia: calcResult.total_familia,
        inicio_em: finalInicioEm,
        fim_em: finalFimEm,
        status: "Criando pagamento...",
        status_financeiro: "Aguardando pagamento",
        pricing_id: regiaoConfig.id || null,
        valor_base_regiao: regiaoConfig.valor_base || null,
        valor_minimo_profissional_usado: minVal || null,
        margem_percentual: regiaoConfig.margem_percentual || null,
        adicionais_aplicados: {},
        houve_ajuste_manual: false
      })
      .select("id")
      .single();

    if (insertError || !novoPlantao) {
      throw new Error("Erro ao criar o plantão: " + (insertError?.message || ""));
    }

    const plantaoId = novoPlantao.id;

    // 8. Salva Repasse (Aguardando)
    await supabaseAdmin
      .from("repasses_profissionais")
      .insert({
        plantao_id: plantaoId,
        profissional_id: profissionalId,
        profissional_nome: prof.nome_completo,
        profissional_pix: prof.pix_chave ? `${prof.pix_tipo || 'Chave'}: ${prof.pix_chave}` : null,
        valor_profissional: calcResult.valor_profissional,
        status_repasse: "Aguardando conclusão"
      });

    // 9. Chama a Gateway (AbacatePay)
    const gateway = getPaymentGateway();
    const paymentRes = await gateway.createPixPayment({
      amountCentavos: Math.round(calcResult.total_familia * 100),
      description: `Plantão Zelare - Solicitante: ${solic.nome_completo}`,
      externalId: solicitacaoId,
      customer: {
        name: solic.nome_completo,
        email: `${solic.whatsapp.replace(/\D/g, '')}@zelare.com`,
        tax_id: "11144477735", // Valid CPF for testing since we don't collect family CPF yet
      }
    });

    if (!paymentRes.success) {
      // Reverter (ou marcar como falhou)
      await supabaseAdmin.from("plantoes").update({ status: "Falhou", erro_gateway: paymentRes.error }).eq("id", plantaoId);
      throw new Error("Erro no gateway (AbacatePay): " + paymentRes.error);
    }

    // 10. Salva Pagamento com dados do Pix
    const { error: pgError } = await supabaseAdmin
      .from("pagamentos")
      .insert({
        plantao_id: plantaoId,
        solicitacao_id: solicitacaoId,
        familia_nome: solic.nome_completo,
        familia_whatsapp: solic.whatsapp,
        valor_profissional: calcResult.valor_profissional,
        taxa_zelare: calcResult.taxa_zelare,
        total_familia: calcResult.total_familia,
        status_pagamento: "Pix gerado",
        gateway: gateway.name,
        gateway_id: paymentRes.gatewayId,
        qr_code_url: paymentRes.qrCodeUrl,
        pix_emv: paymentRes.pixEmv,
      });

    if (pgError) {
      // Reverter ou tentar logar erro
      throw new Error("Erro ao registrar pagamento no banco de dados.");
    }

    // 11. Sucesso total: atualizar plantão e solicitação para Aguardando Pagamento
    await supabaseAdmin
      .from("plantoes")
      .update({ status: "Aguardando pagamento" })
      .eq("id", plantaoId);

    await supabaseAdmin
      .from("familias_solicitacoes")
      .update({ status: "Aguardando pagamento" })
      .eq("id", solicitacaoId);

    revalidatePath(`/admin/solicitacoes/${solicitacaoId}`);
    revalidatePath(`/admin/plantoes`);
    revalidatePath(`/admin/financeiro`);

    return { 
      success: true, 
      resumo: {
        familia: solic.nome_completo,
        valor_total: calcResult.total_familia,
        repasse: calcResult.valor_profissional
      } 
    };
  } catch (err: any) {
    return { error: err.message || "Erro desconhecido ao efetivar." };
  }
}

