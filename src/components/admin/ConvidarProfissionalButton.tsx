"use client";

import { useState } from "react";
import { enviarConvite, efetivarPlantaoEPix } from "@/app/admin/(protected)/solicitacoes/[id]/actions";
import { Send, CheckCircle, AlertCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function ConvidarProfissionalButton({ 
  solicitacaoId, 
  profissionalId, 
  jaConvidado, 
  statusConvite, 
  valorContraproposta,
  jaEfetivado,
  resumoEfetivacao
}: { 
  solicitacaoId: string;
  profissionalId: string;
  jaConvidado: boolean;
  statusConvite?: string;
  valorContraproposta?: number;
  jaEfetivado?: boolean;
  resumoEfetivacao?: {
    familia_nome: string;
    tipo_cuidado: string;
    data_horario: string;
    duracao: string;
    endereco: string;
    profissional_nome: string;
  };
}) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleConvidar = async () => {
    setLoading(true);
    await enviarConvite(solicitacaoId, profissionalId);
    setLoading(false);
  };

  const handleEfetivar = async () => {
    setModalLoading(true);
    setError(null);
    const res = await efetivarPlantaoEPix(solicitacaoId, profissionalId);
    setModalLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      setShowModal(false);
      router.refresh();
    }
  };

  if (jaEfetivado) {
    return (
      <div className="flex flex-col items-center">
        <span className="text-[10px] text-gray-500 font-medium text-center">
          Outro profissional já foi efetivado para esta solicitação.
        </span>
      </div>
    );
  }

  if (jaConvidado) {
    let colorClass = "text-gray-500 bg-gray-100";
    if (statusConvite === "Aceita") colorClass = "text-green-700 bg-green-100";
    if (statusConvite === "Recusada") colorClass = "text-red-700 bg-red-100";
    if (statusConvite === "Contraproposta") colorClass = "text-orange-700 bg-orange-100";

    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-col items-end">
          {statusConvite === "Aceita" ? (
             <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${colorClass}`}>
                Profissional aceitou
             </span>
          ) : (
            <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${colorClass}`}>
              {statusConvite}
            </span>
          )}
          {statusConvite === "Contraproposta" && valorContraproposta && (
            <span className="text-xs text-orange-800 font-bold mt-1">R$ {valorContraproposta}</span>
          )}
        </div>

        {statusConvite === "Aceita" && (
          <>
            <button 
              onClick={() => setShowModal(true)}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-1 shadow-sm"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Efetivar e cobrar
            </button>

            {showModal && resumoEfetivacao && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2F3437]/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#FAFAF7]">
                    <h2 className="text-sm font-bold text-[#2F3437]">Efetivar Plantão e Gerar Pix</h2>
                    <button onClick={() => setShowModal(false)} disabled={modalLoading} className="text-[#6B7280] hover:bg-gray-100 p-1 rounded-md">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-5 space-y-4 text-sm text-[#2F3437]">
                    {error && (
                      <div className="p-3 bg-red-50 text-red-700 text-xs font-medium rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /> <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div>
                        <span className="block text-[10px] text-gray-500 font-bold uppercase mb-0.5">Família</span>
                        <span className="font-bold">{resumoEfetivacao.familia_nome}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 font-bold uppercase mb-0.5">Tipo de Cuidado</span>
                        <span className="font-bold">{resumoEfetivacao.tipo_cuidado}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-[10px] text-gray-500 font-bold uppercase mb-0.5">Profissional Escolhido</span>
                        <span className="font-bold text-green-700">{resumoEfetivacao.profissional_nome}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 font-bold uppercase mb-0.5">Início</span>
                        <span className="font-medium">{resumoEfetivacao.data_horario}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-500 font-bold uppercase mb-0.5">Duração</span>
                        <span className="font-medium">{resumoEfetivacao.duracao}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-[10px] text-gray-500 font-bold uppercase mb-0.5">Local</span>
                        <span className="font-medium">{resumoEfetivacao.endereco}</span>
                      </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-orange-800 leading-tight">
                        <strong>Atenção:</strong> Após confirmar, o sistema calculará os preços, criará o plantão, gerará a cobrança Pix no AbacatePay e disponibilizará o pagamento para a família.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                    <button 
                      onClick={() => setShowModal(false)} 
                      disabled={modalLoading}
                      className="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-100"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleEfetivar}
                      disabled={modalLoading}
                      className="flex-[2] py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                      {modalLoading ? "Processando..." : "Confirmar e gerar Pix"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <button 
      onClick={handleConvidar} 
      data-testid="enviar-convite"
      disabled={loading}
      className="flex items-center gap-1 px-3 py-1.5 bg-[#8ECADF]/10 hover:bg-[#8ECADF]/20 text-[#8ECADF] text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
    >
      <Send className="w-3 h-3" /> {loading ? "..." : "Convidar"}
    </button>
  );
}
