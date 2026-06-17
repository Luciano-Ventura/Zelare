import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Usar service role para permissão admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { action, id } = await req.json();

    if (!action || !id) {
      return NextResponse.json({ error: "Faltam parâmetros" }, { status: 400 });
    }

    if (action === "gerar_link") {
      const { error } = await supabaseAdmin
        .from("pagamentos")
        .update({ 
          link_pagamento: "https://sandbox.asaas.com/c/123xyz", 
          status_pagamento: "Aguardando pagamento" 
        })
        .eq("id", id);
      
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "marcar_pago") {
      const { error } = await supabaseAdmin
        .from("pagamentos")
        .update({ 
          status_pagamento: "Pago",
          pago_em: new Date().toISOString()
        })
        .eq("id", id);
      
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === "confirmar_repasse") {
      const { error } = await supabaseAdmin
        .from("repasses_profissionais")
        .update({ 
          status_repasse: "Repasse Concluído",
          repassado_em: new Date().toISOString()
        })
        .eq("id", id);
      
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Ação desconhecida" }, { status: 400 });
  } catch (err: any) {
    console.error("Erro na acao financeira:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
