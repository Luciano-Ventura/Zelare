"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FinanceiroProfissionaisFilters() {
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
        value={searchParams.get("status_repasse") || ""}
        onChange={(e) => handleFilterChange("status_repasse", e.target.value)}
      >
        <option value="">Todos os Status de Repasse</option>
        <option value="Aguardando conclusão">Aguardando conclusão</option>
        <option value="Aguardando liberação">Aguardando liberação</option>
        <option value="Pronto para repasse">Pronto para repasse</option>
        <option value="Repassado">Repassado</option>
        <option value="Bloqueado">Bloqueado</option>
        <option value="Cancelado">Cancelado</option>
      </select>
    </div>
  );
}
