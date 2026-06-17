import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Wallet, DollarSign, AlertCircle } from "lucide-react";
import { FinancialActionButtons } from "../FinancialActionButtons";
import { SearchInput } from "@/components/admin/SearchInput";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { EmptyState } from "@/components/admin/EmptyState";
import { FinanceiroFamiliasFilters } from "./FinanceiroFamiliasFilters";
import { sortPagamentos } from "@/lib/sortPriority";

export const revalidate = 0;

export default async function FinanceiroFamiliasPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;

  const status_pagamento = typeof resolvedSearchParams.status_pagamento === "string" ? resolvedSearchParams.status_pagamento : null;
  const metodo = typeof resolvedSearchParams.metodo === "string" ? resolvedSearchParams.metodo : null;
  const busca = typeof resolvedSearchParams.busca === "string" ? resolvedSearchParams.busca : null;
  
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page, 10) : 1;
  const pageSize = typeof resolvedSearchParams.pageSize === "string" ? parseInt(resolvedSearchParams.pageSize, 10) : 20;

  // Calculos de cards com query separada para pegar totais globais
  const { data: todosPagamentos } = await supabaseAdmin.from("pagamentos").select("total_familia, taxa_zelare, status_pagamento");

  let totalRecebido = 0;
  let receitaZelare = 0;
  let pagamentosPendentesCount = 0;
  let pagamentosRealizadosCount = 0;

  todosPagamentos?.forEach(p => {
    if (p.status_pagamento === "Pago") {
      totalRecebido += Number(p.total_familia || 0);
      receitaZelare += Number(p.taxa_zelare || 0);
      pagamentosRealizadosCount++;
    } else if (p.status_pagamento === "Aguardando pagamento") {
      pagamentosPendentesCount++;
    }
  });

  // Query paginada
  let query = supabaseAdmin
    .from("pagamentos")
    .select("*, plantoes(data_plantao, horario_inicio, duracao)", { count: 'exact' });

  if (status_pagamento) query = query.eq("status_pagamento", status_pagamento);
  if (metodo) query = query.eq("metodo_pagamento", metodo);
  if (busca) query = query.ilike("familia_nome", `%${busca}%`);

  const { data: allFiltrados, count } = await query;
  let pagamentos = allFiltrados || [];

  if (pagamentos.length > 0) {
    pagamentos = sortPagamentos(pagamentos);
    pagamentos = pagamentos.slice((page - 1) * pageSize, page * pageSize);
  }

  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#2F3437] tracking-tight">Financeiro: Famílias</h1>
          <p className="text-sm text-[#6B7280] mt-1">Gerencie as cobranças e pagamentos realizados pelas famílias.</p>
        </div>
        <SearchInput placeholder="Buscar por família..." paramName="busca" />
      </div>

      <FinanceiroFamiliasFilters />

      {/* Cards Financeiros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Total Recebido (Pago)</h2>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Wallet className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-[#2F3437]">{formatter.format(totalRecebido)}</p>
          <p className="text-xs text-green-700 font-bold mt-2">{pagamentosRealizadosCount} plantões pagos</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Receita Zelare (Taxas)</h2>
            <div className="p-2 bg-[#8ECADF]/20 text-[#2F3437] rounded-lg"><DollarSign className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-[#8ECADF]">{formatter.format(receitaZelare)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 flex flex-col justify-center relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Aguardando Pagamento</h2>
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><AlertCircle className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-black text-orange-600">{pagamentosPendentesCount} <span className="text-sm font-medium text-orange-800">pendentes</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Tabela de Pagamentos das Famílias */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 bg-[#FAFAF7]">
            <h2 className="text-sm font-bold text-[#2F3437] uppercase tracking-wider flex items-center gap-2">
              <Wallet className="w-4 h-4 text-orange-500" /> Histórico de Cobranças
            </h2>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Família / Plantão</th>
                  <th className="px-4 py-3">Valor Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pagamentos?.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="font-bold text-[#2F3437]">{p.familia_nome}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{p.plantoes?.data_plantao} às {p.plantoes?.horario_inicio}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-700">R$ {p.total_familia}</td>
                    <td className="px-4 py-3">
                      {p.status_pagamento === "Pago" ? (
                         <span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Pago</span>
                      ) : p.status_pagamento === "Aguardando pagamento" ? (
                         <span className="px-2 py-1 bg-orange-100 text-orange-800 text-[10px] font-bold rounded-full uppercase tracking-wider">Pendente</span>
                      ) : (
                         <span className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold rounded-full uppercase tracking-wider">{p.status_pagamento}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <FinancialActionButtons type="pagamento" id={p.id} status={p.status_pagamento} linkPagamento={p.link_pagamento} plantaoId={p.plantao_id} solicitacaoId={p.solicitacao_id} pacoteId={p.pacote_id} />
                    </td>
                  </tr>
                ))}
                
                {(!pagamentos || pagamentos.length === 0) && (
                  <EmptyState message="Nenhum pagamento pendente encontrado." colSpan={4} />
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
