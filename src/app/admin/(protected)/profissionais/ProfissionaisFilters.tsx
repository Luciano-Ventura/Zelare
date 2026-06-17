"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ProfissionaisFilters() {
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
        <option value="validacao">Em Validação (Novos/Análise)</option>
        <option value="Novo cadastro">Novo cadastro</option>
        <option value="Em análise">Em análise</option>
        <option value="Aguardando informações">Aguardando informações</option>
        <option value="Validado">Validado</option>
        <option value="Disponível">Disponível</option>
        <option value="Ativo">Ativo</option>
        <option value="Inativo">Inativo</option>
        <option value="Bloqueado">Bloqueado</option>
        <option value="Reprovado">Reprovado</option>
      </select>

      <input 
        type="text" 
        placeholder="Cidade..." 
        value={searchParams.get("cidade") || ""}
        onChange={(e) => handleFilterChange("cidade", e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-32"
      />

      <select 
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={searchParams.get("categoria") || ""}
        onChange={(e) => handleFilterChange("categoria", e.target.value)}
      >
        <option value="">Todas as Categorias</option>
        <option value="Cuidador(a) de Idosos">Cuidador(a) de Idosos</option>
        <option value="Técnico(a) em Enfermagem">Técnico(a) em Enfermagem</option>
        <option value="Enfermeiro(a)">Enfermeiro(a)</option>
      </select>
    </div>
  );
}
