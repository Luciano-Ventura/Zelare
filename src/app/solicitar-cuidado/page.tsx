"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { familiaSchema, FamiliaData } from "@/lib/schemas";
import { submitFamilia } from "@/app/actions";
import { maskPhone, maskCurrency } from "@/lib/masks";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Info } from "lucide-react";

function SolicitarCuidadoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FamiliaData>({
    resolver: zodResolver(familiaSchema),
    defaultValues: {
      e_urgente: false,
    }
  });

  // Capture UTM parameters
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

  const onSubmit = async (data: FamiliaData) => {
    setIsSubmitting(true);
    setErrorMsg("");
    // Submit logic

    try {
      const res = await submitFamilia(data);
      if (res.success) {
        router.push("/obrigado?tipo=familia");
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
                Preencha o formulário abaixo para que nossa equipe entenda sua necessidade e encontre o profissional ideal.
              </p>
            </div>
            <Link 
              href="/acompanhar" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-600 shadow-sm border border-blue-100 hover:bg-blue-50 transition-colors"
            >
              Já solicitou um cuidado? Acompanhe aqui
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3">
                <Info className="h-5 w-5 shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            {/* Dados Pessoais */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-main border-b border-gray-100 pb-2">Seus dados</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nome_completo" className="block text-sm font-medium text-text-main mb-1">Nome completo</label>
                  <input
                    id="nome_completo"
                    type="text"
                    data-testid="familia-nome"
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
                    data-testid="familia-whatsapp"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-text-main mb-1 flex justify-between items-center">
                    CEP {isFetchingCep && <span className="text-blue-500 font-normal text-xs">buscando...</span>}
                  </label>
                  <input
                    id="cep"
                    type="text"
                    data-testid="familia-cep"
                    {...register("cep", {
                      onChange: async (e) => {
                        const rawCep = e.target.value;
                        const cleanCep = rawCep.replace(/\D/g, "");
                        if (cleanCep.length === 8) {
                          setIsFetchingCep(true);
                          try {
                            const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                            const data = await res.json();
                            if (!data.erro) {
                              setValue("endereco", data.logradouro);
                              setValue("bairro", data.bairro);
                              setValue("cidade", data.localidade);
                              setValue("estado", data.uf);
                            }
                          } catch (err) {
                            console.error("Erro ao buscar CEP", err);
                          }
                          setIsFetchingCep(false);
                        }
                      }
                    })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: 88000-000"
                    maxLength={9}
                  />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

            {/* Dados do Cuidado */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-main border-b border-gray-100 pb-2">Sobre o cuidado</h2>
              
              <div>
                <label htmlFor="para_quem" className="block text-sm font-medium text-text-main mb-1">Para quem é o cuidado?</label>
                <input
                  id="para_quem"
                  type="text"
                  {...register("para_quem")}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                  placeholder="Ex: Minha mãe, 82 anos, acamada"
                />
                {errors.para_quem && <p className="mt-1 text-xs text-red-500">{errors.para_quem.message}</p>}
              </div>

              <div>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="duracao_plantao" className="block text-sm font-medium text-text-main mb-1">Frequência da demanda</label>
                  <input
                    id="duracao_plantao"
                    type="text"
                    {...register("duracao_plantao")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: Apenas 1 dia, ou de Seg a Sex"
                  />
                  {errors.duracao_plantao && <p className="mt-1 text-xs text-red-500">{errors.duracao_plantao.message}</p>}
                </div>
                <div>
                  <label htmlFor="preferencia_atendimento" className="block text-sm font-medium text-text-main mb-1">Preferência de atendimento</label>
                  <select
                    id="preferencia_atendimento"
                    {...register("preferencia_atendimento")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all bg-white"
                  >
                    <option value="">Selecione (Opcional)</option>
                    <option value="Quero receber uma opção mais econômica">Quero receber uma opção mais econômica</option>
                    <option value="Quero priorizar profissional mais experiente">Quero priorizar profissional mais experiente</option>
                    <option value="Tenho urgência no atendimento">Tenho urgência no atendimento</option>
                    <option value="Quero atendimento recorrente">Quero atendimento recorrente</option>
                    <option value="Ainda não sei, preciso de orientação">Ainda não sei, preciso de orientação</option>
                  </select>
                  <p className="mt-2 text-xs text-text-secondary">
                    A Zelare irá analisar sua solicitação e informar o valor final antes da confirmação.
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="atividades_necessarias" className="block text-sm font-medium text-text-main mb-1">Quais atividades serão necessárias?</label>
                <textarea
                  id="atividades_necessarias"
                  {...register("atividades_necessarias")}
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all resize-none"
                  placeholder="Ex: Banho no leito, troca de fraldas, companhia, alimentação..."
                />
              </div>

              <div>
                <label htmlFor="observacoes" className="block text-sm font-medium text-text-main mb-1">Observações adicionais</label>
                <textarea
                  id="observacoes"
                  {...register("observacoes")}
                  rows={2}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all resize-none"
                  placeholder="Algo mais que precisamos saber? (Opcional)"
                />
              </div>

              <div className="flex items-center gap-3 bg-red-50/50 p-4 rounded-xl border border-red-100">
                <input
                  id="e_urgente"
                  type="checkbox"
                  {...register("e_urgente")}
                  className="h-5 w-5 rounded border-gray-300 text-blue-light focus:ring-blue-light"
                />
                <label htmlFor="e_urgente" className="text-sm font-medium text-red-700">
                  Este pedido é de urgência (para as próximas 24h)
                </label>
              </div>
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

            <div className="pt-4">
              <button
                type="submit"
                data-testid="familia-enviar"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center rounded-2xl bg-blue-light px-8 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-blue-light/30 transition-all hover:-translate-y-1 hover:bg-blue-light/90 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando solicitação...
                  </>
                ) : (
                  "Enviar solicitação"
                )}
              </button>
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
