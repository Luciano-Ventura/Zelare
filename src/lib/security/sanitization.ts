import { createAdminClient } from "@/lib/supabaseAdmin";

/**
 * Remove dados sensíveis financeiros ou internos de um objeto de solicitação.
 * Deve ser usado ANTES de passar os dados para o client component.
 */
export function sanitizeFamilyPortalData(data: any): Record<string, any> {
  if (!data) return data;

  // Clona o objeto para não mutar o original caso venha de cache
  const sanitized = { ...data };

  // Campos estritamente proibidos
  const forbiddenFields = [
    "taxa_zelare",
    "margem",
    "valor_profissional",
    "valor_repasse",
    "repasse",
    "custo_gateway",
    "valor_liquido_apos_gateway",
    "observacoes_internas",
    "webhook_payload",
    "audit_logs"
  ];

  for (const field of forbiddenFields) {
    if (field in sanitized) {
      delete sanitized[field];
    }
  }

  // Sanitizar arrays aninhados se houver pagamentos ou plantões
  if (Array.isArray(sanitized.pagamentos)) {
    sanitized.pagamentos = sanitized.pagamentos.map(sanitizeFamilyPortalData);
  }
  
  if (Array.isArray(sanitized.plantoes)) {
    sanitized.plantoes = sanitized.plantoes.map(sanitizeFamilyPortalData);
  }

  return sanitized;
}

/**
 * Busca a solicitação e limpa os campos. Redireciona/resolve fallback UUID se necessário.
 */
export async function getPublicSolicitacaoByCodigo(codigoOuId: string) {
  const supabase = createAdminClient();

  // Verifica se é um formato de UUID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(codigoOuId);

  let query = supabase
    .from("familias_solicitacoes")
    .select(`
      *,
      plantoes(*),
      pagamentos(*)
    `);

  if (isUUID) {
    query = query.eq("id", codigoOuId);
  } else {
    query = query.eq("codigo_acompanhamento", codigoOuId);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return null;
  }

  return sanitizeFamilyPortalData(data);
}
