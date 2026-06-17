"use server";

import { requireProfissional } from "@/lib/auth-profissional";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function inativarMeuPerfil() {
  const sessao = await requireProfissional();

  try {
    const { error } = await supabaseAdmin
      .from("profissionais_cadastros")
      .update({ status: "Inativo" })
      .eq("id", sessao.id);

    if (error) throw error;

    return { success: true };
  } catch (err: any) {
    return { error: "Erro ao inativar conta: " + err.message };
  }
}

export async function updateMeuPerfil(formData: any) {
  const sessao = await requireProfissional();

  try {
    // Permitir apenas campos seguros de serem editados pelo próprio profissional
    const safeData = {
      whatsapp: formData.whatsapp,
      cidade: formData.cidade,
      bairro: formData.bairro,
      endereco_base_completo: formData.endereco_base_completo,
      endereco_base_numero: formData.endereco_base_numero,
      endereco_base_complemento: formData.endereco_base_complemento,
      pix_tipo: formData.pix_tipo,
      pix_chave: formData.pix_chave,
    };

    const { error } = await supabaseAdmin
      .from("profissionais_cadastros")
      .update(safeData)
      .eq("id", sessao.id);

    if (error) throw error;

    revalidatePath(`/profissional/perfil`);
    return { success: true };
  } catch (err: any) {
    return { error: "Erro ao atualizar perfil: " + err.message };
  }
}
