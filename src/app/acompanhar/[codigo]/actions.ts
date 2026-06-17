"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function cancelarSolicitacaoFamilia(codigo: string, solicitacaoId: string) {
  try {
    // Apenas cancela se a solicitação ainda não começou de fato ou não está paga
    const { data: sol } = await supabaseAdmin
      .from("familias_solicitacoes")
      .select("status")
      .eq("id", solicitacaoId)
      .single();

    if (!sol) {
      throw new Error("Solicitação não encontrada");
    }

    if (sol.status === "Aguardando pagamento" || sol.status === "Pago" || sol.status === "Confirmado" || sol.status === "Em andamento" || sol.status === "Concluído" || sol.status === "Cancelado") {
      throw new Error("Não é possível cancelar online neste estágio. Por favor, entre em contato via WhatsApp.");
    }

    const { error } = await supabaseAdmin
      .from("familias_solicitacoes")
      .update({ status: "Cancelado" })
      .eq("id", solicitacaoId);

    if (error) throw error;

    // Registrar no CRM para o admin saber
    await supabaseAdmin
      .from("observacoes_internas")
      .insert({
        entidade_tipo: "solicitacao",
        entidade_id: solicitacaoId,
        texto: "Família cancelou a solicitação online pelo painel de acompanhamento.",
        autor: "Sistema (Ação do Cliente)"
      });

    revalidatePath(`/acompanhar/${codigo}`);
    revalidatePath(`/admin/solicitacoes/${solicitacaoId}`);
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function salvarAvaliacao(formData: FormData) {
  try {
    const plantaoId = formData.get("plantao_id") as string;
    const solicitacaoId = formData.get("solicitacao_id") as string;
    const profissionalId = formData.get("profissional_id") as string;
    const nota = parseInt(formData.get("nota") as string);
    const comentario = formData.get("comentario") as string;

    if (!plantaoId || !profissionalId || isNaN(nota)) {
      throw new Error("Dados incompletos para avaliação.");
    }

    const { error } = await supabaseAdmin.from("avaliacoes").insert({
      plantao_id: plantaoId,
      solicitacao_id: solicitacaoId,
      profissional_id: profissionalId,
      nota: nota,
      comentario: comentario,
      quem_avaliou: 'familia'
    });

    if (error) throw error;

    // Optional: Revalidate path so the tracking page refreshes
    // But usually not strictly needed since client component handles success state locally
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}
