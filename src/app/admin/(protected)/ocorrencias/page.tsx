import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { OcorrenciasTable } from "./OcorrenciasTable";
import { SearchInput } from "@/components/admin/SearchInput";
import { PaginationControls } from "@/components/admin/PaginationControls";
import { sortOcorrencias } from "@/lib/sortPriority";

export const revalidate = 0;

export default async function OcorrenciasPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;

  const gravidade = typeof resolvedSearchParams.gravidade === "string" ? resolvedSearchParams.gravidade : null;
  const status = typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : null;
  const busca = typeof resolvedSearchParams.busca === "string" ? resolvedSearchParams.busca : null;
  const periodo = typeof resolvedSearchParams.periodo === "string" ? resolvedSearchParams.periodo : null;
  
  const page = typeof resolvedSearchParams.page === "string" ? parseInt(resolvedSearchParams.page, 10) : 1;
  const pageSize = typeof resolvedSearchParams.pageSize === "string" ? parseInt(resolvedSearchParams.pageSize, 10) : 20;

  // 1. Iniciar query
  let query = supabaseAdmin
    .from("ocorrencias")
    .select("*, plantoes(familia_nome, profissional_nome, data_plantao, horario_inicio, horario_fim, status)", { count: 'exact' });

  // 2. Aplicar filtros backend
  if (gravidade) query = query.eq("gravidade", gravidade);
  if (status) query = query.eq("status", status);
  if (busca) query = query.ilike("descricao", `%${busca}%`); // Busca por descrição na ocorrência
  if (periodo) {
    const startOfDay = new Date(periodo);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(periodo);
    endOfDay.setHours(23, 59, 59, 999);
    query = query.gte("created_at", startOfDay.toISOString()).lte("created_at", endOfDay.toISOString());
  }

  // 3. Executar a busca de todos para depois ordenar e paginar em memória (ou range se der)
  // Como temos prioridades complexas, buscamos filtrado e depois ordenamos e fatiamos
  // Idealmente, se a base fosse gigante, a ordenação no Supabase precisaria de Functions.
  // Para manter o projeto rápido com Supabase nativo, vamos usar range na query, mas 
  // para o sortPriority precisamos dos dados ou pelo menos fazer um order by múltiplo no supabase se possível.
  // No Supabase não dá pra ordernar por Enum facilmente sem DB functions.
  // A instrução permitiu usar sortPriority para ordenar os itens obtidos.
  // Se buscarmos com range, não garantimos a ordem global. Mas seguindo a instrução:
  
  const { data: allFiltrados, count } = await query;
  let ocorrencias = allFiltrados || [];

  if (ocorrencias.length > 0) {
    ocorrencias = sortOcorrencias(ocorrencias);
    // Slice manual para a página atual
    ocorrencias = ocorrencias.slice((page - 1) * pageSize, page * pageSize);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Ocorrências</h1>
        <SearchInput placeholder="Buscar por descrição..." paramName="busca" />
      </div>

      <OcorrenciasTable ocorrencias={ocorrencias} />
      
      {count !== null && count > 0 && (
        <PaginationControls totalItems={count} pageSize={pageSize} />
      )}
    </div>
  );
}

