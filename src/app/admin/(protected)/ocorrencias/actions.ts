"use server";

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function createOcorrencia(data: {
  tipo_ocorrencia: string;
  gravidade: string;
  descricao: string;
  plantao_id?: string;
  solicitacao_id?: string;
  profissional_id?: string;
  responsavel?: string;
  aberta_por?: string;
}) {
  await requireAdmin();
  try {
    const { error } = await supabaseAdmin
      .from("ocorrencias")
      .insert([
        {
          tipo_ocorrencia: data.tipo_ocorrencia,
          gravidade: data.gravidade,
          descricao: data.descricao,
          plantao_id: data.plantao_id || null,
          solicitacao_id: data.solicitacao_id || null,
          profissional_id: data.profissional_id || null,
          responsavel: data.responsavel || null,
          aberta_por: data.aberta_por || "Admin (Operador)",
          status: "Aberta"
        }
      ]);
      
    if (error) throw error;
    
    revalidatePath("/admin/ocorrencias");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateOcorrencia(id: string, data: {
  status: string;
  resolucao?: string;
  responsavel_interno?: string;
}) {
  await requireAdmin();
  try {
    const isResolved = data.status === "Resolvida" || data.status === "Arquivada";
    
    const updateData: any = {
      status: data.status,
      atualizado_em: new Date().toISOString()
    };
    
    if (data.resolucao !== undefined) updateData.resolucao = data.resolucao;
    if (data.responsavel_interno !== undefined) updateData.responsavel_interno = data.responsavel_interno;
    
    // Set resolvido_em when transitioning to a resolved state
    if (isResolved) {
      updateData.resolvido_em = new Date().toISOString();
    }
    
    const { error } = await supabaseAdmin
      .from("ocorrencias")
      .update(updateData)
      .eq("id", id);
      
    if (error) throw error;
    
    revalidatePath("/admin/ocorrencias");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
