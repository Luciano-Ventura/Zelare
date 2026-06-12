"use server";

import { requireProfissional } from "@/lib/auth-profissional";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function registrarAcaoPlantao(plantaoId: string, acao: string, checklistFinal?: any) {
  const sessao = await requireProfissional();

  // Verificar se o plantão é do profissional
  const { data: plantao } = await supabaseAdmin
    .from("plantoes")
    .select("id, status_profissional, status")
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

  revalidatePath(`/profissional/plantoes/${plantaoId}`);
  revalidatePath("/profissional/plantoes");
  revalidatePath("/admin/(protected)/plantoes");
  
  return { success: true };
}
