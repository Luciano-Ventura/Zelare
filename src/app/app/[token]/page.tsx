import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Wallet, Calendar, CheckCircle2, ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function ProfissionalDashboard({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = await params;
  const token = resolvedParams.token;

  const { data: prof } = await supabaseAdmin
    .from("profissionais_cadastros")
    .select("id")
    .eq("token_acesso", token)
    .single();

  if (!prof) notFound();

  // Buscar plantões
  const { data: plantoes } = await supabaseAdmin
    .from("plantoes")
    .select("id, familia_nome, data_plantao, horario_inicio, duracao, status, valor_profissional, inicio_em")
    .eq("profissional_id", prof.id)
    .order("inicio_em", { ascending: true });

  const plantoesAtivos = plantoes?.filter(p => !["Cancelado", "Concluído"].includes(p.status)) || [];
  const historico = plantoes?.filter(p => p.status === "Concluído" || p.status === "Cancelado") || [];

  const ganhosConcluidos = historico
    .filter(p => p.status === "Concluído")
    .reduce((acc, p) => acc + (Number(p.valor_profissional) || 0), 0);

  const valorPendente = plantoesAtivos
    .filter(p => p.status !== "Cancelado")
    .reduce((acc, p) => acc + (Number(p.valor_profissional) || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-[#2F3437] tracking-tight">Painel Zelare</h2>
        <p className="text-sm text-[#6B7280] font-medium mt-1">Acompanhe seus ganhos e plantões.</p>
      </div>

      {/* Meus Ganhos */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet className="w-24 h-24" />
        </div>
        <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-4 relative z-10">Meus Ganhos</h3>
        
        <div className="space-y-4 relative z-10">
          <div>
            <p className="text-sm font-bold text-text-main mb-1">Ganhos de Plantões Concluídos</p>
            <p className="text-3xl font-black text-green-600">R$ {ganhosConcluidos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          
          <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Aguardando Conclusão</p>
              <p className="text-lg font-bold text-gray-400">R$ {valorPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold">
              Pronto para repasse
            </span>
          </div>
        </div>
      </div>

      {/* Plantões Ativos */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#8ECADF]" /> Próximos Plantões
        </h3>
        
        {plantoesAtivos.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
             <p className="text-sm text-gray-500 font-medium">Você não tem plantões pendentes no momento.</p>
          </div>
        ) : (
          plantoesAtivos.map(p => (
            <Link key={p.id} href={`/app/${token}/plantao/${p.id}`} className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-[#8ECADF] transition-colors group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs font-bold text-[#8ECADF] uppercase tracking-wider">{p.data_plantao}</p>
                  <p className="text-lg font-bold text-[#2F3437]">{p.familia_nome}</p>
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold uppercase">
                  {p.status}
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-[#6B7280] font-medium">Início: {p.horario_inicio}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Duração: {p.duracao}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#8ECADF] group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Histórico */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" /> Histórico Concluído
        </h3>
        
        {historico.length === 0 ? (
          <p className="text-sm text-gray-500 font-medium px-2">Nenhum plantão concluído ainda.</p>
        ) : (
          historico.slice(0, 5).map(p => (
             <div key={p.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex justify-between items-center opacity-80">
                <div>
                  <p className="text-sm font-bold text-text-main">{p.familia_nome}</p>
                  <p className="text-xs text-gray-500">{p.data_plantao} - {p.status}</p>
                </div>
                <p className="text-sm font-bold text-green-600">R$ {p.valor_profissional}</p>
             </div>
          ))
        )}
      </div>

    </div>
  );
}
