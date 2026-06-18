import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function mockarPagamento() {
  const codigo = "ZEL-DLWHJ1"; // O código da solicitação do usuário

  // 1. Pegar a solicitação
  const { data: solicitacao, error: errSolicitacao } = await supabase
    .from("familias_solicitacoes")
    .select("id")
    .eq("codigo_acompanhamento", codigo)
    .single();

  if (errSolicitacao || !solicitacao) {
    console.error("Erro ao buscar solicitacao", errSolicitacao);
    return;
  }

  console.log("Solicitacao encontrada:", solicitacao.id);

  // 2. Inserir mock no pagamento
  const { data: pagamento, error: errPagamento } = await supabase
    .from("pagamentos")
    .insert([
      {
        solicitacao_id: solicitacao.id,
        valor_centavos: 15000, // R$ 150,00
        status: "PENDING",
        gateway: "abacatepay",
        qr_code_url: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Zelare%20Cuidado6008BRASILIA62070503***63041D3D",
        pix_emv: "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Zelare Cuidado6008BRASILIA62070503***63041D3D",
      }
    ])
    .select();

  if (errPagamento) {
    console.error("Erro ao inserir pagamento", errPagamento);
  } else {
    console.log("Mock de pagamento inserido com sucesso:", pagamento);
  }

  // 3. Atualizar a solicitação para Aguardando Pagamento (se já não estiver)
  await supabase
    .from("familias_solicitacoes")
    .update({ status: "Aguardando pagamento", pagamento_status: "PENDING" })
    .eq("id", solicitacao.id);
    
  console.log("Status da solicitação atualizado.");
}

mockarPagamento();
