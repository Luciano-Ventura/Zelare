import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-abacatepay-signature");
    // Em produção, você DEVE validar essa assinatura com a chave webhook_secret do AbacatePay
    // usando criptografia para garantir que o webhook veio realmente deles.

    const body = await req.json();

    // Verifique a estrutura do body conforme a documentação do AbacatePay.
    // Exemplo comum: { event: "PAYMENT_PAID", data: { id: "...", metadata: { solicitacao_id: "..." } } }
    const event = body.event || body.type;
    const gatewayId = body.data?.id;
    const solicitacaoId = body.data?.metadata?.solicitacao_id;

    if (!gatewayId) {
      return NextResponse.json({ error: "No gateway ID found" }, { status: 400 });
    }

    const supabase = createAdminClient();

    if (event === "PAYMENT_PAID" || event === "PAID") {
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
    } else if (event === "PAYMENT_CANCELLED" || event === "CANCELLED") {
      await supabase
        .from("pagamentos")
        .update({ status: "CANCELLED", webhook_payload: body, updated_at: new Date().toISOString() })
        .eq("gateway_id", gatewayId);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook do AbacatePay:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
