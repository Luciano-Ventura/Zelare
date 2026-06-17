"use server";

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

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
      let endDate = new Date(`${dataIso}T${data.horario_fim}:00-03:00`);
      
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
    let dates: Date[] = [];
    let curr = new Date(start);
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
      let endDate = new Date(`${dIso}T${data.horario_fim}:00-03:00`);
      
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

    let disponiveis: any[] = [];
    let conflitos: any[] = [];

    for (let ag of agendamentos) {
      const agStart = new Date(ag.inicio_em);
      const agEnd = new Date(ag.fim_em);
      
      let hasConflict = false;
      if (ocupacoes) {
        for (let oc of ocupacoes) {
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
    let insertPlantoes = [];
    let insertRepasses = [];
    
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
    const { error } = await supabaseAdmin
      .from("oportunidades_profissionais")
      .insert({
        solicitacao_id: solicitacaoId,
        profissional_id: profissionalId,
        valor_oferecido: valorOferecido || null,
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
