import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SearchInput } from "@/components/admin/SearchInput";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { EmptyState } from "@/components/admin/EmptyState";
import { SolicitacoesFilters } from "./SolicitacoesFilters";
import { sortSolicitacoes } from "@/lib/sortPriority";

export const revalidate = 0;

export default async function SolicitacoesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;

  const status = typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : null;
  const busca = typeof resolvedSearchParams.busca === "string" ? resolvedSearchParams.busca : null;
  const urgencia = typeof resolvedSearchParams.urgencia === "string" ? resolvedSearchParams.urgencia : null;
  
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page, 10) : 1;
  const pageSize = typeof resolvedSearchParams.pageSize === "string" ? parseInt(resolvedSearchParams.pageSize, 10) : 20;

  let query = supabaseAdmin
    .from("familias_solicitacoes")
    .select("id, nome_completo, cidade, bairro, tipo_profissional, data_desejada, e_urgente, status, created_at", { count: 'exact' });

  if (status) query = query.eq("status", status);
  if (busca) query = query.ilike("nome_completo", `%${busca}%`);
  if (urgencia === "true") query = query.eq("e_urgente", true);
  if (urgencia === "false") query = query.eq("e_urgente", false);

  const { data: allFiltrados, count } = await query;
  let solicitacoes = allFiltrados || [];

  if (solicitacoes.length > 0) {
    solicitacoes = sortSolicitacoes(solicitacoes);
    solicitacoes = solicitacoes.slice((page - 1) * pageSize, page * pageSize);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Solicitações de Famílias</h1>
        <SearchInput placeholder="Buscar família..." paramName="busca" />
      </div>

      <SolicitacoesFilters />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Família
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Localização
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Demanda
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="relative px-6 py-4">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {solicitacoes?.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-main">{s.nome_completo}</span>
                      <span className="text-xs text-text-secondary">
                        {new Date(s.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-main">{s.cidade}</div>
                    <div className="text-xs text-text-secondary">{s.bairro}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-sm text-text-main">{s.tipo_profissional}</span>
                      {s.e_urgente && (
                        <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wide">
                          Urgente
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/solicitacoes/${s.id}`} prefetch={false} className="text-blue-light hover:text-blue-dark">
                      Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
              
              {(!solicitacoes || solicitacoes.length === 0) && (
                <EmptyState message="Nenhuma solicitação encontrada com os filtros atuais." />
              )}
            </tbody>
          </table>
        </div>
        
        {count !== null && count > 0 && (
          <PaginationControls totalItems={count} pageSize={pageSize} />
        )}
      </div>
    </div>
  );
}
