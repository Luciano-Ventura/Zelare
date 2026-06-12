"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profissionalSchema, ProfissionalData } from "@/lib/schemas";
import { submitProfissional } from "@/app/actions";
import { maskPhone, maskCurrency } from "@/lib/masks";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Info } from "lucide-react";

function CadastroProfissionalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfissionalData>({
    resolver: zodResolver(profissionalSchema),
    defaultValues: {
      possui_formacao: false,
      possui_referencias: false,
    }
  });

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

  const onSubmit = async (data: ProfissionalData) => {
    setIsSubmitting(true);
    setErrorMsg("");
    console.log("submit_profissional", data);

    try {
      const res = await submitProfissional(data);
      if (res.success) {
        router.push("/obrigado?tipo=profissional");
      } else {
        setErrorMsg(res.error || "Ocorreu um erro ao enviar o cadastro.");
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
          <div className="bg-green-light/10 p-8 border-b border-sand-light/50">
            <h1 className="text-3xl font-bold tracking-tight text-text-main mb-3">Cadastro de Profissional</h1>
            <p className="text-text-secondary text-base">
              Preencha o formulário abaixo para fazer parte da rede de profissionais parceiros da Zelare.
            </p>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cidade" className="block text-sm font-medium text-text-main mb-1">Cidade que reside</label>
                  <input
                    id="cidade"
                    type="text"
                    {...register("cidade")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: Palhoça"
                  />
                  {errors.cidade && <p className="mt-1 text-xs text-red-500">{errors.cidade.message}</p>}
                </div>
                <div>
                  <label htmlFor="bairro" className="block text-sm font-medium text-text-main mb-1">Bairro que reside</label>
                  <input
                    id="bairro"
                    type="text"
                    {...register("bairro")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: Pedra Branca"
                  />
                  {errors.bairro && <p className="mt-1 text-xs text-red-500">{errors.bairro.message}</p>}
                </div>
              </div>
            </div>

            {/* Perfil Profissional */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-main border-b border-gray-100 pb-2">Seu Perfil Profissional</h2>
              
              <div>
                <label htmlFor="categoria_profissional" className="block text-sm font-medium text-text-main mb-1">Qual a sua formação/categoria principal?</label>
                <select
                  id="categoria_profissional"
                  {...register("categoria_profissional")}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all bg-white"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="Cuidador de Idosos">Cuidador de Idosos</option>
                  <option value="Babá">Babá</option>
                  <option value="Técnico de Enfermagem">Técnico de Enfermagem</option>
                  <option value="Enfermeiro">Enfermeiro</option>
                  <option value="Fisioterapeuta">Fisioterapeuta</option>
                  <option value="Outro">Outro (especificar nas observações)</option>
                </select>
                {errors.categoria_profissional && <p className="mt-1 text-xs text-red-500">{errors.categoria_profissional.message}</p>}
              </div>

              <div>
                <label htmlFor="tipos_atendimento" className="block text-sm font-medium text-text-main mb-1">Tipos de atendimento que você aceita fazer</label>
                <input
                  id="tipos_atendimento"
                  type="text"
                  {...register("tipos_atendimento")}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                  placeholder="Ex: Apenas idosos, Pessoas acamadas, Crianças, Pós-cirúrgico..."
                />
                {errors.tipos_atendimento && <p className="mt-1 text-xs text-red-500">{errors.tipos_atendimento.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tempo_experiencia" className="block text-sm font-medium text-text-main mb-1">Tempo de experiência</label>
                  <input
                    id="tempo_experiencia"
                    type="text"
                    {...register("tempo_experiencia")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: 3 anos, 6 meses, etc"
                  />
                  {errors.tempo_experiencia && <p className="mt-1 text-xs text-red-500">{errors.tempo_experiencia.message}</p>}
                </div>
                <div className="flex items-center h-full pt-6">
                  <div className="flex items-center gap-3">
                    <input
                      id="possui_formacao"
                      type="checkbox"
                      {...register("possui_formacao")}
                      className="h-5 w-5 rounded border-gray-300 text-blue-light focus:ring-blue-light"
                    />
                    <label htmlFor="possui_formacao" className="text-sm font-medium text-text-main">
                      Possuo curso ou formação na área
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="descricao_experiencia" className="block text-sm font-medium text-text-main mb-1">Descreva brevemente sua experiência</label>
                <textarea
                  id="descricao_experiencia"
                  {...register("descricao_experiencia")}
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all resize-none"
                  placeholder="Onde já trabalhou? Quais casos tem mais facilidade de atender?"
                />
              </div>
            </div>

            {/* Disponibilidade */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-main border-b border-gray-100 pb-2">Atuação e Disponibilidade</h2>
              
              <div>
                <label htmlFor="disponibilidade" className="block text-sm font-medium text-text-main mb-1">Sua disponibilidade de horários</label>
                <input
                  id="disponibilidade"
                  type="text"
                  {...register("disponibilidade")}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                  placeholder="Ex: Apenas finais de semana, Seg a Sex diurno, Plantão 12x36..."
                />
                {errors.disponibilidade && <p className="mt-1 text-xs text-red-500">{errors.disponibilidade.message}</p>}
              </div>

              <div>
                <label htmlFor="regioes_atende" className="block text-sm font-medium text-text-main mb-1">Em quais regiões/cidades você tem disponibilidade para ir?</label>
                <input
                  id="regioes_atende"
                  type="text"
                  {...register("regioes_atende")}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                  placeholder="Ex: Apenas Centro de Floripa, ou São José e Palhoça"
                />
                {errors.regioes_atende && <p className="mt-1 text-xs text-red-500">{errors.regioes_atende.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="valor_medio" className="block text-sm font-medium text-text-main mb-1">Valor médio cobrado (R$)</label>
                  <input
                    id="valor_medio"
                    type="text"
                    {...register("valor_medio", {
                      onChange: (e) => {
                        e.target.value = maskCurrency(e.target.value);
                      }
                    })}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: R$ 150,00 por plantão"
                  />
                </div>
                <div className="flex items-center h-full pt-6">
                  <div className="flex items-center gap-3">
                    <input
                      id="possui_referencias"
                      type="checkbox"
                      {...register("possui_referencias")}
                      className="h-5 w-5 rounded border-gray-300 text-blue-light focus:ring-blue-light"
                    />
                    <label htmlFor="possui_referencias" className="text-sm font-medium text-text-main">
                      Tenho referências de trabalhos anteriores
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="observacoes" className="block text-sm font-medium text-text-main mb-1">Observações adicionais</label>
                <textarea
                  id="observacoes"
                  {...register("observacoes")}
                  rows={2}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all resize-none"
                  placeholder="Algo mais que precisamos saber sobre você?"
                />
              </div>
            </div>

            {/* Aceites */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-start gap-3">
                <input
                  id="veracity_accepted"
                  type="checkbox"
                  {...register("veracity_accepted")}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-light focus:ring-blue-light"
                />
                <div>
                  <label htmlFor="veracity_accepted" className="text-sm text-text-secondary">
                    Declaro que todas as informações preenchidas acima são verdadeiras e podem ser comprovadas.
                  </label>
                  {errors.veracity_accepted && <p className="mt-1 text-xs text-red-500">{errors.veracity_accepted.message}</p>}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="contact_accepted"
                  type="checkbox"
                  {...register("contact_accepted")}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-light focus:ring-blue-light"
                />
                <div>
                  <label htmlFor="contact_accepted" className="text-sm text-text-secondary">
                    Concordo em receber mensagens da equipe da Zelare via WhatsApp para avaliação e recebimento de oportunidades de plantão.
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
                    Li e aceito a <Link href="/politica-de-privacidade" className="text-blue-light hover:underline" target="_blank">Política de Privacidade</Link>.
                  </label>
                  {errors.privacy_accepted && <p className="mt-1 text-xs text-red-500">{errors.privacy_accepted.message}</p>}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center rounded-2xl bg-blue-light px-8 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-blue-light/30 transition-all hover:-translate-y-1 hover:bg-blue-light/90 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando cadastro...
                  </>
                ) : (
                  "Enviar meu cadastro"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CadastroProfissionalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-light" /></div>}>
      <CadastroProfissionalForm />
    </Suspense>
  );
}
