"use client";

import { useState } from "react";
import { Plus, X, AlertTriangle } from "lucide-react";
import { createOcorrencia } from "@/app/admin/(protected)/ocorrencias/actions";

export function AddOcorrenciaAdminModal({
  solicitacaoId,
  plantaoId,
  profissionalId
}: {
  solicitacaoId: string;
  plantaoId?: string;
  profissionalId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [tipoOcorrencia, setTipoOcorrencia] = useState("Atraso");
  const [gravidade, setGravidade] = useState("Média");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const res = await createOcorrencia({
      tipo_ocorrencia: tipoOcorrencia,
      gravidade,
      descricao,
      solicitacao_id: solicitacaoId,
      plantao_id: plantaoId,
      profissional_id: profissionalId,
      aberta_por: "Admin (Operador)",
    });

    setIsPending(false);

    if (res.success) {
      setIsOpen(false);
      setDescricao("");
    } else {
      alert("Erro ao registrar ocorrência: " + res.error);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
      >
        <Plus className="w-3 h-3" /> Registrar Ocorrência
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-red-50">
              <h3 className="font-bold text-lg text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Nova Ocorrência Interna
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tipo de Ocorrência</label>
                <select 
                  value={tipoOcorrencia} 
                  onChange={e => setTipoOcorrencia(e.target.value)}
                  className="w-full text-sm border-gray-200 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="Atraso">Atraso do Profissional</option>
                  <option value="Falta">Falta do Profissional</option>
                  <option value="Desentendimento">Desentendimento</option>
                  <option value="Problema Financeiro">Problema Financeiro</option>
                  <option value="Sinal de Alerta">Sinal de Alerta (Saúde)</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Gravidade</label>
                <select 
                  value={gravidade} 
                  onChange={e => setGravidade(e.target.value)}
                  className="w-full text-sm border-gray-200 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                  <option value="Crítica">Crítica</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Descrição</label>
                <textarea 
                  value={descricao}
                  onChange={e => setDescricao(e.target.value)}
                  rows={4} 
                  required 
                  placeholder="Descreva detalhadamente a ocorrência..."
                  className="w-full text-sm border-gray-200 rounded-lg p-2.5 focus:ring-red-500 focus:border-red-500"
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isPending}
                  className="flex-1 px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Salvando..." : "Salvar Ocorrência"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
