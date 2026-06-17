import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { ArrowRight, Clock, Users, UserSquare2, CalendarClock, AlertTriangle, UserCheck, SearchX, Wallet, DollarSign } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const revalidate = 0; // Disable cache for dashboard

export default async function AdminDashboard() {
  await requireAdmin();

  const hojeStr = new Date().toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
  const dataAmanha = new Date();
  dataAmanha.setDate(dataAmanha.getDate() + 1);
  const amanhaStr = dataAmanha.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

  // Get last 7 days strings
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const [
    { count: countNovosPedidos },
    { count: countUrgentes },
    { count: countProfAnalise },
    { count: countSemProfissional },
    { count: countOcorrenciasPendentes },
    { data: ultimasSolicitacoes },
    { data: plantoesHoje },
    { data: plantoesAmanha },
    { data: solics7Days },
    { count: countPagamentosPendentes },
    { count: countRepassesPendentes }
  ] = await Promise.all([
    supabaseAdmin.from("familias_solicitacoes").select("*", { count: "exact", head: true }).eq("status", "Novo pedido"),
    supabaseAdmin.from("familias_solicitacoes").select("*", { count: "exact", head: true }).eq("e_urgente", true).in("status", ["Novo pedido", "Em análise", "Procurando profissional", "Aguardando informações"]),
    supabaseAdmin.from("profissionais_cadastros").select("*", { count: "exact", head: true }).in("status", ["Novo cadastro", "Em análise", "Aguardando informações"]),
    supabaseAdmin.from("familias_solicitacoes").select("*", { count: "exact", head: true }).eq("status", "Sem profissional disponível"),
    supabaseAdmin.from("ocorrencias").select("*", { count: "exact", head: true }).eq("status", "Aberta"),
    supabaseAdmin.from("familias_solicitacoes").select("id, nome_completo, created_at, tipo_profissional, e_urgente, status").order("created_at", { ascending: false }).limit(5),
    supabaseAdmin.from("plantoes").select("id, familia_nome, profissional_nome, data_plantao, horario_inicio, duracao, status").eq("data_plantao", hojeStr).in("status", ["Confirmado", "Em andamento"]).order("horario_inicio", { ascending: true }),
    supabaseAdmin.from("plantoes").select("id, familia_nome, profissional_nome, data_plantao, horario_inicio, duracao, status").eq("data_plantao", amanhaStr).in("status", ["Confirmado", "Em andamento"]).order("horario_inicio", { ascending: true }),
    supabaseAdmin.from("familias_solicitacoes").select("created_at").gte("created_at", `${last7Days[0]}T00:00:00Z`),
    supabaseAdmin.from("pagamentos").select("*", { count: "exact", head: true }).eq("status_pagamento", "Aguardando pagamento"),
    supabaseAdmin.from("repasses_profissionais").select("*", { count: "exact", head: true }).eq("status_repasse", "Pronto para repasse")
  ]);

  // Chart data calculation
  const chartData = last7Days.map(date => {
    const count = solics7Days?.filter(s => s.created_at.startsWith(date)).length || 0;
    const dateObj = new Date(date + "T12:00:00Z");
    const label = dateObj.toLocaleDateString("pt-BR", { weekday: 'short' }).replace('.', '');
    return { date, label, count };
  });
  const maxCount = Math.max(...chartData.map(d => d.count), 1); // Avoid div by zero

  const filaAcao = [
    { name: "Novos Pedidos", value: countNovosPedidos || 0, icon: Users, href: "/admin/solicitacoes?status=Novo pedido", color: "text-[#2F3437]", bg: "bg-[#8ECADF]", border: "border-[#8ECADF]/30" },
    { name: "Pedidos Urgentes", value: countUrgentes || 0, icon: Clock, href: "/admin/solicitacoes?urgencia=true", color: "text-red-700", bg: "bg-red-100", border: "border-red-200" },
    { name: "Sem Profissional", value: countSemProfissional || 0, icon: SearchX, href: "/admin/solicitacoes?status=Sem profissional disponível", color: "text-orange-700", bg: "bg-orange-100", border: "border-orange-200" },
    { name: "Profs p/ Validar", value: countProfAnalise || 0, icon: UserSquare2, href: "/admin/profissionais?status=validacao", color: "text-yellow-800", bg: "bg-yellow-100", border: "border-yellow-200" },
    { name: "Ocorrências Abertas", value: countOcorrenciasPendentes || 0, icon: AlertTriangle, href: "/admin/ocorrencias?status=Aberta", color: "text-red-700", bg: "bg-red-100", border: "border-red-200" },
    { name: "Plantões Hoje", value: plantoesHoje?.length || 0, icon: CalendarClock, href: "/admin/plantoes", color: "text-[#2F3437]", bg: "bg-[#A8D5BA]", border: "border-[#A8D5BA]/30" },
    { name: "Pagamentos Pendentes", value: countPagamentosPendentes || 0, icon: Wallet, href: "/admin/financeiro", color: "text-purple-700", bg: "bg-purple-100", border: "border-purple-200" },
    { name: "Repasses Pendentes", value: countRepassesPendentes || 0, icon: DollarSign, href: "/admin/financeiro", color: "text-green-700", bg: "bg-green-100", border: "border-green-200" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold text-[#2F3437] tracking-tight">Visão Operacional</h1>
        <p className="text-sm text-[#6B7280] mt-1">O que você precisa resolver hoje?</p>
      </div>

      {/* Fila de Ação */}
      <div>
        <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-4">Fila de Ação</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {filaAcao.map((card) => {
            const Icon = card.icon;
            return (
              <Link href={card.href} key={card.name} className={`group bg-white rounded-2xl shadow-sm border ${card.border} p-4 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}>
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-xl ${card.bg} group-hover:scale-105 transition-transform duration-200`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <p className="text-2xl font-black text-[#2F3437] tracking-tight">{card.value}</p>
                </div>
                <p className="text-xs font-bold text-[#6B7280] leading-tight">{card.name}</p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico 7 dias */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-6">Novos Pedidos (7 Dias)</h2>
          <div className="flex-1 flex items-end justify-between gap-2 h-40">
            {chartData.map((d, i) => {
              const heightPercent = (d.count / maxCount) * 100;
              return (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="w-full relative flex justify-center h-full items-end">
                    <div 
                      className="w-full max-w-[32px] bg-blue-light rounded-t-md transition-all duration-300 group-hover:bg-blue-400"
                      style={{ height: `${Math.max(heightPercent, 5)}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs font-bold text-[#2F3437] transition-opacity">
                        {d.count}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-[#6B7280] uppercase">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Últimas Solicitações */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col lg:col-span-2">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#FAFAF7] rounded-t-2xl">
            <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider">Últimas Solicitações</h2>
            <Link href="/admin/solicitacoes" className="text-xs font-bold text-[#8ECADF] hover:text-[#6bb6ce] flex items-center">
              Ver todas <ArrowRight className="ml-1 w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50 flex-1 overflow-y-auto">
            {ultimasSolicitacoes?.length === 0 ? (
              <div className="p-8 text-center text-[#6B7280] text-sm font-medium">Nenhuma solicitação recente.</div>
            ) : (
              ultimasSolicitacoes?.map((solic) => (
                <Link href={`/admin/solicitacoes/${solic.id}`} key={solic.id} className="p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors group">
                  <div>
                    <p className="text-sm font-bold text-[#2F3437] flex items-center gap-2">
                      {solic.nome_completo}
                      {solic.e_urgente && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-wider">Urgente</span>}
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">{solic.tipo_profissional}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={solic.status} />
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#8ECADF] transition-colors" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Plantões Hoje */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#FAFAF7] rounded-t-2xl">
            <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-[#A8D5BA]" /> Plantões de Hoje
            </h2>
          </div>
          
          <div className="p-5 flex-1 overflow-y-auto space-y-3">
            {plantoesHoje?.length === 0 ? (
              <div className="p-8 text-center text-[#6B7280] text-sm font-medium">Nenhum plantão agendado para hoje.</div>
            ) : (
              plantoesHoje?.map(p => (
                <div key={p.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-[#2F3437]">{p.horario_inicio} <span className="font-medium text-[#6B7280]">({p.duracao})</span></p>
                    <p className="text-xs font-medium text-[#6B7280] mt-1">{p.familia_nome} • {p.profissional_nome}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Plantões Amanhã */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#FAFAF7] rounded-t-2xl">
            <h2 className="text-sm font-bold text-[#6B7280] uppercase tracking-wider flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-[#E8DCC8]" /> Plantões de Amanhã
            </h2>
          </div>
          
          <div className="p-5 flex-1 overflow-y-auto space-y-3">
            {plantoesAmanha?.length === 0 ? (
              <div className="p-8 text-center text-[#6B7280] text-sm font-medium">Nenhum plantão agendado para amanhã.</div>
            ) : (
              plantoesAmanha?.map(p => (
                <div key={p.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-[#2F3437]">{p.horario_inicio} <span className="font-medium text-[#6B7280]">({p.duracao})</span></p>
                    <p className="text-xs font-medium text-[#6B7280] mt-1">{p.familia_nome} • {p.profissional_nome}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
