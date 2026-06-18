"use client";

import { useState } from "react";
import { responderOportunidade } from "../actions";

export default function ResponderOportunidade({ id, statusAtual }: { id: string, statusAtual: string }) {
  const [loading, setLoading] = useState(false);
  const [showRecusa, setShowRecusa] = useState(false);

  if (statusAtual !== "Enviada" && statusAtual !== "Visualizada") {
    return (
      <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
        <p className="text-sm font-bold text-[#6B7280]">Você já respondeu a este convite.</p>
        <p className="text-xs text-[#6B7280] mt-1">Status atual: {statusAtual}</p>
      </div>
    );
  }

  const handleAction = async (action: "Aceita" | "Recusada" | "Contraproposta", formData?: FormData) => {
    setLoading(true);
    let payload = {};
    
    if (action === "Recusada" && formData) {
      payload = { motivo: formData.get("motivo") as string };
    }

    await responderOportunidade(id, action, payload);
    setLoading(false);
  };

  return (
    <div className="space-y-4 mt-8">
      {!showRecusa ? (
        <>
          <button 
            onClick={() => handleAction("Aceita")}
            data-testid="aceitar-convite"
            disabled={loading}
            className="w-full bg-[#8ECADF] text-[#2F3437] py-4 rounded-2xl text-base font-black hover:brightness-95 transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Processando..." : "Tenho Interesse (Aceitar)"}
          </button>
          
          <button 
            onClick={() => setShowRecusa(true)}
            className="w-full bg-white border border-gray-200 text-gray-500 py-3 rounded-2xl text-sm font-bold transition-all"
          >
            Recusar
          </button>
        </>
      ) : (
        <form action={(data) => handleAction("Recusada", data)} className="space-y-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-[#2F3437]">Motivo da Recusa (Opcional)</h3>
          <textarea 
            name="motivo" 
            placeholder="Ex: Já tenho compromisso neste horário"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#8ECADF] outline-none"
            rows={3}
          />
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowRecusa(false)} className="flex-1 py-3 text-sm font-bold text-gray-500">Voltar</button>
            <button type="submit" disabled={loading} className="flex-1 bg-gray-800 text-white py-3 rounded-xl text-sm font-bold">Confirmar Recusa</button>
          </div>
        </form>
      )}
    </div>
  );
}
