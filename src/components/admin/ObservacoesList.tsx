"use client";

import { useState } from "react";
import { addObservacaoInterna } from "@/app/admin/crm-actions";
import { Loader2, Plus, Clock } from "lucide-react";

export function ObservacoesList({ 
  entidadeTipo, 
  entidadeId, 
  observacoes 
}: { 
  entidadeTipo: string, 
  entidadeId: string, 
  observacoes: any[] 
}) {
  const [isPending, setIsPending] = useState(false);
  const [novaObs, setNovaObs] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!novaObs.trim()) return;
    setIsPending(true);
    await addObservacaoInterna(entidadeTipo, entidadeId, novaObs);
    setNovaObs("");
    setIsAdding(false);
    setIsPending(false);
  };

  return (
    <div className="space-y-4">
      {/* Lista de Obs */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {observacoes.length === 0 ? (
          <p className="text-sm text-text-secondary italic text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">Nenhuma observação registrada.</p>
        ) : (
          observacoes.map(obs => (
            <div key={obs.id} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-sm text-text-main whitespace-pre-wrap">{obs.observacao}</p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 text-xs text-text-secondary">
                <span className="font-semibold">{obs.autor}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(obs.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Adicionar Obs */}
      {!isAdding ? (
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full flex justify-center items-center py-2 px-4 rounded-lg bg-gray-50 text-text-main text-sm font-medium hover:bg-gray-100 border border-gray-200 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Observação
        </button>
      ) : (
        <div className="space-y-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
          <textarea
            value={novaObs}
            onChange={(e) => setNovaObs(e.target.value)}
            placeholder="Digite a observação..."
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-light focus:border-blue-light bg-white resize-none"
            autoFocus
          />
          <div className="flex gap-2">
            <button 
              onClick={handleAdd}
              disabled={isPending || !novaObs.trim()}
              className="flex-1 flex justify-center items-center py-2 px-4 rounded-lg bg-blue-light text-white text-sm font-medium hover:bg-blue-dark disabled:opacity-50 transition-colors"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Salvar"}
            </button>
            <button 
              onClick={() => setIsAdding(false)}
              disabled={isPending}
              className="flex-1 flex justify-center items-center py-2 px-4 rounded-lg bg-gray-200 text-text-main text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
