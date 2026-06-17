"use server";

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function savePaymentLink(pagamentoId: string, link: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  try {
    const { error } = await supabaseAdmin
      .from("pagamentos")
      .update({ link_pagamento: link })
      .eq("id", pagamentoId);
    
    if (error) throw error;
    revalidatePath("/admin/financeiro");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function markAsPaid(pagamentoId: string, plantaoId: string | null, solicitacaoId: string, pacoteId?: string | null): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  try {
    const agora = new Date().toISOString();

    // 1. Atualizar Pagamento
    const { error: pgError } = await supabaseAdmin
      .from("pagamentos")
      .update({ 
        status_pagamento: "Pago",
        pago_em: agora,
        updated_at: agora 
      })
      .eq("id", pagamentoId);
    if (pgError) throw pgError;

    if (pacoteId) {
      // É um pacote
      await supabaseAdmin
        .from("pacotes_plantoes")
        .update({ status: "Pago" })
        .eq("id", pacoteId);

      // Buscar os plantões deste pacote para não sobrescrever os concluídos
      const { data: plantoesPacote } = await supabaseAdmin
        .from("plantoes")
        .select("id, status")
        .eq("pacote_id", pacoteId);

      if (plantoesPacote) {
        for (const p of plantoesPacote) {
          const newStatus = (p.status === "Concluído" || p.status === "Cancelado" || p.status === "Em andamento") ? p.status : "Confirmado";
          await supabaseAdmin
            .from("plantoes")
            .update({ 
              status: newStatus,
              status_financeiro: "Pagamento confirmado"
            })
            .eq("id", p.id);
        }
      }
    } else if (plantaoId) {
      // 2. Atualizar Plantão Único
      const { data: plantao } = await supabaseAdmin.from("plantoes").select("status").eq("id", plantaoId).single();
      const newStatus = (plantao?.status === "Concluído" || plantao?.status === "Cancelado" || plantao?.status === "Em andamento") ? plantao.status : "Confirmado";

      const { error: plantaoError } = await supabaseAdmin
        .from("plantoes")
        .update({ 
          status: newStatus,
          status_financeiro: "Pagamento confirmado"
        })
        .eq("id", plantaoId);
      if (plantaoError) throw plantaoError;
    }

    // 3. Atualizar Solicitação
    const { error: solicError } = await supabaseAdmin
      .from("familias_solicitacoes")
      .update({ status: "Confirmado" })
      .eq("id", solicitacaoId);
    if (solicError) throw solicError;

    revalidatePath("/admin/financeiro");
    revalidatePath(`/admin/solicitacoes/${solicitacaoId}`);
    revalidatePath(`/acompanhar`);
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function markRepasseAsDone(repasseId: string): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  try {
    const agora = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from("repasses_profissionais")
      .update({ 
        status_repasse: "Repassado",
        repassado_em: agora,
        updated_at: agora 
      })
      .eq("id", repasseId);
    
    if (error) throw error;
    revalidatePath("/admin/financeiro");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
