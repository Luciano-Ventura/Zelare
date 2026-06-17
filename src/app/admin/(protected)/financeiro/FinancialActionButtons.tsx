"use client";

import { useState } from "react";
import { Link as LinkIcon, CheckCircle2, Copy } from "lucide-react";
import { savePaymentLink, markAsPaid, markRepasseAsDone } from "./actions";

export function FinancialActionButtons({ 
  type, 
  id, 
  status, 
  linkPagamento, 
  plantaoId,
  solicitacaoId,
  pacoteId
}: { 
  type: "pagamento" | "repasse", 
  id: string, 
  status: string, 
  linkPagamento?: string,
  plantaoId?: string,
  solicitacaoId?: string,
  pacoteId?: string
}) {
  const [loading, setLoading] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInput, setLinkInput] = useState(linkPagamento || "");

  const handleSaveLink = async () => {
    setLoading(true);
    await savePaymentLink(id, linkInput);
    setShowLinkInput(false);
    setLoading(false);
  };

  const handleMarkPaid = async () => {
    if (!confirm("Confirmar que este pagamento foi recebido?")) return;
    setLoading(true);
    await markAsPaid(id, plantaoId || null, solicitacaoId!, pacoteId || null);
    setLoading(false);
  };

  const handleMarkRepassed = async () => {
    if (!confirm("Confirmar que você já enviou o Pix para o profissional?")) return;
    setLoading(true);
    await markRepasseAsDone(id);
    setLoading(false);
  };

  if (type === "pagamento") {
    if (status === "Pago") {
      return null;
    }
    
    return (
      <div className="flex flex-col items-end gap-2">
        {!showLinkInput ? (
          <div className="flex items-center gap-2">
            {linkPagamento ? (
              <button 
                onClick={() => { navigator.clipboard.writeText(linkPagamento); alert("Link copiado!"); }}
                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded" title="Copiar Link"
              >
                <Copy className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={() => setShowLinkInput(true)}
                className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded" title="Adicionar Link de Pagamento"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            )}
            
            <button 
              onClick={handleMarkPaid} disabled={loading}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" /> Pago
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={linkInput} 
              onChange={(e) => setLinkInput(e.target.value)} 
              placeholder="Cole o link (Pix/Cartão)"
              className="text-xs px-2 py-1 border rounded w-32 outline-none"
            />
            <button onClick={handleSaveLink} disabled={loading} className="text-[10px] bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">Salvar</button>
            <button onClick={() => setShowLinkInput(false)} className="text-[10px] bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">X</button>
          </div>
        )}
      </div>
    );
  }

  // Repasse
  if (status === "Repassado") {
    return null;
  }
  
  if (status === "Aguardando conclusão") {
     return <span className="text-[10px] text-gray-400 italic">Plantão não concluído</span>;
  }

  return (
    <button 
      onClick={handleMarkRepassed} disabled={loading}
      className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 inline-flex ml-auto"
    >
      <CheckCircle2 className="w-4 h-4" /> Feito
    </button>
  );
}
