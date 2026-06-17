"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { relatarOcorrenciaFamilia } from "@/app/acompanhar/[codigo]/actions";

export function RelatarProblemaButton({ 
  codigo, 
  solicitacaoId, 
  plantaoId 
}: { 
  codigo: string, 
  solicitacaoId: string, 
  plantaoId?: string 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const fd = new FormData(e.currentTarget);
    const res = await relatarOcorrenciaFamilia(fd);
    setIsPending(false);
    
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 3000);
    } else {
      alert("Erro ao enviar relato: " + res.error);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="mt-6 flex items-center justify-center w-full py-3 rounded-xl border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors"
      >
        <AlertTriangle className="w-4 h-4 mr-2" /> Relatar um Problema
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-red-50/50">
              <h3 className="font-bold text-lg text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Relatar Problema
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {success ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900">Relato Enviado</h4>
                <p className="text-sm text-gray-500">Nossa equipe entrará em contato o mais breve possível para ajudar a resolver esta questão.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input type="hidden" name="codigo" value={codigo} />
                <input type="hidden" name="solicitacaoId" value={solicitacaoId} />
                {plantaoId && <input type="hidden" name="plantao_id" value={plantaoId} />}
                
                <p className="text-sm text-gray-600 font-medium">
                  Descreva detalhadamente o que aconteceu. Nossa equipe de operações receberá o alerta imediatamente.
                </p>

                <textarea 
                  name="descricao" 
                  rows={4} 
                  required 
                  placeholder="Ex: O profissional chegou atrasado... ou Não consegui contato..."
                  className="w-full border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 border"
                ></textarea>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isPending ? "Enviando..." : "Enviar Relato"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)}
                    className="w-full mt-3 text-gray-500 font-bold text-sm py-2 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
