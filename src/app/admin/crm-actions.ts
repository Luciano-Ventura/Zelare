"use server";

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function updateStatus(table: "familias_solicitacoes" | "profissionais_cadastros" | "plantoes" | "ocorrencias", id: string, newStatus: string) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from(table)
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(`/admin`);
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
