"use client";

import { useState } from "react";
import { Wallet, DollarSign, CheckCircle2, Link as LinkIcon } from "lucide-react";

function formatCurrency(value: number) {
  if (value === undefined || value === null) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function FinanceiroSolicitacaoCard({ 
  pagamentos, 
  repasses, 
  solicitacaoId 
}: { 
  pagamentos: any[], 
  repasses: any[], 
  solicitacaoId: string 
}) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: string, id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/financeiro/acao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id })
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Erro ao executar ação.");
      }
    } catch (e) {
      console.error(e);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (!pagamentos || pagamentos.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-gray-400" /> Financeiro
        </h3>
        <p className="text-sm text-gray-500">Nenhuma cobrança gerada para esta solicitação ainda.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-blue-light" /> Módulo Financeiro
      </h3>

      <div className="space-y-6">
        {pagamentos.map(pag => {
          const reps = repasses.filter(r => r.plantao_id === pag.plantao_id);
          
          return (
            <div key={pag.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pagamento da Família</p>
                  <p className="text-lg font-black text-gray-800">{formatCurrency(pag.total_familia)}</p>
                  <p className="text-xs font-semibold mt-1">
                    Status: <span className={pag.status_pagamento === "Pago" ? "text-green-600" : "text-amber-600"}>{pag.status_pagamento}</span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pag.status_pagamento === "Aguardando pagamento" && (
                    <>
                      <button 
                        disabled={loading}
                        onClick={() => handleAction("gerar_link", pag.id)}
                        className="text-xs font-semibold bg-white border border-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <LinkIcon className="w-3.5 h-3.5" /> Gerar Link
                      </button>
                      <button 
                        disabled={loading}
                        onClick={() => handleAction("marcar_pago", pag.id)}
                        className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-green-200 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Marcar Pago
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Repasses relacionados */}
              {reps.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Repasses aos Profissionais</p>
                  {reps.map(rep => (
                    <div key={rep.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                      <div>
                        <p className="text-sm font-bold text-gray-800">{rep.profissional_nome}</p>
                        <p className="text-xs text-gray-600">Valor: <span className="font-bold">{formatCurrency(rep.valor_profissional)}</span></p>
                        <p className="text-[10px] font-semibold mt-0.5">
                          Status: <span className={rep.status_repasse === "Repasse Concluído" ? "text-green-600" : "text-amber-600"}>{rep.status_repasse}</span>
                        </p>
                      </div>
                      <div>
                        {rep.status_repasse !== "Repasse Concluído" && (
                          <button 
                            disabled={loading}
                            onClick={() => handleAction("confirmar_repasse", rep.id)}
                            className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-blue-100 transition-colors"
                          >
                            <DollarSign className="w-3.5 h-3.5" /> Confirmar Repasse
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
}
