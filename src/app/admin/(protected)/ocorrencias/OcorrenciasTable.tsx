"use client";

import { useState } from "react";
import { AlertTriangle, X, ExternalLink, Plus, Edit } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { createOcorrencia, updateOcorrencia } from "./actions";

export function OcorrenciasTable({ ocorrencias }: { ocorrencias: any[] }) {
  const [selectedPlantao, setSelectedPlantao] = useState<any | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [updateModalData, setUpdateModalData] = useState<any | null>(null);
  
  const [isPending, setIsPending] = useState(false);

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

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const fd = new FormData(e.currentTarget);
    const res = await createOcorrencia({
      tipo_ocorrencia: fd.get("tipo_ocorrencia") as string,
      gravidade: fd.get("gravidade") as string,
      descricao: fd.get("descricao") as string,
      responsavel: fd.get("responsavel") as string,
    });
    setIsPending(false);
    if (res.success) {
      setIsCreateOpen(false);
    } else {
      alert("Erro ao criar ocorrência: " + res.error);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const fd = new FormData(e.currentTarget);
    const res = await updateOcorrencia(updateModalData.id, {
      status: fd.get("status") as string,
      resolucao: fd.get("resolucao") as string,
      responsavel_interno: fd.get("responsavel_interno") as string,
    });
    setIsPending(false);
    if (res.success) {
      setUpdateModalData(null);
    } else {
      alert("Erro ao atualizar ocorrência: " + res.error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros e Ações */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-4">
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
            <option value="Arquivada">Arquivada</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          <input 
            type="date"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchParams.get("periodo") || ""}
            onChange={(e) => handleFilterChange("periodo", e.target.value)}
            title="Filtrar por data"
          />
        </div>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Registrar Nova
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Tipo / Gravidade</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Descrição</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Plantão</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Data & Resp. Interno</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase">Status & Resolução</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-text-secondary uppercase">Ações</th>
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
                    <div className="text-sm text-text-secondary max-w-xs break-words" title={oc.descricao}>{oc.descricao}</div>
                    {oc.aberta_por && (
                      <div className="text-xs font-semibold text-gray-500 mt-1">Aberta por: <span className="text-gray-700">{oc.aberta_por}</span></div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {oc.plantoes ? (
                      <button 
                        onClick={() => setSelectedPlantao({ ...oc.plantoes, id: oc.plantao_id })}
                        className="text-xs text-blue-600 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                      >
                        Ver Plantão
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Sem plantão</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    <div>{new Date(oc.created_at).toLocaleDateString('pt-BR')}</div>
                    <div className="mt-1 font-medium text-text-main">{oc.responsavel_interno || "Não atribuído"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={oc.status} />
                    {oc.resolvido_em && (
                      <div className="text-xs text-gray-500 mt-1">Resolvido: {new Date(oc.resolvido_em).toLocaleDateString('pt-BR')}</div>
                    )}
                    {oc.resolucao && (
                      <div className="text-xs text-gray-600 mt-1 max-w-xs truncate" title={oc.resolucao}>Resolução: {oc.resolucao}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => setUpdateModalData(oc)}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-2"
                      title="Atualizar Status"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
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
                Fechar
              </button>
              <button 
                onClick={() => {
                  router.push(`/admin/solicitacoes/${selectedPlantao.id}`);
                  setSelectedPlantao(null);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                Detalhes Completos <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">Registrar Ocorrência</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Ocorrência</label>
                <select name="tipo_ocorrencia" required className="w-full border-gray-300 rounded-md border p-2">
                  <option value="Atraso">Atraso</option>
                  <option value="Profissional não compareceu">Profissional não compareceu</option>
                  <option value="Família não estava no local">Família não estava no local</option>
                  <option value="Mudança no combinado">Mudança no combinado</option>
                  <option value="Conflito com familiar">Conflito com familiar</option>
                  <option value="Queda">Queda</option>
                  <option value="Mal-estar">Mal-estar</option>
                  <option value="Problema financeiro">Problema financeiro</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gravidade</label>
                <select name="gravidade" required className="w-full border-gray-300 rounded-md border p-2">
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                  <option value="Crítica">Crítica</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea name="descricao" required rows={3} className="w-full border-gray-300 rounded-md border p-2"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Envolvido (Opcional)</label>
                <input name="responsavel" type="text" className="w-full border-gray-300 rounded-md border p-2" placeholder="Nome do profissional ou familiar" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-sm text-gray-600">Cancelar</button>
                <button type="submit" disabled={isPending} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50">
                  {isPending ? "Salvando..." : "Registrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Atualização */}
      {updateModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-900">Atualizar Ocorrência</h3>
              <button onClick={() => setUpdateModalData(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" defaultValue={updateModalData.status} className="w-full border-gray-300 rounded-md border p-2">
                  <option value="Aberta">Aberta</option>
                  <option value="Em análise">Em análise</option>
                  <option value="Resolvida">Resolvida</option>
                  <option value="Arquivada">Arquivada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsável Interno</label>
                <input name="responsavel_interno" defaultValue={updateModalData.responsavel_interno} type="text" className="w-full border-gray-300 rounded-md border p-2" placeholder="Ex: João (Suporte)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolução / Parecer</label>
                <textarea name="resolucao" defaultValue={updateModalData.resolucao} rows={3} className="w-full border-gray-300 rounded-md border p-2" placeholder="Descreva como foi resolvido..."></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setUpdateModalData(null)} className="px-4 py-2 text-sm text-gray-600">Cancelar</button>
                <button type="submit" disabled={isPending} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50">
                  {isPending ? "Atualizando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
