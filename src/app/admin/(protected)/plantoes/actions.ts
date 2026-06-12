"use server";

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function updatePlantaoStatus(id: string, newStatus: string) {
  await requireAdmin();

  try {
    const { error } = await supabaseAdmin
      .from("plantoes")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/plantoes");
    revalidatePath("/admin");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro desconhecido ao atualizar status do plantão" };
  }
}
