"use server";

import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const COOKIE_NAME = "profissional_token";

export async function loginProfissionalAction(whatsapp: string, token: string) {
  // Limpar formatação do whatsapp
  const cleanWhatsapp = whatsapp.replace(/\D/g, "");
  // Converter token para maiúsculas e remover espaços extras, pois o CSS visualmente força uppercase
  const cleanToken = token.trim().toUpperCase();
  
  const { data, error } = await supabaseAdmin
    .from("profissionais_cadastros")
    .select("id, status_acesso")
    .eq("acesso_token", cleanToken)
    .eq("whatsapp", cleanWhatsapp)
    .single();

  if (error) {
    console.error("Login Profissional DB Error:", error);
    if (error.code === 'PGRST116') {
      return { error: "Credenciais inválidas. WhatsApp ou Token incorretos." };
    }
    return { error: "Erro de conexão com o banco de dados. Tente novamente." };
  }

  if (!data) {
    return { error: "Credenciais inválidas. Verifique seu WhatsApp e o token." };
  }

  if (data.status_acesso !== "Ativo") {
    return { error: "Seu acesso está bloqueado ou expirado. Contate a Zelare." };
  }

  // Atualizar último acesso
  await supabaseAdmin
    .from("profissionais_cadastros")
    .update({ ultimo_acesso: new Date().toISOString() })
    .eq("id", data.id);

  // Setar cookie
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, cleanToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 dias
    path: "/",
  });

  return { success: true };
}
