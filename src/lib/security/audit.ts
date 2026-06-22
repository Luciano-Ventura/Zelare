import { supabaseAdmin } from "@/lib/supabaseAdmin";

export type AuditLogParams = {
  userId?: string;
  userEmail?: string;
  role?: string;
  acao: string;
  entidade?: string;
  entidadeId?: string;
  antes?: Record<string, any> | null;
  depois?: Record<string, any> | null;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, any> | null;
};

/**
 * Registra uma ação no audit_logs via Supabase Admin (ignora RLS de insert).
 * Deve ser chamado apenas do lado do servidor (Server Actions / Route Handlers).
 */
export async function logAuditAction(params: AuditLogParams) {
  try {
    const { error } = await supabaseAdmin.from("audit_logs").insert({
      user_id: params.userId,
      user_email: params.userEmail,
      role: params.role,
      acao: params.acao,
      entidade: params.entidade,
      entidade_id: params.entidadeId,
      antes: params.antes || null,
      depois: params.depois || null,
      ip: params.ip,
      user_agent: params.userAgent,
      metadata: params.metadata || null,
    });

    if (error) {
      console.error("Falha ao registrar audit_log:", error);
    }
  } catch (err) {
    console.error("Erro inesperado no logAuditAction:", err);
  }
}
