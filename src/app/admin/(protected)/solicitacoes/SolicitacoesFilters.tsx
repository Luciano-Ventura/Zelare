"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SolicitacoesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mt-4">
      <select 
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={searchParams.get("status") || ""}
        onChange={(e) => handleFilterChange("status", e.target.value)}
      >
        <option value="">Todos os Status</option>
        <option value="Novo pedido">Novo pedido</option>
        <option value="Aguardando informações">Aguardando informações</option>
        <option value="Procurando profissional">Procurando profissional</option>
        <option value="Aguardando pagamento">Aguardando pagamento</option>
        <option value="Confirmado">Confirmado</option>
        <option value="Em andamento">Em andamento</option>
        <option value="Concluído">Concluído</option>
        <option value="Cancelado">Cancelado</option>
        <option value="Perdido">Perdido</option>
        <option value="Sem profissional disponível">Sem profissional disponível</option>
      </select>

      <select 
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={searchParams.get("urgencia") || ""}
        onChange={(e) => handleFilterChange("urgencia", e.target.value)}
      >
        <option value="">Todas as Urgências</option>
        <option value="true">Apenas Urgentes</option>
        <option value="false">Normais</option>
      </select>
    </div>
  );
}
