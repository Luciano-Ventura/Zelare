"use server";

import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";

export async function createPlantao(data: {
  solicitacao_id: string;
  profissional_id: string;
  data_plantao: string;
  horario_inicio: string;
  duracao: string;
  valor_profissional: number;
  taxa_zelare: number;
  total_familia: number;
  inicio_em: string;
  fim_em: string;
}) {
  await requireAdmin();

  try {
    // 1. Fetch Solicitacao data
    const { data: solic, error: solicError } = await supabaseAdmin
      .from("familias_solicitacoes")
      .select("*")
      .eq("id", data.solicitacao_id)
      .single();

    if (solicError || !solic) {
      throw new Error("Solicitação não encontrada");
    }

    // 2. Fetch Profissional data
    const { data: prof, error: profError } = await supabaseAdmin
      .from("profissionais_cadastros")
      .select("*")
      .eq("id", data.profissional_id)
      .single();

    if (profError || !prof) {
      throw new Error("Profissional não encontrado");
    }

    // 3. Insert Plantão
    const { error: insertError } = await supabaseAdmin
      .from("plantoes")
      .insert({
        solicitacao_id: data.solicitacao_id,
        profissional_id: data.profissional_id,
        familia_nome: solic.nome_completo,
        familia_whatsapp: solic.whatsapp,
        profissional_nome: prof.nome_completo,
        profissional_whatsapp: prof.whatsapp,
        data_plantao: data.data_plantao,
        horario_inicio: data.horario_inicio,
        duracao: data.duracao,
        cidade: solic.cidade,
        bairro: solic.bairro,
        tipo_cuidado: solic.tipo_profissional || "Cuidador",
        valor_profissional: data.valor_profissional,
        taxa_zelare: data.taxa_zelare,
        total_familia: data.total_familia,
        inicio_em: data.inicio_em,
        fim_em: data.fim_em,
        status: "Confirmado",
      });

    if (insertError) {
      throw new Error("Erro ao criar o plantão: " + insertError.message);
    }

    // 4. Update Solicitacao Status
    await supabaseAdmin
      .from("familias_solicitacoes")
      .update({ status: "Confirmado" })
      .eq("id", data.solicitacao_id);

    revalidatePath(`/admin/solicitacoes/${data.solicitacao_id}`);
    revalidatePath(`/admin/plantoes`);
    revalidatePath(`/admin`);

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Erro desconhecido" };
  }
}

export async function enviarConvite(solicitacaoId: string, profissionalId: string, valorOferecido?: number) {
  await requireAdmin();

  try {
    const { error } = await supabaseAdmin
      .from("oportunidades_profissionais")
      .insert({
        solicitacao_id: solicitacaoId,
        profissional_id: profissionalId,
        valor_oferecido: valorOferecido || null,
        status: "Enviada"
      });

    if (error) throw error;

    revalidatePath(`/admin/solicitacoes/${solicitacaoId}`);
    return { success: true };
  } catch (err: any) {
    return { error: "Erro ao enviar convite." };
  }
}
