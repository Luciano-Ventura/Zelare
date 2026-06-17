"use client";

import { useState } from "react";
import { AlertTriangle, X, ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function OcorrenciasTable({ ocorrencias }: { ocorrencias: any[] }) {
  const [selectedPlantao, setSelectedPlantao] = useState<any | null>(null);
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
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <select 
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={searchParams.get("gravidade") || ""}
          onChange={(e) => handleFilterChange("gravidade", e.target.value)}
        >
          <option value="">Todas as Gravidades</option>
          <option value="Baixa">Baixa</option>
          <option value="Média">Média</option>
          <option value="Alta">Alta</option>
          <option value="Crítica">Crítica</option>
        </select>
        
        <select 
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={searchParams.get("status") || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">Todos os Status</option>
          <option value="Aberta">Aberta</option>
          <option value="Em análise">Em análise</option>
          <option value="Resolvida">Resolvida</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Tipo / Gravidade</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Descrição</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Plantão</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Data</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Responsável</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ocorrencias.map((oc) => (
                <tr key={oc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {oc.gravidade === "Alta" || oc.gravidade === "Crítica" ? (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      ) : null}
                      <span className="text-sm font-medium text-text-main">{oc.tipo_ocorrencia}</span>
                    </div>
                    <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-md font-semibold ${
                      oc.gravidade === "Baixa" ? "bg-green-100 text-green-700" :
                      oc.gravidade === "Média" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {oc.gravidade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-secondary max-w-md truncate" title={oc.descricao}>{oc.descricao}</div>
                  </td>
                  <td className="px-6 py-4">
                    {oc.plantoes ? (
                      <button 
                        onClick={() => setSelectedPlantao(oc.plantoes)}
                        className="text-xs text-blue-600 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                      >
                        Ver Plantão
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Sem plantão</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {new Date(oc.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    {oc.responsavel || "Não atribuído"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={oc.status} />
                  </td>
                </tr>
              ))}
              
              {ocorrencias.length === 0 && (
                <EmptyState message="Nenhuma ocorrência encontrada com os filtros atuais." colSpan={6} />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes do Plantão */}
      {selectedPlantao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-900">Resumo do Plantão</h3>
              <button onClick={() => setSelectedPlantao(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Família</div>
                  <div className="font-bold text-gray-900">{selectedPlantao.familia_nome || "N/A"}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Profissional</div>
                  <div className="font-bold text-gray-900">{selectedPlantao.profissional_nome || "N/A"}</div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 font-medium">Data:</span>
                    <p className="font-bold text-gray-900">{selectedPlantao.data_plantao || "Não definida"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Horário:</span>
                    <p className="font-bold text-gray-900">{selectedPlantao.horario_inicio} - {selectedPlantao.horario_fim}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Status Operacional:</span>
                    <div className="mt-1"><StatusBadge status={selectedPlantao.status || "N/A"} /></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedPlantao(null)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Fechar Resumo
              </button>
              <button 
                onClick={() => {
                  alert("Esta ação levará para a página completa do plantão no futuro.");
                  setSelectedPlantao(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                Abrir Detalhes Completos <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
