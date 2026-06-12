"use client";

import { useState } from "react";
import { enviarConvite } from "@/app/admin/(protected)/solicitacoes/[id]/actions";
import { Send } from "lucide-react";

export function ConvidarProfissionalButton({ solicitacaoId, profissionalId, jaConvidado, statusConvite, valorContraproposta }: { solicitacaoId: string, profissionalId: string, jaConvidado: boolean, statusConvite?: string, valorContraproposta?: number }) {
  const [loading, setLoading] = useState(false);

  const handleConvidar = async () => {
    setLoading(true);
    await enviarConvite(solicitacaoId, profissionalId);
    setLoading(false);
  };

  if (jaConvidado) {
    let colorClass = "text-gray-500 bg-gray-100";
    if (statusConvite === "Aceita") colorClass = "text-green-700 bg-green-100";
    if (statusConvite === "Recusada") colorClass = "text-red-700 bg-red-100";
    if (statusConvite === "Contraproposta") colorClass = "text-orange-700 bg-orange-100";

    return (
      <div className="flex flex-col items-end">
        <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${colorClass}`}>
          {statusConvite}
        </span>
        {statusConvite === "Contraproposta" && valorContraproposta && (
          <span className="text-xs text-orange-800 font-bold mt-1">R$ {valorContraproposta}</span>
        )}
      </div>
    );
  }

  return (
    <button 
      onClick={handleConvidar} 
      disabled={loading}
      className="flex items-center gap-1 px-3 py-1.5 bg-[#8ECADF]/10 hover:bg-[#8ECADF]/20 text-[#8ECADF] text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
    >
      <Send className="w-3 h-3" /> {loading ? "..." : "Convidar"}
    </button>
  );
}
