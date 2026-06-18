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

  const handleGerarPix = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const valorReais = formData.get("valorReais") as string;
    if (!valorReais) return;

    const valorCentavos = Math.round(parseFloat(valorReais.replace(",", ".")) * 100);
    
    setLoading(true);
    try {
      const { gerarCobrancaPix } = await import("@/app/actions");
      const res = await gerarCobrancaPix(solicitacaoId, valorCentavos);
      if (res.success) {
        alert("Pix gerado com sucesso no AbacatePay!");
        window.location.reload();
      } else {
        alert("Erro ao gerar Pix: " + res.error);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao gerar Pix.");
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
        <p className="text-sm text-gray-500 mb-4">Nenhuma cobrança gerada para esta solicitação ainda. A cobrança (Pix) será gerada automaticamente ao efetivar o plantão do profissional.</p>
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
                  {/* Se tiver valor_centavos usa ele, senão faz fallback pro total_familia legado */}
                  <p className="text-lg font-black text-gray-800">
                    {pag.valor_centavos ? formatCurrency(pag.valor_centavos / 100) : formatCurrency(pag.total_familia)}
                  </p>
                  <p className="text-xs font-semibold mt-1 flex items-center gap-1">
                    Status: 
                    <span className={pag.status === "PAID" || pag.status_pagamento === "Pago" ? "text-green-600" : "text-amber-600"}>
                      {pag.status === "PAID" ? "PAGO (Pix)" : pag.status === "PENDING" ? "Aguardando Pagamento" : pag.status_pagamento}
                    </span>
                  </p>
                  {pag.gateway === "abacatepay" && pag.status === "PENDING" && (
                     <p className="text-[10px] text-gray-500 mt-1">Gerado via AbacatePay</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {pag.status === "PENDING" && pag.gateway === "abacatepay" && (
                    <>
                      <button 
                        onClick={() => window.open(pag.qr_code_url || `/acompanhar/${solicitacaoId}`, '_blank')}
                        className="text-xs font-semibold bg-white border border-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <LinkIcon className="w-3.5 h-3.5" /> Ver Tela Pix
                      </button>
                      <button 
                        disabled={loading}
                        onClick={() => handleAction("marcar_pago", pag.id)}
                        className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-green-200 transition-colors"
                        title="Simula o recebimento do pagamento caso webhook não chegue localmente"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Marcar Pago
                      </button>
                    </>
                  )}
                  {pag.status_pagamento === "Aguardando pagamento" && !pag.gateway && (
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
