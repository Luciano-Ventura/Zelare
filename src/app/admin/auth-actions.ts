"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Credenciais inválidas." };
  }

  // Cria o cliente admin diretamente aqui para garantir que as credenciais sejam lidas corretamente
  const { createClient: createSupabaseClient } = await import("@supabase/supabase-js");
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
      }
    }
  );

  const { data: adminUser, error: adminError } = await supabaseAdmin
    .from("admin_users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (adminError || !adminUser || !adminUser.is_active) {
    console.error("Erro ou usuário não autorizado:", adminError, adminUser);
    // Não é admin, então desloga imediatamente e retorna erro
    await supabase.auth.signOut();
    return { error: "Acesso não autorizado para esta conta." };
  }

  // Se o login for bem sucedido e é admin, redirecionamos
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
