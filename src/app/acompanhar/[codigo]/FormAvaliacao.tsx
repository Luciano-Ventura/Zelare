"use client";

import { useState } from "react";
import { salvarAvaliacao } from "./actions";

export default function FormAvaliacao({ plantaoId, solicitacaoId, profissionalId }: { plantaoId: string, solicitacaoId: string, profissionalId: string }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await salvarAvaliacao(formData);

    if (res?.error) {
      setError(res.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-[#A8D5BA] rounded-full flex items-center justify-center text-[#2F3437] mx-auto mb-4 text-2xl">✓</div>
        <h3 className="font-bold text-[#2F3437] text-xl mb-2">Avaliação Enviada!</h3>
        <p className="text-sm text-[#6B7280]">Muito obrigado pelo seu feedback. Ele é fundamental para mantermos a qualidade da Zelare.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h3 className="font-bold text-[#2F3437] text-lg">Como foi o atendimento?</h3>
        <p className="text-xs text-[#6B7280] mt-1">Sua avaliação é sigilosa e ajuda a melhorar nossos serviços.</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold text-center">{error}</div>}

      <input type="hidden" name="plantao_id" value={plantaoId} />
      <input type="hidden" name="solicitacao_id" value={solicitacaoId} />
      <input type="hidden" name="profissional_id" value={profissionalId} />

      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3 text-center">Nota (1 a 5)</label>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <label key={num} className="cursor-pointer">
              <input type="radio" name="nota" value={num} className="peer sr-only" required />
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 border border-gray-200 text-[#6B7280] font-black peer-checked:bg-[#8ECADF] peer-checked:text-[#2F3437] peer-checked:border-[#8ECADF] transition-all">
                {num}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Comentário (Opcional)</label>
        <textarea name="comentario" placeholder="Deixe um elogio ou sugestão..." className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm text-[#2F3437] focus:ring-4 focus:ring-[#8ECADF]/20 focus:border-[#8ECADF] outline-none" rows={3}></textarea>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-[#2F3437] text-white py-4 rounded-2xl text-base font-black hover:brightness-95 transition-all shadow-md disabled:opacity-50">
        {loading ? "Enviando..." : "Enviar Avaliação"}
      </button>
    </form>
  );
}
