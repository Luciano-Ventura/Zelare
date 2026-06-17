"use client";

import { useState, useEffect } from "react";
import { createPlantao, fetchPricingConfig, previewPlantoesEmLote, createPlantoesEmLote } from "@/app/admin/(protected)/solicitacoes/[id]/actions";
import { calcularPrecoPlantao, PricingRegiao } from "@/lib/financeiro";
import { CalendarClock, X, CheckCircle2, AlertCircle, Edit2, CalendarDays, Calendar as CalendarIcon, CheckSquare, Square } from "lucide-react";

type Profissional = {
  id: string;
  nome_completo: string;
  categoria_profissional: string;
  cidade: string;
  regioes_atende?: string;
  valor_minimo_4h?: number;
  valor_minimo_6h?: number;
  valor_minimo_8h?: number;
  valor_minimo_12h?: number;
  valor_minimo_24h?: number;
};

export function StartPlantaoModal({ 
  solicitacaoId, solicEstado, solicCidade, profissionais, ocupacoes, defaultData, defaultHorario, defaultDuracao 
}: { 
  solicitacaoId: string; solicEstado?: string; solicCidade?: string; profissionais: Profissional[]; ocupacoes: any[]; defaultData: string; defaultHorario: string; defaultDuracao: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States Básicos
  const [tipoAgendamento, setTipoAgendamento] = useState<"unico" | "pacote">("unico");
  const [busca, setBusca] = useState("");
  
  // Form Data
  const [formData, setFormData] = useState({
    profissional_id: "",
    data_plantao: "", // para único
    data_inicial: "", // para pacote
    data_final: "", // para pacote
    dias_semana: [] as number[], // para pacote
    horario_inicio: "",
    horario_fim: "",
    valor_profissional: "",
    taxa_zelare: "",
    total_familia: "",
    houve_ajuste_manual: false,
    motivo_ajuste_manual: "",
  });

  const [duracaoCalc, setDuracaoCalc] = useState("");
  const [profissionaisDisponiveis, setProfissionaisDisponiveis] = useState<Profissional[]>([]);
  const [pricingConfig, setPricingConfig] = useState<PricingRegiao | null>(null);
  const [calcResult, setCalcResult] = useState<any>(null);
  
  // Preview Pacote
  const [previewResult, setPreviewResult] = useState<any>(null);

  const DIAS = [
    { id: 1, label: "Seg" }, { id: 2, label: "Ter" }, { id: 3, label: "Qua" },
    { id: 4, label: "Qui" }, { id: 5, label: "Sex" }, { id: 6, label: "Sáb" }, { id: 0, label: "Dom" }
  ];

  const toggleDia = (id: number) => {
    setFormData(prev => ({
      ...prev,
      dias_semana: prev.dias_semana.includes(id) 
        ? prev.dias_semana.filter(d => d !== id)
        : [...prev.dias_semana, id]
    }));
  };

  // Reset errors on close
  useEffect(() => {
    if (!isOpen) {
      setStep(1); setError(null); setPreviewResult(null);
    }
  }, [isOpen]);

  // Pricing Fetch
  useEffect(() => {
    if (isOpen && (duracaoCalc || defaultDuracao)) {
      const getPricing = async () => {
        let duracaoHoras = 12;
        const durStr = duracaoCalc || defaultDuracao || "";
        if (durStr.includes("24h")) duracaoHoras = 24;
        else if (durStr.includes("8h")) duracaoHoras = 8;
        else if (durStr.includes("6h")) duracaoHoras = 6;
        else if (durStr.includes("4h")) duracaoHoras = 4;

        const res = await fetchPricingConfig({ estado: solicEstado, cidade: solicCidade, duracao_horas: duracaoHoras });
        setPricingConfig(res?.success ? (res.data as PricingRegiao) : null);
      }
      getPricing();
    }
  }, [isOpen, solicEstado, solicCidade, defaultDuracao, duracaoCalc]);

  // Recalcular duração
  useEffect(() => {
    if (formData.horario_inicio && formData.horario_fim) {
      const baseDate = formData.data_plantao || formData.data_inicial || new Date().toISOString().split("T")[0];
      const startIso = `${baseDate}T${formData.horario_inicio}:00-03:00`;
      const startDate = new Date(startIso);
      let endDate = new Date(`${baseDate}T${formData.horario_fim}:00-03:00`);
      
      if (endDate < startDate) endDate.setDate(endDate.getDate() + 1); 

      if (!isNaN(startDate.getTime())) {
        const diffHrs = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
        setDuracaoCalc(`${diffHrs}h`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.horario_inicio, formData.horario_fim, formData.data_plantao, formData.data_inicial]);

  // Filtering Profs
  useEffect(() => {
    setProfissionaisDisponiveis(profissionais);
  }, [profissionais]);

  const profsFiltradosParaDropdown = profissionaisDisponiveis.filter(p => {
    const t = busca.toLowerCase();
    return p.nome_completo.toLowerCase().includes(t) || p.cidade?.toLowerCase().includes(t) || p.categoria_profissional?.toLowerCase().includes(t);
  });

  // Calculation Unitário
  useEffect(() => {
    if (formData.profissional_id && pricingConfig && duracaoCalc) {
      const p = profissionaisDisponiveis.find(x => x.id === formData.profissional_id);
      if (!p) return;

      let minVal = null;
      if (duracaoCalc === "24h" && p.valor_minimo_24h) minVal = p.valor_minimo_24h;
      else if (duracaoCalc === "12h" && p.valor_minimo_12h) minVal = p.valor_minimo_12h;
      else if (duracaoCalc === "8h" && p.valor_minimo_8h) minVal = p.valor_minimo_8h;

      const result = calcularPrecoPlantao({ regiao: pricingConfig, profissional: { valor_minimo_usado: minVal || null } });
      setCalcResult(result);
      
      if (!formData.houve_ajuste_manual) {
        setFormData(prev => ({ 
          ...prev, 
          valor_profissional: result.valor_profissional.toString(),
          taxa_zelare: result.taxa_zelare.toString(),
          total_familia: result.total_familia.toString()
        }));
      }
    } else {
      setCalcResult(null);
    }
  }, [formData.profissional_id, pricingConfig, duracaoCalc, profissionaisDisponiveis, formData.houve_ajuste_manual]);

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (tipoAgendamento === "unico") {
      if (!formData.data_plantao) return setError("Preencha a data.");
    } else {
      if (!formData.data_inicial || !formData.data_final) return setError("Preencha o período inicial e final.");
      if (formData.dias_semana.length === 0) return setError("Selecione pelo menos um dia da semana.");
      if (new Date(formData.data_inicial) > new Date(formData.data_final)) return setError("Data inicial não pode ser maior que final.");
    }
    if (!formData.horario_inicio || !formData.horario_fim) return setError("Preencha os horários.");
    setError(null);
    setStep(2);
  };

  const handleNextStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.profissional_id) return setError("Selecione o profissional.");
    if (!formData.valor_profissional || !formData.taxa_zelare) return setError("Valores inválidos.");
    if (formData.houve_ajuste_manual && formData.motivo_ajuste_manual.length < 5) return setError("Justifique o ajuste manual.");
    
    setError(null);
    
    if (tipoAgendamento === "pacote") {
      setIsSubmitting(true);
      const res = await previewPlantoesEmLote({
        profissional_id: formData.profissional_id,
        data_inicial: formData.data_inicial,
        data_final: formData.data_final,
        dias_semana: formData.dias_semana,
        horario_inicio: formData.horario_inicio,
        horario_fim: formData.horario_fim,
        valor_profissional: parseFloat(formData.valor_profissional),
        taxa_zelare: parseFloat(formData.taxa_zelare),
        total_familia: parseFloat(formData.total_familia)
      });
      setIsSubmitting(false);

      if (res.error) {
        setError(res.error);
        return;
      }
      setPreviewResult(res);
      setStep(3); // Preview de Conflitos
    } else {
      setStep(4); // Confirmação Final Unica
    }
  };

  const handleCreateUnico = async () => {
    setIsSubmitting(true);
    const [y, m, d] = formData.data_plantao.split("-");
    const dataStr = `${d}/${m}/${y}`;

    const res = await createPlantao({
      solicitacao_id: solicitacaoId,
      profissional_id: formData.profissional_id,
      data_plantao: dataStr,
      horario_inicio: formData.horario_inicio,
      horario_fim: formData.horario_fim,
      duracao: duracaoCalc,
      valor_profissional: parseFloat(formData.valor_profissional),
      taxa_zelare: parseFloat(formData.taxa_zelare),
      total_familia: parseFloat(formData.total_familia),
      houve_ajuste_manual: formData.houve_ajuste_manual,
      motivo_ajuste_manual: formData.motivo_ajuste_manual
    });
    setIsSubmitting(false);
    if (res.error) setError(res.error);
    else setIsOpen(false);
  };

  const handleCreatePacote = async () => {
    setIsSubmitting(true);
    const res = await createPlantoesEmLote({
      solicitacao_id: solicitacaoId,
      profissional_id: formData.profissional_id,
      data_inicial: formData.data_inicial,
      data_final: formData.data_final,
      dias_semana: formData.dias_semana,
      horario_inicio: formData.horario_inicio,
      horario_fim: formData.horario_fim,
      duracao_str: duracaoCalc,
      valor_profissional: parseFloat(formData.valor_profissional),
      taxa_zelare: parseFloat(formData.taxa_zelare),
      total_familia: parseFloat(formData.total_familia),
      datas_aprovadas: previewResult?.disponiveis || []
    });
    setIsSubmitting(false);
    if (res.error) setError(res.error);
    else setIsOpen(false);
  };

  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="w-full py-2 bg-[#8ECADF] text-[#2F3437] rounded-lg text-sm font-bold hover:brightness-95 transition-all shadow-sm flex items-center justify-center gap-2">
        <CalendarClock className="w-4 h-4" /> Agendar Plantão ou Pacote
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2F3437]/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden my-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FAFAF7]">
              <h2 className="text-lg font-bold text-[#2F3437]">
                {step === 1 && "Configuração de Data"}
                {step === 2 && "Profissional e Valores"}
                {step === 3 && "Revisão de Conflitos do Pacote"}
                {step === 4 && "Confirmação Final"}
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-[#6B7280] hover:bg-gray-100 p-1 rounded-md"><X className="w-5 h-5" /></button>
            </div>
            
            {/* STEP 1 */}
            {step === 1 && (
              <form onSubmit={handleNextStep1} className="p-6 overflow-y-auto space-y-6">
                {error && <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-xl flex gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

                <div className="flex gap-4 p-1 bg-gray-100 rounded-xl">
                  <button type="button" onClick={() => setTipoAgendamento("unico")} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${tipoAgendamento === "unico" ? "bg-white text-[#2F3437] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    <CalendarIcon className="w-4 h-4" /> Dia Único
                  </button>
                  <button type="button" onClick={() => setTipoAgendamento("pacote")} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${tipoAgendamento === "pacote" ? "bg-[#8ECADF] text-[#2F3437] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    <CalendarDays className="w-4 h-4" /> Pacote / Recorrente
                  </button>
                </div>

                {tipoAgendamento === "unico" ? (
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Data do Plantão</label>
                    <input required type="date" value={formData.data_plantao} onChange={(e) => setFormData({...formData, data_plantao: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border rounded-xl" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Data Inicial</label>
                        <input required type="date" value={formData.data_inicial} onChange={(e) => setFormData({...formData, data_inicial: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border rounded-xl" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Data Final</label>
                        <input required type="date" value={formData.data_final} onChange={(e) => setFormData({...formData, data_final: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border rounded-xl" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#6B7280] uppercase mb-2">Dias da Semana na Casa</label>
                      <div className="flex flex-wrap gap-2">
                        {DIAS.map(d => (
                          <button key={d.id} type="button" onClick={() => toggleDia(d.id)} className={`px-3 py-2 rounded-lg text-xs font-bold border flex items-center gap-1 ${formData.dias_semana.includes(d.id) ? 'bg-[#A8D5BA] border-[#A8D5BA] text-gray-900' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                            {formData.dias_semana.includes(d.id) ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />} {d.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Horário Início</label>
                    <input required type="time" value={formData.horario_inicio} onChange={(e) => setFormData({...formData, horario_inicio: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Horário Fim</label>
                    <input required type="time" value={formData.horario_fim} onChange={(e) => setFormData({...formData, horario_fim: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border rounded-xl" />
                  </div>
                </div>

                <button type="submit" className="w-full py-3 bg-[#8ECADF] text-[#2F3437] rounded-xl font-bold">Avançar</button>
              </form>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <form onSubmit={handleNextStep2} className="p-6 overflow-y-auto space-y-6">
                {error && <div className="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-xl flex gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}

                <div className="relative">
                  <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5 flex justify-between">
                    <span>Selecionar Profissional</span>
                  </label>
                  <input type="text" placeholder="Buscar nome..." value={busca} onChange={e => { setBusca(e.target.value); setFormData({...formData, profissional_id: ""}); }} className="w-full px-3 py-3 bg-gray-50 border rounded-xl" />
                  
                  {(!formData.profissional_id && busca.length > 0) && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {profsFiltradosParaDropdown.map(p => (
                        <div key={p.id} className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0" onClick={() => { setFormData({...formData, profissional_id: p.id}); setBusca(p.nome_completo); }}>
                          <p className="font-bold text-sm">{p.nome_completo}</p>
                          <p className="text-[10px] text-gray-500">{p.cidade} • {p.categoria_profissional}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {calcResult && (
                  <div className="bg-[#FAFAF7] p-4 rounded-xl border border-gray-100 space-y-4">
                    <p className="text-xs font-bold text-[#2F3437] uppercase text-center bg-gray-200/50 py-1 rounded">Valores (Por Plantão/Dia)</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Repasse (R$)</label>
                        <input required type="number" step="0.01" value={formData.valor_profissional} onChange={e => { setFormData({...formData, valor_profissional: e.target.value, houve_ajuste_manual: true}); }} className="w-full px-2 py-2 border rounded-lg text-sm text-green-700 font-bold" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Taxa Zelare (R$)</label>
                        <input required type="number" step="0.01" value={formData.taxa_zelare} onChange={e => { setFormData({...formData, taxa_zelare: e.target.value, houve_ajuste_manual: true}); }} className="w-full px-2 py-2 border rounded-lg text-sm text-gray-700 font-bold" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Total a Cobrar (R$)</label>
                      <input required type="number" step="0.01" value={formData.total_familia} onChange={e => { setFormData({...formData, total_familia: e.target.value, houve_ajuste_manual: true}); }} className="w-full px-2 py-3 border border-[#8ECADF] bg-white rounded-lg text-lg text-[#2F3437] font-black" />
                    </div>
                    {formData.houve_ajuste_manual && (
                      <input type="text" placeholder="Motivo do ajuste manual..." value={formData.motivo_ajuste_manual} onChange={e => setFormData({...formData, motivo_ajuste_manual: e.target.value})} className="w-full p-2 border border-orange-200 rounded-lg text-xs" />
                    )}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold">Voltar</button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 bg-[#8ECADF] text-[#2F3437] rounded-xl font-bold">
                    {isSubmitting ? "Carregando..." : (tipoAgendamento === "pacote" ? "Verificar Conflitos" : "Resumo Final")}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3 (Apenas Pacotes) */}
            {step === 3 && tipoAgendamento === "pacote" && previewResult && (
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
                  <p className="text-3xl font-black text-[#2F3437]">{previewResult.disponiveis.length}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">Datas Livres Encontradas</p>
                </div>

                {previewResult.conflitos.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-xs font-bold text-red-800 flex items-center gap-1 mb-2"><AlertCircle className="w-4 h-4"/> Atenção: {previewResult.conflitos.length} datas com conflito de agenda.</p>
                    <p className="text-[10px] text-red-700">O sistema criará apenas os {previewResult.disponiveis.length} plantões disponíveis e pulará automaticamente as seguintes datas ocupadas:</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {previewResult.conflitos.map((c: any, i: number) => (
                        <span key={i} className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">{c.data_plantao_str}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-[#FAFAF7] p-4 border border-gray-100 rounded-xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase">Resumo Financeiro Consolidado do Pacote</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs font-bold text-gray-600">Total a Pagar (Família)</span>
                    <span className="text-xl font-black text-[#8ECADF]">{formatBRL(previewResult.total_familia)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] font-bold text-gray-500">Repasse ({previewResult.disponiveis.length} dias)</span>
                    <span className="text-xs font-bold text-green-700">{formatBRL(previewResult.valor_profissional_total)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold">Voltar</button>
                  <button onClick={handleCreatePacote} disabled={isSubmitting || previewResult.disponiveis.length === 0} className="flex-[2] py-3 bg-[#A8D5BA] text-[#2F3437] rounded-xl font-bold flex items-center justify-center gap-2">
                    {isSubmitting ? "Gerando..." : "Criar Pacote em Lote"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 (Apenas Único) */}
            {step === 4 && tipoAgendamento === "unico" && (
              <div className="p-6 overflow-y-auto space-y-6">
                <div className="space-y-4 bg-[#FAFAF7] p-5 rounded-2xl border border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Início</p>
                      <p className="font-bold text-[#2F3437]">{formData.data_plantao.split('-').reverse().join('/')} às {formData.horario_inicio}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Total Família</p>
                      <p className="font-black text-[#8ECADF] text-xl">{formatBRL(parseFloat(formData.total_familia))}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} disabled={isSubmitting} className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50">Voltar</button>
                  <button onClick={handleCreateUnico} disabled={isSubmitting} className="flex-[2] py-3 bg-[#A8D5BA] text-[#2F3437] rounded-xl text-sm font-bold hover:brightness-95 flex justify-center gap-2">
                    {isSubmitting ? "Salvando..." : <><CheckCircle2 className="w-5 h-5" /> Confirmar</>}
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
