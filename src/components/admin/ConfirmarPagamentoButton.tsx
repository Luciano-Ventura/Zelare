"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { confirmarPagamento } from "@/app/admin/crm-actions";

export function ConfirmarPagamentoButton({ plantaoId, pacoteId, solicitacaoId, currentStatus }: { plantaoId?: string, pacoteId?: string, solicitacaoId: string, currentStatus: string }) {
  const [isPending, setIsPending] = useState(false);

  if (currentStatus !== "Aguardando pagamento") return null;

  const handleConfirmar = async () => {
    if (!confirm("Tem certeza que o pagamento foi recebido da família? Isso irá confirmar a prestação de serviço.")) return;
    
    setIsPending(true);
    const res = await confirmarPagamento({ plantaoId, pacoteId, solicitacaoId });
    if (!res.success) {
      alert("Erro ao confirmar pagamento: " + res.error);
    }
    setIsPending(false);
  };

  return (
    <button
      onClick={handleConfirmar}
      disabled={isPending}
      className="flex items-center gap-1 bg-green-100 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors disabled:opacity-50"
      title="Confirmar Pagamento e Plantão"
    >
      {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
      Confirmar Pagto
    </button>
  );
}
