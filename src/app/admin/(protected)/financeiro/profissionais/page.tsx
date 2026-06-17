import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { RefreshCcw } from "lucide-react";
import { FinancialActionButtons } from "../FinancialActionButtons";
import { SearchInput } from "@/components/admin/SearchInput";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { EmptyState } from "@/components/admin/EmptyState";
import { FinanceiroProfissionaisFilters } from "./FinanceiroProfissionaisFilters";
import { sortRepasses } from "@/lib/sortPriority";

export const revalidate = 0;

export default async function FinanceiroProfissionaisPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;

  const status_repasse = typeof resolvedSearchParams.status_repasse === "string" ? resolvedSearchParams.status_repasse : null;
  const busca = typeof resolvedSearchParams.busca === "string" ? resolvedSearchParams.busca : null;
  
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page, 10) : 1;
  const pageSize = typeof resolvedSearchParams.pageSize === "string" ? parseInt(resolvedSearchParams.pageSize, 10) : 20;

  // Calculos de cards com query global
  const { data: todosRepasses } = await supabaseAdmin.from("repasses_profissionais").select("valor_profissional, status_repasse");

  let valorARepassar = 0;
  let repassesRealizados = 0;
  let repassesPendentesCount = 0;

  todosRepasses?.forEach(r => {
    if (r.status_repasse === "Repassado") {
      repassesRealizados += Number(r.valor_profissional || 0);
    } else if (r.status_repasse === "Pronto para repasse") {
      valorARepassar += Number(r.valor_profissional || 0);
      repassesPendentesCount++;
    }
  });

  // Query paginada
  let query = supabaseAdmin
    .from("repasses_profissionais")
    .select("*, plantoes(data_plantao, horario_inicio, duracao, taxa_zelare, total_familia, margem_percentual, pricing_id, adicionais_aplicados)", { count: 'exact' });

  if (status_repasse) query = query.eq("status_repasse", status_repasse);
  if (busca) query = query.ilike("profissional_nome", `%${busca}%`);

  const { data: allFiltrados, count } = await query;
  let repasses = allFiltrados || [];

  if (repasses.length > 0) {
    repasses = sortRepasses(repasses);
    repasses = repasses.slice((page - 1) * pageSize, page * pageSize);
  }

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2F3437] tracking-tight">Repasses a Profissionais</h1>
          <p className="text-sm text-[#6B7280] mt-1">Gerencie os pagamentos e envio de Pix para os cuidadores.</p>
        </div>
        <SearchInput placeholder="Buscar por profissional..." paramName="busca" />
      </div>

      <FinanceiroProfissionaisFilters />

      {/* Cards Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Repasses Pendentes</h2>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><RefreshCcw className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-purple-700">{repassesPendentesCount} <span className="text-sm font-medium text-purple-800">prontos p/ repasse</span></p>
          <p className="text-xs text-purple-700 font-bold mt-2">Valor Total a Pagar: {formatter.format(valorARepassar)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Total Repassado</h2>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><RefreshCcw className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-green-700">{formatter.format(repassesRealizados)}</p>
          <p className="text-xs text-green-700 font-bold mt-2">Acumulado já pago aos profissionais</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Tabela de Repasses Aos Profissionais */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#FAFAF7]">
            <h2 className="text-sm font-bold text-[#2F3437] uppercase tracking-wider flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-purple-600" /> Fila de Repasses
            </h2>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Profissional / Plantão</th>
                  <th className="px-4 py-3">Detalhes Financeiros</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {repasses?.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#2F3437]">{r.profissional_nome}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{r.plantoes?.data_plantao} às {r.plantoes?.horario_inicio}</div>
                      {r.profissional_pix && <div className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 mt-1 inline-block w-auto">{r.profissional_pix}</div>}
                    </td>
                    <td className="px-4 py-3">
                       <div className="flex flex-col gap-0.5 text-xs">
                         <span className="font-bold text-green-700">Repasse: R$ {r.valor_profissional}</span>
                         <span className="text-gray-500">Taxa Zelare: R$ {r.plantoes?.taxa_zelare}</span>
                         <span className="text-gray-500 font-bold">Cobrado Família: R$ {r.plantoes?.total_familia}</span>
                         {r.plantoes?.margem_percentual && (
                           <span className="text-[10px] mt-1 inline-block bg-blue-50 text-blue-800 px-2 rounded-full font-bold w-max border border-blue-200">
                             Margem: {r.plantoes.margem_percentual}%
                           </span>
                         )}
                         {r.plantoes?.pricing_id && (
                           <span className="text-[9px] uppercase tracking-wider text-gray-400 mt-0.5">Preço Dinâmico</span>
                         )}
                       </div>
                    </td>
                    <td className="px-4 py-3">
                      {r.status_repasse === "Repassado" ? (
                         <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Repassado</span>
                      ) : r.status_repasse === "Pronto para repasse" ? (
                         <span className="px-2 py-1 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Aguardando Execução</span>
                      ) : (
                         <span className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold rounded-full uppercase tracking-wider">{r.status_repasse}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <FinancialActionButtons type="repasse" id={r.id} status={r.status_repasse} />
                    </td>
                  </tr>
                ))}
                
                {(!repasses || repasses.length === 0) && (
                  <EmptyState message="Nenhum repasse pendente encontrado." colSpan={4} />
                )}
              </tbody>
            </table>
          </div>
          
          {count !== null && count > 0 && (
            <PaginationControls totalItems={count} pageSize={pageSize} />
          )}
        </div>

      </div>
    </div>
  );
}
