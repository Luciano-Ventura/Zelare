import { requireProfissional } from "@/lib/auth-profissional";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { CalendarClock, Bell, ChevronRight, AlertCircle, PlayCircle } from "lucide-react";

export const revalidate = 0;

export default async function ProfissionalDashboard() {
  const sessao = await requireProfissional();

  // Buscar Oportunidades pendentes (Enviada ou Visualizada)
  const { data: oportunidades } = await supabaseAdmin
    .from("oportunidades_profissionais")
    .select("id, solicitacao_id, familias_solicitacoes(cidade, bairro, tipo_profissional, duracao_plantao)")
    .eq("profissional_id", sessao.id)
    .in("status", ["Enviada", "Visualizada"]);

  // Buscar Plantões Confirmados ou Em andamento
  const { data: plantoesAtivos } = await supabaseAdmin
    .from("plantoes")
    .select("id, data_plantao, horario_inicio, duracao, cidade, status")
    .eq("profissional_id", sessao.id)
    .in("status", ["Confirmado", "Em andamento", "Reagendado"])
    .order("inicio_em", { ascending: true });

  const proximoPlantao = plantoesAtivos?.[0];
  const emAndamento = plantoesAtivos?.find(p => p.status === "Em andamento");

  return (
    <div className="p-6 space-y-6">
      {/* Saudação */}
      <div>
        <h2 className="text-2xl font-black text-[#2F3437] tracking-tight">Olá, {sessao.nome_completo.split(" ")[0]}!</h2>
        <p className="text-sm text-[#6B7280] font-medium mt-1">Veja o que precisa de sua atenção hoje.</p>
      </div>

      {/* Alertas */}
      {emAndamento && (
        <div className="bg-[#A8D5BA] rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <PlayCircle className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <span className="bg-white/30 text-[#2F3437] text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md">Plantão Ativo</span>
            <h3 className="font-bold text-[#2F3437] text-lg mt-3">{emAndamento.cidade}</h3>
            <p className="text-sm font-medium text-[#2F3437]/80">Até {emAndamento.duracao}</p>
            <Link href={`/profissional/plantoes/${emAndamento.id}`} className="mt-4 inline-flex items-center justify-between w-full bg-white/40 hover:bg-white/50 transition-colors py-3 px-4 rounded-xl text-[#2F3437] font-bold text-sm">
              Ver detalhes do plantão <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Resumo */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/profissional/oportunidades" data-testid="convites-lista" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:border-[#8ECADF] transition-colors">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-3 relative">
            <Bell className="w-6 h-6" />
            {oportunidades && oportunidades.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {oportunidades.length}
              </span>
            )}
          </div>
          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Convites Novos</p>
          <p className="text-2xl font-black text-[#2F3437]">{oportunidades?.length || 0}</p>
        </Link>

        <Link href="/profissional/plantoes" className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center text-center hover:border-[#8ECADF] transition-colors">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-3">
            <CalendarClock className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Próximos</p>
          <p className="text-2xl font-black text-[#2F3437]">{plantoesAtivos?.filter(p => p.status !== "Em andamento").length || 0}</p>
        </Link>
      </div>

      {/* Próximo Plantão */}
      {!emAndamento && proximoPlantao && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#8ECADF]" /> Próximo Compromisso
          </h3>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-black tracking-wider text-[#8ECADF] bg-[#8ECADF]/10 px-2 py-1 rounded-md uppercase">
                {proximoPlantao.data_plantao} às {proximoPlantao.horario_inicio}
              </span>
            </div>
            <p className="font-bold text-[#2F3437]">{proximoPlantao.cidade}</p>
            <p className="text-xs text-[#6B7280] font-medium mt-1">Duração esperada: {proximoPlantao.duracao}</p>
            <Link href={`/profissional/plantoes/${proximoPlantao.id}`} className="mt-4 flex items-center justify-center w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-[#2F3437] transition-colors">
              Ver Detalhes
            </Link>
          </div>
        </div>
      )}

      {/* Oportunidades List (Preview) */}
      {oportunidades && oportunidades.length > 0 && (
        <div>
           <div className="flex justify-between items-end mb-4">
              <h3 className="text-sm font-bold text-[#2F3437]">Novos Convites</h3>
              <Link href="/profissional/oportunidades" className="text-xs font-bold text-[#8ECADF]">Ver todos</Link>
           </div>
           <div className="space-y-3">
              {oportunidades.slice(0,2).map(op => {
                const sol = op.familias_solicitacoes as any;
                return (
                  <Link key={op.id} href={`/profissional/oportunidades/${op.id}`} className="block bg-white border border-blue-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-blue-500 mb-1">Nova Oportunidade</p>
                        <p className="text-sm font-bold text-[#2F3437]">{sol.cidade} - {sol.bairro}</p>
                        <p className="text-xs text-[#6B7280] mt-1">{sol.tipo_profissional} • {sol.duracao_plantao}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </div>
                  </Link>
                )
              })}
           </div>
        </div>
      )}

    </div>
  );
}
