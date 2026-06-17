"use server";

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function updateStatus(table: "familias_solicitacoes" | "profissionais_cadastros" | "plantoes" | "ocorrencias", id: string, newStatus: string) {
  await requireAdmin();

  if (table === "profissionais_cadastros" && (newStatus === "Validado" || newStatus === "Ativo")) {
    const { data: prof } = await supabaseAdmin.from("profissionais_cadastros").select("checklist_validacao").eq("id", id).single();
    const checklist = prof?.checklist_validacao || {};
    const itemsRequired = ["identidade", "residencia", "certificado", "entrevista", "referencias"];
    const allChecked = itemsRequired.every(i => checklist[i]);
    if (!allChecked) {
      return { success: false, error: "O checklist de validação não está completo. Conclua os itens pendentes antes de aprovar." };
    }
  }

  const { error } = await supabaseAdmin
    .from(table)
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  if (table === "familias_solicitacoes") {
    const { data } = await supabaseAdmin.from("familias_solicitacoes").select("codigo_acompanhamento").eq("id", id).single();
    if (data?.codigo_acompanhamento) {
      revalidatePath(`/acompanhar/${data.codigo_acompanhamento}`);
    }
    revalidatePath(`/admin/solicitacoes/${id}`);
    revalidatePath(`/admin/solicitacoes`);
  }

  revalidatePath(`/admin`);
  revalidatePath(`/`, 'layout');
  return { success: true };
}

export async function addObservacaoInterna(entidade_tipo: string, entidade_id: string, observacao: string) {
  const admin = await requireAdmin();

  const { error } = await supabaseAdmin
    .from("observacoes_internas")
    .insert([{
      entidade_tipo,
      entidade_id,
      autor: admin.nome || admin.email,
      observacao
    }]);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin`);
  return { success: true };
}

export async function confirmarPagamento({ plantaoId, pacoteId, solicitacaoId }: { plantaoId?: string, pacoteId?: string, solicitacaoId: string }): Promise<{success: boolean, error?: string}> {
  try {
    const admin = await requireAdmin();

    if (pacoteId) {
      // É um pacote
      await supabaseAdmin
        .from("pagamentos")
        .update({ status_pagamento: "Pago", pago_em: new Date().toISOString() })
        .eq("pacote_id", pacoteId);

      await supabaseAdmin
        .from("pacotes_plantoes")
        .update({ status: "Pago" })
        .eq("id", pacoteId);

      const { data: plantoesPacote } = await supabaseAdmin
        .from("plantoes")
        .select("id, status")
        .eq("pacote_id", pacoteId);

      if (plantoesPacote) {
        for (const p of plantoesPacote) {
          const newStatus = (p.status === "Concluído" || p.status === "Cancelado" || p.status === "Em andamento") ? p.status : "Confirmado";
          await supabaseAdmin
            .from("plantoes")
            .update({ status: newStatus, status_financeiro: "Pagamento confirmado" })
            .eq("id", p.id);
        }
      }

    } else if (plantaoId) {
      // É um plantão avulso
      await supabaseAdmin
        .from("pagamentos")
        .update({ status_pagamento: "Pago", pago_em: new Date().toISOString() })
        .eq("plantao_id", plantaoId);

      const { data: plantao } = await supabaseAdmin.from("plantoes").select("status").eq("id", plantaoId).single();
      const newStatus = (plantao?.status === "Concluído" || plantao?.status === "Cancelado" || plantao?.status === "Em andamento") ? plantao?.status : "Confirmado";

      await supabaseAdmin
        .from("plantoes")
        .update({ status: newStatus, status_financeiro: "Pagamento confirmado" })
        .eq("id", plantaoId);
    }

    // Atualizar Solicitação
    await supabaseAdmin
      .from("familias_solicitacoes")
      .update({ status: "Confirmado" })
      .eq("id", solicitacaoId);

    // Adicionar Observação
    await supabaseAdmin
      .from("observacoes_internas")
      .insert([{
        entidade_tipo: "solicitacao",
        entidade_id: solicitacaoId,
        autor: admin.nome || admin.email,
        observacao: pacoteId ? "Admin confirmou pagamento do PACOTE." : "Admin confirmou pagamento do PLANTÃO ÚNICO."
      }]);

    const { data } = await supabaseAdmin.from("familias_solicitacoes").select("codigo_acompanhamento").eq("id", solicitacaoId).single();
    if (data?.codigo_acompanhamento) {
      revalidatePath(`/acompanhar/${data.codigo_acompanhamento}`);
    }
    revalidatePath(`/admin/solicitacoes/${solicitacaoId}`);
    revalidatePath(`/admin/solicitacoes`);
    revalidatePath(`/admin`);

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro desconhecido" };
  }
}
