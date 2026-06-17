import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { SearchInput } from "@/components/admin/SearchInput";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { EmptyState } from "@/components/admin/EmptyState";
import { ProfissionaisFilters } from "./ProfissionaisFilters";
import { sortProfissionais } from "@/lib/sortPriority";

export const revalidate = 0;

export default async function ProfissionaisPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;

  const statusParam = typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : null;
  const busca = typeof resolvedSearchParams.busca === "string" ? resolvedSearchParams.busca : null;
  const cidade = typeof resolvedSearchParams.cidade === "string" ? resolvedSearchParams.cidade : null;
  const categoria = typeof resolvedSearchParams.categoria === "string" ? resolvedSearchParams.categoria : null;
  
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page, 10) : 1;
  const pageSize = typeof resolvedSearchParams.pageSize === "string" ? parseInt(resolvedSearchParams.pageSize, 10) : 20;

  let query = supabaseAdmin
    .from("profissionais_cadastros")
    .select("id, nome_completo, cidade, bairro, categoria_profissional, status, created_at", { count: 'exact' });

  if (statusParam === "validacao") {
    query = query.in("status", ["Novo cadastro", "Em análise", "Aguardando informações"]);
  } else if (statusParam) {
    query = query.eq("status", statusParam);
  }

  if (busca) query = query.ilike("nome_completo", `%${busca}%`);
  if (cidade) query = query.ilike("cidade", `%${cidade}%`);
  if (categoria) query = query.eq("categoria_profissional", categoria);

  const { data: allFiltrados, count } = await query;
  let profissionais = allFiltrados || [];

  if (profissionais.length > 0) {
    profissionais = sortProfissionais(profissionais);
    profissionais = profissionais.slice((page - 1) * pageSize, page * pageSize);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Profissionais Cadastrados</h1>
        <SearchInput placeholder="Buscar por nome..." paramName="busca" />
      </div>

      <ProfissionaisFilters />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Profissional
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Localização
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Categoria
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
              {profissionais?.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-text-main">{p.nome_completo}</span>
                      <span className="text-xs text-text-secondary">
                        {new Date(p.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-main">{p.cidade}</div>
                    <div className="text-xs text-text-secondary">{p.bairro}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-main">{p.categoria_profissional}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/admin/profissionais/${p.id}`} className="text-blue-light hover:text-blue-dark">
                      Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
              
              {(!profissionais || profissionais.length === 0) && (
                <EmptyState message="Nenhum profissional encontrado com os filtros atuais." />
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
