"use client";

import { useState } from "react";
import { registrarOcorrencia } from "./actions";
import { useRouter } from "next/navigation";

export default function FormOcorrencia({ plantoes }: { plantoes: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const res = await registrarOcorrencia(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/profissional");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold">{error}</div>}

      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Plantão Vinculado</label>
        <select name="plantao_id" required className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base font-bold text-[#2F3437] focus:ring-4 focus:ring-[#8ECADF]/20 focus:border-[#8ECADF] outline-none">
          <option value="">Selecione um plantão ativo...</option>
          {plantoes.map(p => (
            <option key={p.id} value={p.id}>
              {p.data_plantao} - {p.cidade}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Tipo de Ocorrência</label>
        <select name="tipo_ocorrencia" required className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base font-bold text-[#2F3437] focus:ring-4 focus:ring-[#8ECADF]/20 focus:border-[#8ECADF] outline-none">
          <option value="">Selecione...</option>
          <option value="Atraso">Atraso</option>
          <option value="Família não estava no local">Família não estava no local</option>
          <option value="Mudança no combinado">Mudança no combinado</option>
          <option value="Condição de saúde alterada">Condição de saúde alterada</option>
          <option value="Queda">Queda / Acidente</option>
          <option value="Mal-estar">Mal-estar geral</option>
          <option value="Conflito com familiar">Conflito com familiar</option>
          <option value="Solicitação fora do combinado">Solicitação fora do combinado</option>
          <option value="Cancelamento em cima da hora">Cancelamento em cima da hora</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Gravidade Inicial</label>
        <select name="gravidade" required className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base font-bold text-[#2F3437] focus:ring-4 focus:ring-[#8ECADF]/20 focus:border-[#8ECADF] outline-none">
          <option value="Baixa">Baixa (Apenas informativo)</option>
          <option value="Média">Média (Requer atenção)</option>
          <option value="Alta">Alta (Problema imediato)</option>
          <option value="Crítica">Crítica (Risco de vida/processo)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">Relato / Descrição</label>
        <textarea name="descricao" required placeholder="Descreva com detalhes o que aconteceu..." className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-base text-[#2F3437] focus:ring-4 focus:ring-[#8ECADF]/20 focus:border-[#8ECADF] outline-none" rows={4}></textarea>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-red-500 text-white py-4 rounded-2xl text-base font-black hover:brightness-95 transition-all shadow-md disabled:opacity-50">
        {loading ? "Enviando..." : "Registrar Ocorrência"}
      </button>
    </form>
  );
}
