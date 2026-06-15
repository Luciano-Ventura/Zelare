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

    // 5. Insert Plantão
    const { error: insertError } = await supabaseAdmin
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
        valor_profissional: data.valor_profissional,
        taxa_zelare: data.taxa_zelare,
        total_familia: data.total_familia,
        inicio_em: finalInicioEm,
        fim_em: finalFimEm,
        status: "Confirmado",
      });

    if (insertError) {
      throw new Error("Erro ao criar o plantão: " + insertError.message);
    }

    // 4. Update Solicitacao Status
    await supabaseAdmin
      .from("familias_solicitacoes")
      .update({ status: "Confirmado" })
      .eq("id", data.solicitacao_id);

    revalidatePath(`/admin/solicitacoes/${data.solicitacao_id}`);
    revalidatePath(`/admin/plantoes`);
    revalidatePath(`/admin`);

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro desconhecido" };
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
