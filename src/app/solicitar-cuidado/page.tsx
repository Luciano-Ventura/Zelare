"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { familiaSchema, FamiliaData } from "@/lib/schemas";
import { submitFamilia } from "@/app/actions";
import { maskPhone } from "@/lib/masks";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Info, ChevronRight, ChevronLeft } from "lucide-react";

function SolicitarCuidadoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [cepError, setCepError] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FamiliaData>({
    resolver: zodResolver(familiaSchema),
    defaultValues: {
      e_urgente: false,
    }
  });

  const formValues = watch();

  useEffect(() => {
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');
    const source = searchParams.get('source');

    if (utmSource) setValue('utm_source', utmSource);
    if (utmMedium) setValue('utm_medium', utmMedium);
    if (utmCampaign) setValue('utm_campaign', utmCampaign);
    if (source) setValue('source', source);
  }, [searchParams, setValue]);

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ["para_quem", "atividades_necessarias"];
    if (step === 2) fieldsToValidate = ["tipo_profissional", "duracao_plantao", "preferencia_atendimento"];
    if (step === 3) fieldsToValidate = ["data_desejada", "horario_desejado", "horario_fim", "e_urgente"];
    if (step === 4) fieldsToValidate = ["cep", "endereco", "numero", "complemento", "bairro", "cidade", "estado", "ponto_referencia"];
    if (step === 5) fieldsToValidate = ["nome_completo", "whatsapp", "observacoes", "contact_accepted", "privacy_accepted"];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data: FamiliaData) => {
    if (step !== 6) return;
    
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await submitFamilia(data);
      if (res.success) {
        router.push(`/obrigado?tipo=familia&codigo=${res.codigo}`);
      } else {
        setErrorMsg(res.error || "Ocorreu um erro ao enviar a solicitação.");
      }
    } catch (err) {
      setErrorMsg("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-text-main mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a página inicial
        </Link>

        <div className="bg-white rounded-3xl shadow-xl ring-1 ring-sand-light/50 overflow-hidden">
          <div className="bg-blue-light/10 p-8 border-b border-sand-light/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-text-main mb-3">Solicitar cuidado</h1>
              <p className="text-text-secondary text-base">
                Etapa {step} de {totalSteps}
              </p>
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div className="bg-blue-light h-2.5 rounded-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
              </div>
            </div>
            <Link 
              href="/acompanhar" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-600 shadow-sm border border-blue-100 hover:bg-blue-50 transition-colors"
            >
              Já solicitou? Acompanhe aqui
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3">
                <Info className="h-5 w-5 shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Step 1: Quem precisa de cuidado */}
            <div className={step === 1 ? "block" : "hidden"}>
              <h2 className="text-xl font-semibold text-text-main border-b border-gray-100 pb-2 mb-6">Quem precisa de cuidado?</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  "Idoso", "Criança", "Pessoa acamada", "Pós-cirúrgico", 
                  "Pessoa com Alzheimer, Parkinson ou demência", "Outro"
                ].map((option) => (
                  <label key={option} className={`border rounded-xl p-4 cursor-pointer transition-all ${formValues.para_quem === option ? 'border-blue-light bg-blue-50 ring-1 ring-blue-light' : 'border-gray-200 hover:border-blue-300'}`}>
                    <input 
                      type="radio" 
                      value={option} 
                      {...register("para_quem")} 
                      className="sr-only" 
                    />
                    <span className="text-text-main font-medium">{option}</span>
                  </label>
                ))}
              </div>
              {errors.para_quem && <p className="mt-1 text-xs text-red-500">{errors.para_quem.message}</p>}

              <div className="mt-4">
                <label htmlFor="atividades_necessarias" className="block text-sm font-medium text-text-main mb-1">Conte rapidamente a situação (Opcional)</label>
                <textarea
                  id="atividades_necessarias"
                  {...register("atividades_necessarias")}
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all resize-none"
                  placeholder="Ex: Precisa de ajuda para banho, alimentação e companhia."
                />
              </div>
            </div>

            {/* Step 2: Qual tipo de atendimento */}
            <div className={step === 2 ? "block" : "hidden"}>
              <h2 className="text-xl font-semibold text-text-main border-b border-gray-100 pb-2 mb-6">Qual tipo de atendimento?</h2>
              
              <div className="mb-6">
                <label htmlFor="tipo_profissional" className="block text-sm font-medium text-text-main mb-1">Tipo de profissional desejado</label>
                <select
                  id="tipo_profissional"
                  {...register("tipo_profissional")}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all bg-white"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="Cuidador de Idosos">Cuidador de Idosos</option>
                  <option value="Babá">Babá</option>
                  <option value="Técnico de Enfermagem">Técnico de Enfermagem</option>
                  <option value="Enfermeiro">Enfermeiro</option>
                  <option value="Outro">Outro (especificar nas observações)</option>
                </select>
                {errors.tipo_profissional && <p className="mt-1 text-xs text-red-500">{errors.tipo_profissional.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  "Algumas horas", "Plantão diurno", "Plantão noturno", 
                  "12 horas", "24 horas", "Atendimento recorrente", "Ainda não sei"
                ].map((option) => (
                  <label key={option} className={`border rounded-xl p-4 cursor-pointer transition-all ${formValues.duracao_plantao === option ? 'border-blue-light bg-blue-50 ring-1 ring-blue-light' : 'border-gray-200 hover:border-blue-300'}`}>
                    <input 
                      type="radio" 
                      value={option} 
                      {...register("duracao_plantao")} 
                      className="sr-only" 
                    />
                    <span className="text-text-main font-medium">{option}</span>
                  </label>
                ))}
              </div>
              {errors.duracao_plantao && <p className="mt-1 text-xs text-red-500">{errors.duracao_plantao.message}</p>}

              <div className="mt-4">
                <label htmlFor="preferencia_atendimento" className="block text-sm font-medium text-text-main mb-1">Preferência de atendimento (Opcional)</label>
                <select
                  id="preferencia_atendimento"
                  {...register("preferencia_atendimento")}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all bg-white"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="Quero uma opção mais econômica">Quero uma opção mais econômica</option>
                  <option value="Quero priorizar profissional mais experiente">Quero priorizar profissional mais experiente</option>
                  <option value="Tenho urgência">Tenho urgência</option>
                  <option value="Quero atendimento recorrente">Quero atendimento recorrente</option>
                  <option value="Preciso de orientação">Preciso de orientação</option>
                </select>
              </div>
            </div>

            {/* Step 3: Quando precisa */}
            <div className={step === 3 ? "block" : "hidden"}>
              <h2 className="text-xl font-semibold text-text-main border-b border-gray-100 pb-2 mb-6">Quando precisa?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="data_desejada" className="block text-sm font-medium text-text-main mb-1">Data de início</label>
                  <input
                    id="data_desejada"
                    type="date"
                    {...register("data_desejada")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                  />
                  {errors.data_desejada && <p className="mt-1 text-xs text-red-500">{errors.data_desejada.message}</p>}
                </div>
                <div>
                  <label htmlFor="horario_desejado" className="block text-sm font-medium text-text-main mb-1">Horário de Início</label>
                  <input
                    id="horario_desejado"
                    type="time"
                    {...register("horario_desejado")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                  />
                  {errors.horario_desejado && <p className="mt-1 text-xs text-red-500">{errors.horario_desejado.message}</p>}
                </div>
                <div>
                  <label htmlFor="horario_fim" className="block text-sm font-medium text-text-main mb-1">Horário de Término</label>
                  <input
                    id="horario_fim"
                    type="time"
                    {...register("horario_fim")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                  />
                  {errors.horario_fim && <p className="mt-1 text-xs text-red-500">{errors.horario_fim.message}</p>}
                </div>
              </div>

              <div className="flex items-center gap-3 bg-red-50/50 p-4 rounded-xl border border-red-100 mt-4">
                <input
                  id="e_urgente"
                  type="checkbox"
                  {...register("e_urgente")}
                  className="h-5 w-5 rounded border-gray-300 text-blue-light focus:ring-blue-light"
                />
                <label htmlFor="e_urgente" className="text-sm font-medium text-red-700">
                  Tenho urgência para as próximas 24 horas
                </label>
              </div>
            </div>

            {/* Step 4: Onde será */}
            <div className={step === 4 ? "block" : "hidden"}>
              <h2 className="text-xl font-semibold text-text-main border-b border-gray-100 pb-2 mb-6">Onde será o atendimento?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-text-main mb-1 flex justify-between items-center">
                    CEP {isFetchingCep && <span className="text-blue-500 font-normal text-xs">buscando...</span>}
                  </label>
                  <input
                    id="cep"
                    type="text"
                    {...register("cep", {
                      onChange: async (e) => {
                        const rawCep = e.target.value;
                        const cleanCep = rawCep.replace(/\D/g, "");
                        if (cleanCep.length === 8) {
                          setIsFetchingCep(true);
                          setCepError("");
                          try {
                            const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                            const data = await res.json();
                            if (!data.erro) {
                              setValue("endereco", data.logradouro);
                              setValue("bairro", data.bairro);
                              setValue("cidade", data.localidade);
                              setValue("estado", data.uf);
                            } else {
                              setCepError("Não conseguimos localizar esse CEP. Preencha o endereço manualmente.");
                            }
                          } catch (err) {
                            console.error("Erro ao buscar CEP", err);
                            setCepError("Não conseguimos localizar esse CEP. Preencha o endereço manualmente.");
                          }
                          setIsFetchingCep(false);
                        }
                      }
                    })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: 88000-000"
                    maxLength={9}
                  />
                  {cepError && <p className="mt-1 text-xs text-blue-600">{cepError}</p>}
                  {errors.cep && <p className="mt-1 text-xs text-red-500">{errors.cep.message}</p>}
                </div>
                <div>
                  <label htmlFor="endereco" className="block text-sm font-medium text-text-main mb-1">Endereço (Rua/Avenida)</label>
                  <input
                    id="endereco"
                    type="text"
                    {...register("endereco")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: Rua das Flores"
                  />
                  {errors.endereco && <p className="mt-1 text-xs text-red-500">{errors.endereco.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="numero" className="block text-sm font-medium text-text-main mb-1">Número</label>
                  <input
                    id="numero"
                    type="text"
                    {...register("numero")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: 123"
                  />
                  {errors.numero && <p className="mt-1 text-xs text-red-500">{errors.numero.message}</p>}
                </div>
                <div>
                  <label htmlFor="complemento" className="block text-sm font-medium text-text-main mb-1">Complemento (Opcional)</label>
                  <input
                    id="complemento"
                    type="text"
                    {...register("complemento")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: Apto 101, Bloco B"
                  />
                  {errors.complemento && <p className="mt-1 text-xs text-red-500">{errors.complemento.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="bairro" className="block text-sm font-medium text-text-main mb-1">Bairro</label>
                  <input
                    id="bairro"
                    type="text"
                    {...register("bairro")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: Centro"
                  />
                  {errors.bairro && <p className="mt-1 text-xs text-red-500">{errors.bairro.message}</p>}
                </div>
                <div>
                  <label htmlFor="cidade" className="block text-sm font-medium text-text-main mb-1">Cidade</label>
                  <input
                    id="cidade"
                    type="text"
                    {...register("cidade")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: São Paulo"
                  />
                  {errors.cidade && <p className="mt-1 text-xs text-red-500">{errors.cidade.message}</p>}
                </div>
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-text-main mb-1">Estado (UF)</label>
                  <input
                    id="estado"
                    type="text"
                    maxLength={2}
                    {...register("estado")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all uppercase"
                    placeholder="Ex: SC"
                  />
                  {errors.estado && <p className="mt-1 text-xs text-red-500">{errors.estado.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="ponto_referencia" className="block text-sm font-medium text-text-main mb-1">Ponto de Referência (Opcional)</label>
                <input
                  id="ponto_referencia"
                  type="text"
                  {...register("ponto_referencia")}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                  placeholder="Ex: Próximo ao supermercado Angeloni"
                />
                {errors.ponto_referencia && <p className="mt-1 text-xs text-red-500">{errors.ponto_referencia.message}</p>}
              </div>
            </div>

            {/* Step 5: Dados de contato */}
            <div className={step === 5 ? "block" : "hidden"}>
              <h2 className="text-xl font-semibold text-text-main border-b border-gray-100 pb-2 mb-6">Seus dados de contato</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="nome_completo" className="block text-sm font-medium text-text-main mb-1">Nome completo</label>
                  <input
                    id="nome_completo"
                    type="text"
                    {...register("nome_completo")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Seu nome"
                  />
                  {errors.nome_completo && <p className="mt-1 text-xs text-red-500">{errors.nome_completo.message}</p>}
                </div>
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-text-main mb-1">WhatsApp (com DDD)</label>
                  <input
                    id="whatsapp"
                    type="tel"
                    {...register("whatsapp", {
                      onChange: (e) => {
                        e.target.value = maskPhone(e.target.value);
                      }
                    })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: (48) 99999-9999"
                  />
                  {errors.whatsapp && <p className="mt-1 text-xs text-red-500">{errors.whatsapp.message}</p>}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="observacoes" className="block text-sm font-medium text-text-main mb-1">Observações adicionais (Opcional)</label>
                <textarea
                  id="observacoes"
                  {...register("observacoes")}
                  rows={2}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all resize-none"
                  placeholder="Algo mais que precisamos saber antes de entrar em contato?"
                />
              </div>

              {/* Aceites */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-start gap-3">
                  <input
                    id="contact_accepted"
                    type="checkbox"
                    {...register("contact_accepted")}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-light focus:ring-blue-light"
                  />
                  <div>
                    <label htmlFor="contact_accepted" className="text-sm text-text-secondary">
                      Concordo em receber mensagens da equipe da Zelare via WhatsApp para dar andamento à minha solicitação.
                    </label>
                    {errors.contact_accepted && <p className="mt-1 text-xs text-red-500">{errors.contact_accepted.message}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="privacy_accepted"
                    type="checkbox"
                    {...register("privacy_accepted")}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-light focus:ring-blue-light"
                  />
                  <div>
                    <label htmlFor="privacy_accepted" className="text-sm text-text-secondary">
                      Li e aceito os <Link href="/termos-de-uso" className="text-blue-light hover:underline" target="_blank">Termos de Uso</Link>, a <Link href="/politica-de-privacidade" className="text-blue-light hover:underline" target="_blank">Política de Privacidade</Link> e a <Link href="/politica-de-cancelamento" className="text-blue-light hover:underline" target="_blank">Política de Cancelamento</Link>.
                    </label>
                    {errors.privacy_accepted && <p className="mt-1 text-xs text-red-500">{errors.privacy_accepted.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 6: Revisão */}
            <div className={step === 6 ? "block" : "hidden"}>
              <h2 className="text-xl font-semibold text-text-main border-b border-gray-100 pb-2 mb-6">Revisão</h2>
              
              <div className="bg-sand-light/10 p-6 rounded-2xl mb-6 space-y-4 text-sm text-text-main">
                <p><strong>Quem precisa:</strong> {formValues.para_quem}</p>
                <p><strong>Tipo de profissional:</strong> {formValues.tipo_profissional}</p>
                <p><strong>Atendimento:</strong> {formValues.duracao_plantao}</p>
                <p><strong>Data/Horário:</strong> {formValues.data_desejada} das {formValues.horario_desejado} às {formValues.horario_fim}</p>
                <p><strong>Endereço:</strong> {formValues.endereco}, {formValues.numero} - {formValues.cidade}/{formValues.estado}</p>
                <p><strong>Contato:</strong> {formValues.nome_completo} ({formValues.whatsapp})</p>
              </div>

              <div className="text-center p-4 bg-blue-light/10 text-blue-800 rounded-xl mb-6">
                <p className="font-medium">A Zelare irá analisar sua solicitação e informar o valor final antes da confirmação.</p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-6 flex items-center justify-between border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center text-text-secondary hover:text-text-main transition-colors px-4 py-2 font-medium"
                >
                  <ChevronLeft className="mr-1 h-5 w-5" />
                  Voltar
                </button>
              ) : (
                <div></div>
              )}

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center rounded-2xl bg-blue-light px-6 py-3 font-semibold text-white shadow-md transition-transform hover:-translate-y-1 hover:bg-blue-light/90"
                >
                  Próxima etapa
                  <ChevronRight className="ml-1 h-5 w-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center rounded-2xl bg-blue-light px-8 py-3 font-semibold text-white shadow-lg shadow-blue-light/30 transition-all hover:-translate-y-1 hover:bg-blue-light/90 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar solicitação"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SolicitarCuidadoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-light" /></div>}>
      <SolicitarCuidadoForm />
    </Suspense>
  );
}
