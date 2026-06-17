"use server";

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function generateOrRegenerateMagicLink(profissionalId: string) {
  await requireAdmin();

  const newToken = crypto.randomUUID();
  const newOtp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

  const { error } = await supabaseAdmin
    .from("profissionais_cadastros")
    .update({
      // Magic Link (V1)
      token_acesso: newToken,
      token_gerado_em: new Date().toISOString(),
      acesso_app_status: "Ativo",
      
      // PWA OTP (V2)
      acesso_token: newOtp,
      status_acesso: "Ativo",
    })
    .eq("id", profissionalId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Registra observação interna
  await supabaseAdmin.from("observacoes_internas").insert([{
    entidade_tipo: "profissional",
    entidade_id: profissionalId,
    autor: "Admin / Sistema",
    observacao: "Novo Link Mágico Seguro gerado e acesso liberado."
  }]);

  revalidatePath(`/admin/profissionais/${profissionalId}`);
  return { success: true, token: newToken };
}

export async function blockMagicLink(profissionalId: string) {
  await requireAdmin();

  const { error } = await supabaseAdmin
    .from("profissionais_cadastros")
    .update({
      acesso_app_status: "Bloqueado",
      status_acesso: "Bloqueado",
    })
    .eq("id", profissionalId);

  if (error) {
    return { success: false, error: error.message };
  }

  // Registra observação interna
  await supabaseAdmin.from("observacoes_internas").insert([{
    entidade_tipo: "profissional",
    entidade_id: profissionalId,
    autor: "Admin / Sistema",
    observacao: "Acesso via Link Mágico foi bloqueado manualmente."
  }]);

  revalidatePath(`/admin/profissionais/${profissionalId}`);
  return { success: true };
}
