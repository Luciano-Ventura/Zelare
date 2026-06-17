"use server";

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function inativarProfissional(id: string) {
  await requireAdmin();

  try {
    const { error } = await supabaseAdmin
      .from("profissionais_cadastros")
      .update({ status: "Inativo" })
      .eq("id", id);

    if (error) throw error;

    revalidatePath(`/admin/profissionais/${id}`);
    revalidatePath(`/admin/profissionais`);
    return { success: true };
  } catch (err: any) {
    return { error: "Erro ao inativar profissional: " + err.message };
  }
}

export async function updateProfissional(id: string, formData: any) {
  await requireAdmin();

  try {
    const { error } = await supabaseAdmin
      .from("profissionais_cadastros")
      .update(formData)
      .eq("id", id);

    if (error) throw error;

    revalidatePath(`/admin/profissionais/${id}`);
    revalidatePath(`/admin/profissionais`);
    return { success: true };
  } catch (err: any) {
    return { error: "Erro ao atualizar profissional: " + err.message };
  }
}

export async function updateProfissionalChecklist(id: string, checklist: Record<string, boolean>) {
  await requireAdmin();
  try {
    const { error } = await supabaseAdmin
      .from("profissionais_cadastros")
      .update({ checklist_validacao: checklist })
      .eq("id", id);
      
    if (error) throw error;
    revalidatePath(`/admin/profissionais/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
