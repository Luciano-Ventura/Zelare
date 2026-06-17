"use client";

import { XCircle } from "lucide-react";
import { cancelarSolicitacaoFamilia } from "@/app/acompanhar/[codigo]/actions";
import { useState } from "react";

export function CancelarSolicitacaoFamiliaButton({ codigo, solicitacaoId }: { codigo: string; solicitacaoId: string }) {
  const [isCanceling, setIsCanceling] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm("Deseja realmente cancelar este pedido de cuidado? Essa ação não pode ser desfeita e nós interromperemos a busca pelo profissional.")) {
      return;
    }
    
    setIsCanceling(true);
    const res = await cancelarSolicitacaoFamilia(codigo, solicitacaoId);
    if (res.error) {
      alert(res.error);
      setIsCanceling(false);
    }
  };

  return (
    <button 
      onClick={handleCancel}
      disabled={isCanceling}
      className="mt-6 w-full py-3 text-red-500 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
    >
      <XCircle className="w-5 h-5" />
      {isCanceling ? "Cancelando..." : "Cancelar Pedido"}
    </button>
  );
}
