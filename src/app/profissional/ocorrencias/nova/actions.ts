"use server";

import { requireProfissional } from "@/lib/auth-profissional";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function registrarOcorrencia(formData: FormData) {
  const sessao = await requireProfissional();

  const plantao_id = formData.get("plantao_id") as string;
  const tipo_ocorrencia = formData.get("tipo_ocorrencia") as string;
  const descricao = formData.get("descricao") as string;
  const gravidade = formData.get("gravidade") as string;

  if (!plantao_id || !tipo_ocorrencia || !descricao || !gravidade) {
    return { error: "Preencha todos os campos obrigatórios." };
  }

  // Obter solicitacao_id a partir do plantao_id
  const { data: plantao } = await supabaseAdmin
    .from("plantoes")
    .select("solicitacao_id")
    .eq("id", plantao_id)
    .single();

  const { error } = await supabaseAdmin
    .from("ocorrencias")
    .insert({
      plantao_id,
      solicitacao_id: plantao?.solicitacao_id || null,
      profissional_id: sessao.id,
      tipo_ocorrencia,
      descricao,
      gravidade,
      status: "Aberta"
    });

  if (error) {
    return { error: "Erro ao registrar ocorrência. Tente novamente." };
  }

  revalidatePath("/profissional");
  revalidatePath("/admin/(protected)/ocorrencias"); // Atualizar CRM
  
  return { success: true };
}
