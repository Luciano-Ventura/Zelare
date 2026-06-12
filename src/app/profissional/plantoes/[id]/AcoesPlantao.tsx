"use client";

import { useState } from "react";
import { registrarAcaoPlantao } from "../actions";

type AcoesPlantaoProps = {
  id: string;
  statusProfissional: string | null;
  statusGlobal: string;
};

export default function AcoesPlantao({ id, statusProfissional, statusGlobal }: AcoesPlantaoProps) {
  const [loading, setLoading] = useState(false);
  const [showFinalizar, setShowFinalizar] = useState(false);

  // Determinar o próximo passo lógico
  let proximoPasso = "Estou a caminho";
  if (statusProfissional === "A caminho") proximoPasso = "Cheguei";
  if (statusProfissional === "No local") proximoPasso = "Iniciar";
  if (statusProfissional === "Em andamento" || statusGlobal === "Em andamento") proximoPasso = "Finalizar";
  if (statusProfissional === "Finalizado" || statusGlobal === "Concluído" || statusGlobal === "Cancelado") proximoPasso = "Nenhum";

  const handleSimples = async (acao: string) => {
    setLoading(true);
    await registrarAcaoPlantao(id, acao);
    setLoading(false);
  };

  const handleFinalizar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const checklist = {
      atraso: formData.get("atraso") === "on",
      intercorrencia: formData.get("intercorrencia") === "on",
      fora_combinado: formData.get("fora_combinado") === "on",
      observacoes: formData.get("observacoes") as string
    };

    await registrarAcaoPlantao(id, "Finalizar", checklist);
    setLoading(false);
  };

  if (proximoPasso === "Nenhum") {
    return (
      <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 mt-6">
        <p className="text-sm font-bold text-[#6B7280]">Plantão Encerrado.</p>
      </div>
    );
  }

  if (proximoPasso === "Finalizar" && showFinalizar) {
    return (
      <form onSubmit={handleFinalizar} className="space-y-4 bg-white p-5 rounded-2xl border border-[#8ECADF] shadow-sm mt-6">
        <h3 className="font-bold text-[#2F3437] mb-2">Checklist de Finalização</h3>
        
        <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <input type="checkbox" name="atraso" className="w-5 h-5 text-[#8ECADF] rounded" />
          <span className="text-sm font-bold text-[#2F3437]">Houve atraso?</span>
        </label>
        
        <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <input type="checkbox" name="intercorrencia" className="w-5 h-5 text-[#8ECADF] rounded" />
          <span className="text-sm font-bold text-[#2F3437]">Houve intercorrência clínica/técnica?</span>
        </label>

        <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <input type="checkbox" name="fora_combinado" className="w-5 h-5 text-[#8ECADF] rounded" />
          <span className="text-sm font-bold text-[#2F3437]">Família solicitou algo fora do escopo?</span>
        </label>

        <div>
          <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1">Observações Finais (Públicas para Zelare)</label>
          <textarea name="observacoes" required placeholder="Como foi o plantão? Relate fatos importantes." className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#8ECADF] outline-none" rows={3} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => setShowFinalizar(false)} className="flex-1 py-3 text-sm font-bold text-gray-500">Cancelar</button>
          <button type="submit" disabled={loading} className="flex-1 bg-[#2F3437] text-white py-3 rounded-xl text-sm font-bold">Encerrar Plantão</button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-6">
      {proximoPasso === "Finalizar" ? (
        <button 
          onClick={() => setShowFinalizar(true)}
          className="w-full bg-[#A8D5BA] text-[#2F3437] py-4 rounded-2xl text-base font-black hover:brightness-95 transition-all shadow-md"
        >
          Concluir Plantão
        </button>
      ) : (
        <button 
          onClick={() => handleSimples(proximoPasso)}
          disabled={loading}
          className="w-full bg-[#8ECADF] text-[#2F3437] py-4 rounded-2xl text-base font-black hover:brightness-95 transition-all shadow-md disabled:opacity-50"
        >
          {loading ? "Processando..." : proximoPasso}
        </button>
      )}
    </div>
  );
}
