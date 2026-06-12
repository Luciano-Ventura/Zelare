"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function salvarAvaliacao(formData: FormData) {
  const plantao_id = formData.get("plantao_id") as string;
  const solicitacao_id = formData.get("solicitacao_id") as string;
  const profissional_id = formData.get("profissional_id") as string;
  const nota = Number(formData.get("nota"));
  const comentario = formData.get("comentario") as string;

  if (!plantao_id || !nota) {
    return { error: "Nota é obrigatória." };
  }

  // Verifica se já avaliou
  const { data: existente } = await supabaseAdmin
    .from("avaliacoes")
    .select("id")
    .eq("plantao_id", plantao_id)
    .eq("quem_avaliou", "familia")
    .single();

  if (existente) {
    return { error: "Você já avaliou este plantão. Obrigado!" };
  }

  const { error } = await supabaseAdmin
    .from("avaliacoes")
    .insert({
      plantao_id,
      solicitacao_id,
      profissional_id,
      nota,
      comentario,
      quem_avaliou: "familia"
    });

  if (error) {
    return { error: "Erro ao salvar avaliação." };
  }

  revalidatePath("/admin/(protected)/avaliacoes");
  return { success: true };
}
