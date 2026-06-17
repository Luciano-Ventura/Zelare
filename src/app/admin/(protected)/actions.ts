"use server";

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function updateChecklistItem(id: string, status: string, observacao?: string) {
  await requireAdmin();
  try {
    const updateData: any = {
      status,
      atualizado_em: new Date().toISOString()
    };
    if (observacao !== undefined) updateData.observacao = observacao;
    if (status === "Concluído") updateData.concluido_em = new Date().toISOString();

    const { error } = await supabaseAdmin
      .from("checklist_operacao")
      .update(updateData)
      .eq("id", id);
      
    if (error) throw error;
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
