export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseAdmin";
import { logAuditAction } from "@/lib/security/audit";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-abacatepay-signature") || req.headers.get("x-webhook-signature");
    const rawBody = await req.text(); // Read as raw text for signature validation

    // Validação do HMAC / Secret
    const webhookSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      // Calcula o HMAC do corpo bruto com o segredo
      const hmac = crypto.createHmac("sha256", webhookSecret);
      const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
      const sigBuffer = Buffer.from(signature, "utf8");

      if (sigBuffer.length !== digest.length || !crypto.timingSafeEqual(digest, sigBuffer)) {
        console.warn("Assinatura do webhook AbacatePay inválida.");
        await logAuditAction({
          acao: "WEBHOOK_INVALID_SIGNATURE",
          entidade: "webhook",
          metadata: { headers: Object.fromEntries(req.headers.entries()) }
        });
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else if (webhookSecret && !signature) {
      // Se configuramos o secret mas a request não trouxe assinatura
      console.warn("Webhook recebido sem assinatura.");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    } else {
      // Risco residual documentado: sem validação HMAC se a env var não estiver configurada
      console.warn("ABACATEPAY_WEBHOOK_SECRET não configurado. Processando webhook sem validação de assinatura.");
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const event = body.event || body.type;
    const gatewayId = body.data?.id;
    const solicitacaoId = body.data?.metadata?.solicitacao_id;

    if (!gatewayId) {
      return NextResponse.json({ error: "No gateway ID found" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Verificação de Idempotência
    const { data: pagamentoExistente } = await supabase
      .from("pagamentos")
      .select("status_pagamento, status")
      .eq("gateway_id", gatewayId)
      .single();

    if (!pagamentoExistente) {
      console.warn(`Pagamento não encontrado para gateway_id: ${gatewayId}`);
      // Em alguns gateways, o webhook de criação chega antes da inserção no banco
      // Aqui assumimos que ele já existe. Caso contrário, não processamos.
    }

    if (event === "PAYMENT_PAID" || event === "PAID") {
      if (pagamentoExistente?.status_pagamento === "Pago" || pagamentoExistente?.status === "PAID") {
        console.log(`Webhook ignorado (idempotência): Pagamento ${gatewayId} já está pago.`);
        return NextResponse.json({ received: true, ignored: "Already paid" });
      }

      // 1. Atualizar a tabela de pagamentos
      const { error: updatePagamentoError } = await supabase
        .from("pagamentos")
        .update({ status_pagamento: "Pago", status: "PAID", webhook_payload: body, updated_at: new Date().toISOString() })
        .eq("gateway_id", gatewayId);

      if (updatePagamentoError) {
        console.error("Erro ao atualizar pagamento:", updatePagamentoError);
        return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
      }

      // 2. Se temos o solicitacao_id no metadata, atualizamos a solicitação e o plantão
      if (solicitacaoId) {
        await supabase
          .from("familias_solicitacoes")
          .update({ 
            status: "Pagamento confirmado", 
            pagamento_status: "PAID" 
          })
          .eq("id", solicitacaoId);

        // Atualiza os plantões atrelados a esta solicitação
        await supabase
          .from("plantoes")
          .update({ 
            status: "Confirmado",
            status_financeiro: "Pago" 
          })
          .eq("solicitacao_id", solicitacaoId);
      }

      // Log de Auditoria
      await logAuditAction({
        acao: "WEBHOOK_PAGAMENTO_CONFIRMADO",
        entidade: "pagamentos",
        entidadeId: gatewayId,
        metadata: { solicitacaoId, event }
      });

    } else if (event === "PAYMENT_CANCELLED" || event === "CANCELLED") {
      if (pagamentoExistente?.status === "CANCELLED") {
        return NextResponse.json({ received: true, ignored: "Already cancelled" });
      }

      await supabase
        .from("pagamentos")
        .update({ status: "CANCELLED", webhook_payload: body, updated_at: new Date().toISOString() })
        .eq("gateway_id", gatewayId);

      await logAuditAction({
        acao: "WEBHOOK_PAGAMENTO_CANCELADO",
        entidade: "pagamentos",
        entidadeId: gatewayId,
        metadata: { event }
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook do AbacatePay:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
