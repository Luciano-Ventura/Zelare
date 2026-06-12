import { createClient } from "@/lib/supabase/server";

export type AdminRole = "admin" | "operador";

export type AdminUser = {
  id: string;
  email: string;
  role: AdminRole;
  nome: string | null;
  is_active: boolean;
};

/**
 * Verifica se o usuário atual está logado e é um administrador ativo.
 * Retorna os dados do usuário administrador se for válido, ou null caso contrário.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Busca na tabela admin_users (usando Admin Client para ignorar RLS provisoriamente e garantir que a consulta não falhe por políticas mal configuradas)
  const { supabaseAdmin } = await import("@/lib/supabaseAdmin");
  
  const { data: adminUser, error } = await supabaseAdmin
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !adminUser || !adminUser.is_active) {
    console.error("Erro ao verificar admin_users:", error, adminUser);
    return null;
  }

  return adminUser as AdminUser;
}

/**
 * Verifica se o usuário tem permissão de "admin" (super admin).
 * Operadores não passarão neste check.
 */
export async function requireSuperAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin || admin.role !== "admin") {
    throw new Error("Acesso negado: Requer privilégios de administrador geral.");
  }
  return admin;
}

/**
 * Garante que o usuário logado é um admin ativo (pode ser operador ou admin).
 * Lança um erro se não for. Usado em Server Actions.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdminUser();
  if (!admin) {
    throw new Error("Acesso negado: Usuário não autenticado ou inativo.");
  }
  return admin;
}
