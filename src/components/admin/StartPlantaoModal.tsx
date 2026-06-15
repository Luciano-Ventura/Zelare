"use client";

import { useState, useEffect } from "react";
import { createPlantao } from "@/app/admin/(protected)/solicitacoes/[id]/actions";
import { CalendarClock, X, CheckCircle2, AlertCircle } from "lucide-react";

type Profissional = {
  id: string;
  nome_completo: string;
  categoria_profissional: string;
  cidade: string;
  regioes_atende?: string;
};

type Ocupacao = {
  profissional_id: string;
  inicio_em: string;
  fim_em: string;
};

export function StartPlantaoModal({ 
  solicitacaoId, 
  profissionais, 
  ocupacoes,
  defaultData, 
  defaultHorario, 
  defaultDuracao 
}: { 
  solicitacaoId: string;
  profissionais: Profissional[];
  ocupacoes: Ocupacao[];
  defaultData: string;
  defaultHorario: string;
  defaultDuracao: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Form, 2: Summary
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [busca, setBusca] = useState("");
  const [formData, setFormData] = useState({
    profissional_id: "",
    data_plantao: "", 
    horario_inicio: "",
    horario_fim: "",
    valor_profissional: "",
  });

  const [taxaZelare, setTaxaZelare] = useState(0);
  const [totalFamilia, setTotalFamilia] = useState(0);
  const [duracaoCalc, setDuracaoCalc] = useState("");
  const [inicioEmCalc, setInicioEmCalc] = useState("");
  const [fimEmCalc, setFimEmCalc] = useState("");
  const [profissionaisDisponiveis, setProfissionaisDisponiveis] = useState<Profissional[]>([]);

  // Parse default date if it's DD/MM/YYYY
  useEffect(() => {
    if (defaultData && defaultData.includes("/")) {
      const parts = defaultData.split("/");
      if (parts.length === 3) {
        setFormData(prev => ({ ...prev, data_plantao: `${parts[2]}-${parts[1]}-${parts[0]}` }));
      }
    }
  }, [defaultData]);

  // Recalculate everything when time or value changes
  useEffect(() => {
    if (formData.data_plantao && formData.horario_inicio && formData.horario_fim) {
      // SP Timezone (UTC-3)
      const startIso = `${formData.data_plantao}T${formData.horario_inicio}:00-03:00`;
      const startDate = new Date(startIso);
      let endDate = new Date(`${formData.data_plantao}T${formData.horario_fim}:00-03:00`);
      
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1); // Cruza meia-noite
      }

      setInicioEmCalc(startDate.toISOString());
      setFimEmCalc(endDate.toISOString());

      const diffMs = endDate.getTime() - startDate.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      setDuracaoCalc(`${diffHrs}h`);

      // Filter professionals availability
      const availableProfs = profissionais.filter(p => {
        // Find if any occupation overlaps
        const hasConflict = ocupacoes.some(oc => {
          if (oc.profissional_id !== p.id) return false;
          const ocStart = new Date(oc.inicio_em);
          const ocEnd = new Date(oc.fim_em);
          // Overlap condition: start < end AND end > start
          return (ocStart < endDate && ocEnd > startDate);
        });
        return !hasConflict;
      });

      setProfissionaisDisponiveis(availableProfs);

      // se o selecionado nao esta disponivel, limpar
      if (formData.profissional_id && !availableProfs.find(p => p.id === formData.profissional_id)) {
         setFormData(prev => ({ ...prev, profissional_id: "" }));
         setBusca("");
      }

    } else {
      setProfissionaisDisponiveis(profissionais);
    }

    const val = parseFloat(formData.valor_profissional) || 0;
    const taxa = Math.max(20, val * 0.15);
    setTaxaZelare(taxa);
    setTotalFamilia(val + taxa);

  }, [formData.data_plantao, formData.horario_inicio, formData.horario_fim, formData.valor_profissional, profissionais, ocupacoes]);

  const profsFiltradosParaDropdown = profissionaisDisponiveis.filter(p => {
    const termo = busca.toLowerCase();
    return (
      p.nome_completo.toLowerCase().includes(termo) ||
      p.categoria_profissional?.toLowerCase().includes(termo) ||
      p.cidade?.toLowerCase().includes(termo) ||
      p.regioes_atende?.toLowerCase().includes(termo)
    );
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.profissional_id) {
      setError("Selecione um profissional.");
      return;
    }
    if (!formData.data_plantao || !formData.horario_inicio || !formData.horario_fim) {
      setError("Preencha a data e os horários corretamente.");
      return;
    }
    if (!formData.valor_profissional || parseFloat(formData.valor_profissional) <= 0) {
      setError("Informe o valor do profissional.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    const profNome = profissionais.find(p => p.id === formData.profissional_id)?.nome_completo || "";
    // Reformat date to DD/MM/YYYY for text field backward compatibility
    const [y, m, d] = formData.data_plantao.split("-");
    const dataStr = `${d}/${m}/${y}`;

    const result = await createPlantao({
      solicitacao_id: solicitacaoId,
      profissional_id: formData.profissional_id,
      data_plantao: dataStr,
      horario_inicio: formData.horario_inicio,
      horario_fim: formData.horario_fim,
      duracao: duracaoCalc,
      valor_profissional: parseFloat(formData.valor_profissional),
      taxa_zelare: taxaZelare,
      total_familia: totalFamilia,
      inicio_em: inicioEmCalc,
      fim_em: fimEmCalc,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
    } else {
      setIsOpen(false);
      setStep(1);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-2 bg-[#8ECADF] text-[#2F3437] rounded-lg text-sm font-bold hover:brightness-95 transition-all shadow-sm flex items-center justify-center gap-2"
      >
        <CalendarClock className="w-4 h-4" />
        Criar Plantão
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2F3437]/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden my-auto border border-white/50">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FAFAF7]">
              <h2 className="text-lg font-bold text-[#2F3437]">
                {step === 1 ? "Criar Plantão" : "Resumo do Plantão"}
              </h2>
              <button onClick={() => { setIsOpen(false); setStep(1); }} className="text-[#6B7280] hover:text-[#2F3437] transition-colors p-1 rounded-md hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {step === 1 && (
              <form onSubmit={handleNext} className="p-6 overflow-y-auto space-y-5">
                {error && <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-xl flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Data</label>
                    <input 
                      required type="date"
                      value={formData.data_plantao} onChange={(e) => setFormData({...formData, data_plantao: e.target.value})}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#8ECADF]/50 focus:border-[#8ECADF] transition-all"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Início</label>
                    <input 
                      required type="time"
                      value={formData.horario_inicio} onChange={(e) => setFormData({...formData, horario_inicio: e.target.value})}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#8ECADF]/50 focus:border-[#8ECADF] transition-all"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Fim</label>
                    <input 
                      required type="time"
                      value={formData.horario_fim} onChange={(e) => setFormData({...formData, horario_fim: e.target.value})}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#8ECADF]/50 focus:border-[#8ECADF] transition-all"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5 flex justify-between">
                    <span>Buscar Profissional Livre</span>
                    <span className="text-[#8ECADF]">{profissionaisDisponiveis.length} disponíveis</span>
                  </label>
                  <input 
                    type="text"
                    placeholder="Digite nome, categoria..."
                    value={busca}
                    disabled={!(formData.data_plantao && formData.horario_inicio && formData.horario_fim)}
                    onChange={(e) => {
                      setBusca(e.target.value);
                      if (formData.profissional_id) setFormData({...formData, profissional_id: ""});
                    }}
                    onFocus={() => setBusca(busca)}
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#8ECADF]/50 focus:border-[#8ECADF] transition-all disabled:opacity-50"
                  />
                  {!(formData.data_plantao && formData.horario_inicio && formData.horario_fim) && (
                     <p className="text-[10px] text-orange-600 font-bold mt-1">Preencha Data e Horários primeiro para validar conflitos de agenda.</p>
                  )}
                  
                  {(!formData.profissional_id && busca.length > 0) && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-56 overflow-y-auto">
                      {profsFiltradosParaDropdown.length === 0 ? (
                        <div className="px-4 py-3 text-sm font-medium text-[#6B7280]">Nenhum profissional compatível e disponível encontrado.</div>
                      ) : (
                        profsFiltradosParaDropdown.map(p => (
                          <div 
                            key={p.id}
                            className="px-4 py-3 text-sm hover:bg-[#8ECADF]/10 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                            onClick={() => {
                              setFormData({...formData, profissional_id: p.id});
                              setBusca(`${p.nome_completo} - ${p.cidade}`);
                            }}
                          >
                            <p className="font-bold text-[#2F3437]">{p.nome_completo}</p>
                            <p className="text-[10px] uppercase font-bold text-[#6B7280] mt-1">{p.categoria_profissional} • {p.cidade}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  
                  {formData.profissional_id && (
                    <p className="text-xs font-bold text-[#A8D5BA] mt-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Profissional selecionado e disponível
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Valor do Profissional (R$)</label>
                  <input 
                    required type="number" step="0.01" min="1" placeholder="0.00"
                    value={formData.valor_profissional} onChange={(e) => setFormData({...formData, valor_profissional: e.target.value})}
                    className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#8ECADF]/50 focus:border-[#8ECADF] transition-all"
                  />
                </div>

                {formData.valor_profissional && (
                  <div className="bg-[#FAFAF7] p-4 rounded-xl border border-gray-100 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280] font-medium">Duração calculada:</span>
                      <span className="font-bold text-[#2F3437]">{duracaoCalc}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6B7280] font-medium">Taxa Zelare (15% ou mín R$20):</span>
                      <span className="font-bold text-[#2F3437]">R$ {taxaZelare.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="text-[#6B7280] font-bold">Total a cobrar da família:</span>
                      <span className="font-black text-[#8ECADF]">R$ {totalFamilia.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-[#8ECADF] text-[#2F3437] rounded-xl text-sm font-bold hover:brightness-95 transition-all"
                  >
                    Avançar para Resumo
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="p-6 overflow-y-auto space-y-6">
                {error && <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-xl flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

                <div className="space-y-4 bg-[#FAFAF7] p-5 rounded-2xl border border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Profissional</p>
                    <p className="font-bold text-[#2F3437]">{profissionais.find(p => p.id === formData.profissional_id)?.nome_completo}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Início</p>
                      <p className="font-bold text-[#2F3437]">{formData.data_plantao.split('-').reverse().join('/')} às {formData.horario_inicio}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Fim (Duração)</p>
                      <p className="font-bold text-[#2F3437]">{formData.horario_fim} ({duracaoCalc})</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Repasse ao Prof.</p>
                      <p className="font-bold text-green-700">R$ {parseFloat(formData.valor_profissional).toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Total Família</p>
                      <p className="font-black text-[#8ECADF]">R$ {totalFamilia.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-white text-[#6B7280] border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                  >
                    Voltar
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-[2] py-3 bg-[#A8D5BA] text-[#2F3437] rounded-xl text-sm font-bold hover:brightness-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Salvando..." : <><CheckCircle2 className="w-5 h-5" /> Criar Plantão</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
