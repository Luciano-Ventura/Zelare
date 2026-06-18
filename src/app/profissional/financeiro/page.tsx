import { requireProfissional } from "@/lib/auth-profissional";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Wallet, TrendingUp, Calendar, CheckCircle2, DollarSign, ArrowDownToLine } from "lucide-react";

export const revalidate = 0;

export default async function FinanceiroProfissionalPage() {
  const sessao = await requireProfissional();

  // Buscar os repasses ou plantões concluídos do profissional
  const { data: repasses } = await supabaseAdmin
    .from("repasses_profissionais")
    .select("*, plantoes(data_plantao, horario_inicio, tipo_cuidado)")
    .eq("profissional_id", sessao.id)
    .order("created_at", { ascending: false });

  const repassesProcessados = repasses || [];

  // Agrupamentos e somatórios
  let aReceber = 0;
  let jaRecebido = 0;

  repassesProcessados.forEach(r => {
    if (r.status_repasse === "Repasse Concluído") {
      jaRecebido += Number(r.valor_profissional || 0);
    } else {
      aReceber += Number(r.valor_profissional || 0);
    }
  });

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="p-6 pb-32 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-black text-[#2F3437] text-3xl tracking-tighter">Financeiro</h1>
        <p className="text-sm font-bold text-[#6B7280] mt-1">Controle seus ganhos e repasses</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">A Receber</h2>
          </div>
          <p className="text-3xl font-black text-[#2F3437]">{formatter.format(aReceber)}</p>
          <p className="text-[10px] font-bold text-blue-500 mt-2 bg-blue-50 px-2 py-1 rounded w-max">
            Em processamento
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Já Recebido</h2>
          </div>
          <p className="text-3xl font-black text-green-600">{formatter.format(jaRecebido)}</p>
          <p className="text-[10px] font-bold text-green-600 mt-2 bg-green-50 px-2 py-1 rounded w-max">
            Transferido para sua conta
          </p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-[#2F3437] mb-4">Extrato de Repasses</h2>
      
      {repassesProcessados.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
          <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-[#6B7280] font-bold">Nenhum repasse registrado ainda.</p>
          <p className="text-xs text-gray-400 mt-1">Conclua plantões para começar a gerar ganhos.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {repassesProcessados.map(rep => (
            <div key={rep.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${rep.status_repasse === "Repasse Concluído" ? "bg-green-50 text-green-500" : "bg-blue-50 text-blue-500"}`}>
                  {rep.status_repasse === "Repasse Concluído" ? <ArrowDownToLine className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-[#2F3437]">{rep.plantoes?.tipo_cuidado || "Plantão Zelare"}</p>
                  <p className="text-xs font-semibold text-[#6B7280] flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3" /> {rep.plantoes?.data_plantao || "Data não informada"}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right flex flex-col sm:items-end">
                <p className="text-lg font-black text-[#2F3437]">{formatter.format(rep.valor_profissional)}</p>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md inline-block mt-1 ${
                  rep.status_repasse === "Repasse Concluído" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"
                }`}>
                  {rep.status_repasse}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
