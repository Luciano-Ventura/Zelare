"use server";

import { requireProfissional } from "@/lib/auth-profissional";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function registrarAcaoPlantao(plantaoId: string, acao: string, checklistFinal?: any) {
  const sessao = await requireProfissional();

  // Verificar se o plantão é do profissional
  const { data: plantao } = await supabaseAdmin
    .from("plantoes")
    .select("id, status_profissional, status, solicitacao_id")
    .eq("id", plantaoId)
    .eq("profissional_id", sessao.id)
    .single();

  if (!plantao) {
    return { error: "Plantão não encontrado." };
  }

  const agora = new Date().toISOString();
  let updateData: any = {};

  if (acao === "Estou a caminho") {
    updateData.status_profissional = "A caminho";
    updateData.saiu_para_local_em = agora;
  } else if (acao === "Cheguei") {
    updateData.status_profissional = "No local";
    updateData.chegou_ao_local_em = agora;
  } else if (acao === "Iniciar") {
    updateData.status_profissional = "Em andamento";
    updateData.iniciado_em = agora;
    updateData.status = "Em andamento"; // Muda o status global do CRM também
  } else if (acao === "Finalizar") {
    updateData.status_profissional = "Finalizado";
    updateData.finalizado_em = agora;
    updateData.status = "Concluído"; // Muda o status global do CRM
    if (checklistFinal) {
      updateData.checklist_finalizacao = checklistFinal;
      if (checklistFinal.observacoes) {
        updateData.observacoes_profissional = checklistFinal.observacoes;
      }
    }
  } else {
    return { error: "Ação inválida." };
  }

  const { error } = await supabaseAdmin
    .from("plantoes")
    .update(updateData)
    .eq("id", plantaoId);

  if (error) {
    return { error: "Erro ao registrar ação." };
  }

  // Se finalizou, atualizar o repasse e a solicitação
  if (acao === "Finalizar") {
    await supabaseAdmin
      .from("familias_solicitacoes")
      .update({ status: "Concluído" })
      .eq("id", plantao.solicitacao_id || (await getSolicitacaoIdFromPlantao(plantaoId)));

    await supabaseAdmin
      .from("repasses_profissionais")
      .update({ status_repasse: "Pronto para repasse", updated_at: agora })
      .eq("plantao_id", plantaoId)
      .eq("status_repasse", "Aguardando conclusão");
  }

  revalidatePath(`/profissional/plantoes/${plantaoId}`);
  revalidatePath("/profissional/plantoes");
  revalidatePath("/admin/(protected)/plantoes");
  revalidatePath("/admin/(protected)/financeiro");
  
  return { success: true };
}

async function getSolicitacaoIdFromPlantao(plantaoId: string) {
  const { data } = await supabaseAdmin.from("plantoes").select("solicitacao_id").eq("id", plantaoId).single();
  return data?.solicitacao_id;
}

export async function cancelarPlantaoProfissional(plantaoId: string, motivo: string) {
  const sessao = await requireProfissional();

  try {
    const { data: plantao } = await supabaseAdmin
      .from("plantoes")
      .select("id, solicitacao_id, status_profissional")
      .eq("id", plantaoId)
      .eq("profissional_id", sessao.id)
      .single();

    if (!plantao) {
      throw new Error("Plantão não encontrado ou não pertence a você.");
    }

    if (plantao.status_profissional === "Em andamento" || plantao.status_profissional === "Finalizado") {
      throw new Error("Plantão já em andamento ou finalizado, não pode ser cancelado online.");
    }

    // Retira o profissional do plantão
    await supabaseAdmin
      .from("plantoes")
      .update({
        status: "Procurando profissional",
        status_financeiro: "Cancelado", // ou Pendente? Deixe como estava se ele pagou. O Admin decide.
        profissional_id: null,
        profissional_nome: "A definir",
        profissional_whatsapp: null,
        status_profissional: null
      })
      .eq("id", plantaoId);

    // Registra observação
    await supabaseAdmin
      .from("observacoes_internas")
      .insert({
        entidade_tipo: "solicitacao",
        entidade_id: plantao.solicitacao_id,
        texto: `Profissional ${sessao.nome_completo} cancelou o plantão. Motivo: ${motivo}`,
        autor: "Sistema (Ação do Profissional)"
      });

    revalidatePath(`/profissional/plantoes`);
    revalidatePath(`/admin/solicitacoes/${plantao.solicitacao_id}`);
    
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
