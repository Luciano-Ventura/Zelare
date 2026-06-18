import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { BarChart3, TrendingUp, Users, CalendarDays, DollarSign } from "lucide-react";
import { FaturamentoChart, PlantoesChart } from "./RelatoriosCharts";

export const revalidate = 0;

export default async function RelatoriosPage() {
  await requireAdmin();

  // Buscar dados consolidados
  const [
    { count: totalFamilias },
    { count: totalProfissionais },
    { data: plantoes },
    { data: pagamentos }
  ] = await Promise.all([
    supabaseAdmin.from("familias_solicitacoes").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("profissionais_cadastros").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("plantoes").select("id, status, total_familia, taxa_zelare, created_at"),
    supabaseAdmin.from("pagamentos").select("total_familia, taxa_zelare, status_pagamento, pago_em, created_at")
  ]);

  const totalPlantoes = plantoes?.length || 0;
  const plantoesConcluidos = plantoes?.filter(p => p.status === "Concluído" || p.status === "Confirmado").length || 0;
  const taxaConclusao = totalPlantoes > 0 ? Math.round((plantoesConcluidos / totalPlantoes) * 100) : 0;

  // Calculos Financeiros Baseados em Pagamentos Realizados
  let receitaTotalZelare = 0;
  let faturamentoTotal = 0;

  // Real data arrays
  const monthlyFaturamento: Record<string, { faturamento: number, receita: number }> = {};
  const dailyPlantoes: Record<string, number> = {};

  // Setup last 6 months
  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const currentMonth = new Date().getMonth();
  for (let i = 5; i >= 0; i--) {
    let m = currentMonth - i;
    if (m < 0) m += 12;
    monthlyFaturamento[monthNames[m]] = { faturamento: 0, receita: 0 };
  }

  // Setup last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    dailyPlantoes[dayStr] = 0;
  }

  pagamentos?.forEach(p => {
    if (p.status_pagamento === "Pago") {
      const fat = Number(p.total_familia || 0);
      const rec = Number(p.taxa_zelare || 0);
      faturamentoTotal += fat;
      receitaTotalZelare += rec;
      
      const date = p.pago_em ? new Date(p.pago_em) : (p.created_at ? new Date(p.created_at) : new Date());
      const mName = monthNames[date.getMonth()];
      if (monthlyFaturamento[mName]) {
        monthlyFaturamento[mName].faturamento += fat;
        monthlyFaturamento[mName].receita += rec;
      }
    }
  });

  plantoes?.forEach(p => {
    const date = p.created_at ? new Date(p.created_at) : new Date();
    const dayStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    if (dailyPlantoes[dayStr] !== undefined) {
      dailyPlantoes[dayStr] += 1;
    }
  });

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  const faturamentoData = Object.keys(monthlyFaturamento).map(name => ({
    name,
    faturamento: monthlyFaturamento[name].faturamento,
    receita: monthlyFaturamento[name].receita
  }));

  const plantoesData = Object.keys(dailyPlantoes).map(date => ({
    date,
    plantoes: dailyPlantoes[date]
  }));

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2F3437] tracking-tight">Relatórios e Gráficos</h1>
          <p className="text-sm text-text-secondary mt-1">Visão analítica e consolidada de toda a operação.</p>
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Faturamento Total</h2>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-[#2F3437]">{formatter.format(faturamentoTotal)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Receita Zelare</h2>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-blue-600">{formatter.format(receitaTotalZelare)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Total de Plantões</h2>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><CalendarDays className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-[#2F3437]">{totalPlantoes}</p>
          <p className="text-xs text-purple-700 font-bold mt-2">Taxa de conclusão: {taxaConclusao}%</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Base de Usuários</h2>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Users className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-[#2F3437]">{totalFamilias} <span className="text-sm font-medium text-gray-500">famílias</span></p>
          <p className="text-xs text-orange-700 font-bold mt-2">{totalProfissionais} profissionais cadastrados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gráfico de Faturamento */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#FAFAF7] flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#2F3437] uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" /> Faturamento vs Receita (Mensal)
            </h2>
            <div className="flex gap-3 text-xs font-bold">
              <span className="flex items-center gap-1 text-gray-500"><div className="w-2 h-2 rounded-full bg-[#8ECADF]"></div>Faturamento</span>
              <span className="flex items-center gap-1 text-gray-500"><div className="w-2 h-2 rounded-full bg-[#A8D5BA]"></div>Receita</span>
            </div>
          </div>
          <div className="p-6">
            <FaturamentoChart data={faturamentoData} />
          </div>
        </div>

        {/* Gráfico de Evolução de Plantões */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#FAFAF7]">
            <h2 className="text-sm font-bold text-[#2F3437] uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" /> Evolução de Plantões Diários
            </h2>
          </div>
          <div className="p-6">
            <PlantoesChart data={plantoesData} />
          </div>
        </div>

      </div>
    </div>
  );
}
