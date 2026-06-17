"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function FinanceiroFamiliasFilters() {
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
        value={searchParams.get("status_pagamento") || ""}
        onChange={(e) => handleFilterChange("status_pagamento", e.target.value)}
      >
        <option value="">Todos os Status de Pagamento</option>
        <option value="Aguardando pagamento">Aguardando pagamento</option>
        <option value="Pago">Pago</option>
        <option value="Falhou">Falhou</option>
        <option value="Cancelado">Cancelado</option>
        <option value="Reembolsado">Reembolsado</option>
      </select>

      <select 
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={searchParams.get("metodo") || ""}
        onChange={(e) => handleFilterChange("metodo", e.target.value)}
      >
        <option value="">Todos os Métodos</option>
        <option value="PIX">PIX</option>
        <option value="Boleto">Boleto</option>
        <option value="Cartão de Crédito">Cartão de Crédito</option>
      </select>
    </div>
  );
}
