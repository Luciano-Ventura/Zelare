"use server";

import { requireProfissional } from "@/lib/auth-profissional";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function responderOportunidade(
  oportunidadeId: string, 
  action: "Aceita" | "Recusada" | "Contraproposta", 
  payload?: { motivo?: string; valor?: number; obs?: string }
) {
  const sessao = await requireProfissional();

  // Verificar se oportunidade pertence ao profissional
  const { data: op } = await supabaseAdmin
    .from("oportunidades_profissionais")
    .select("id")
    .eq("id", oportunidadeId)
    .eq("profissional_id", sessao.id)
    .single();

  if (!op) {
    return { error: "Oportunidade não encontrada." };
  }

  const updateData: any = {
    status: action,
    resposta_em: new Date().toISOString()
  };

  if (action === "Recusada" && payload?.motivo) {
    updateData.motivo_recusa = payload.motivo;
  }

  if (action === "Contraproposta" && payload?.valor) {
    updateData.valor_contraproposta = payload.valor;
    if (payload?.obs) {
      updateData.observacao_contraproposta = payload.obs;
    }
  }

  const { error } = await supabaseAdmin
    .from("oportunidades_profissionais")
    .update(updateData)
    .eq("id", oportunidadeId);

  if (error) {
    return { error: "Erro ao registrar resposta." };
  }

  revalidatePath("/profissional/oportunidades");
  revalidatePath("/profissional");
  
  return { success: true };
}
