import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabaseAdmin";
import { redirect } from "next/navigation";

const COOKIE_NAME = "profissional_token";

export type ProfissionalSessao = {
  id: string;
  nome_completo: string;
  whatsapp: string;
  categoria_profissional: string;
  status: string;
};

export async function getProfissionalSessao(): Promise<ProfissionalSessao | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  // Verificar o token no banco de dados usando supabaseAdmin
  const { data, error } = await supabaseAdmin
    .from("profissionais_cadastros")
    .select("id, nome_completo, whatsapp, categoria_profissional, status, status_acesso")
    .eq("acesso_token", token)
    .single();

  if (error || !data || data.status_acesso !== "Ativo") {
    return null;
  }

  return {
    id: data.id,
    nome_completo: data.nome_completo,
    whatsapp: data.whatsapp,
    categoria_profissional: data.categoria_profissional,
    status: data.status,
  };
}

export async function requireProfissional() {
  const sessao = await getProfissionalSessao();
  
  if (!sessao) {
    redirect("/profissional/login");
  }
  
  return sessao;
}



export async function logoutProfissional() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/profissional/login");
}
