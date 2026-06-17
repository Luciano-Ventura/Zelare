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
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfissionalData>({
    resolver: zodResolver(profissionalSchema) as any,
    defaultValues: {
      possui_formacao: false,
      possui_referencias: false,
      raio_atendimento_km: 10,
      aceita_negociacao: true,
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
    // Submit logic

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
          <div className="bg-green-light/10 p-8 border-b border-sand-light/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-text-main mb-3">Cadastro de Profissional</h1>
              <p className="text-text-secondary text-base">
                Preencha o formulário abaixo para fazer parte da rede de profissionais parceiros da Zelare.
              </p>
            </div>
            <Link 
              href="/profissional/login" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-600 shadow-sm border border-blue-100 hover:bg-blue-50 transition-colors"
            >
              Já tem cadastro? Entrar no painel
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
                    data-testid="profissional-nome"
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
                    data-testid="profissional-whatsapp"
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
            </div>

            {/* Localização e raio de atendimento */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-text-main border-b border-gray-100 pb-2">Localização e raio de atendimento</h2>
              <p className="text-sm text-text-secondary">
                Informe seu endereço base ou região de partida. Ele será usado apenas pela operação da Zelare para encontrar plantões próximos. Seu endereço completo não será exibido publicamente.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cep_base" className="block text-sm font-medium text-text-main mb-1 flex justify-between items-center">
                    CEP {isFetchingCep && <span className="text-blue-500 font-normal text-xs">Buscando endereço...</span>}
                  </label>
                  <input
                    id="cep_base"
                    type="text"
                    data-testid="profissional-cep"
                    {...register("cep_base", {
                      onChange: async (e) => {
                        const rawCep = e.target.value;
                        const cleanCep = rawCep.replace(/\D/g, "");
                        if (cleanCep.length === 8) {
                          setIsFetchingCep(true);
                          try {
                            const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                            const data = await res.json();
                            if (!data.erro) {
                              setValue("endereco_base", data.logradouro);
                              setValue("bairro", data.bairro);
                              setValue("cidade", data.localidade);
                              setValue("estado", data.uf);
                            } else {
                              alert("Não conseguimos localizar esse CEP. Preencha o endereço manualmente.");
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
                  />
                  {errors.cep_base && <p className="mt-1 text-xs text-red-500">{errors.cep_base.message}</p>}
                </div>
                <div>
                  <label htmlFor="endereco_base" className="block text-sm font-medium text-text-main mb-1">Endereço base (Rua/Avenida)</label>
                  <input
                    id="endereco_base"
                    type="text"
                    {...register("endereco_base")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: Rua das Flores"
                  />
                  {errors.endereco_base && <p className="mt-1 text-xs text-red-500">{errors.endereco_base.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="numero_base" className="block text-sm font-medium text-text-main mb-1">Número</label>
                  <input
                    id="numero_base"
                    type="text"
                    {...register("numero_base")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: 123"
                  />
                  {errors.numero_base && <p className="mt-1 text-xs text-red-500">{errors.numero_base.message}</p>}
                </div>
                <div>
                  <label htmlFor="complemento_base" className="block text-sm font-medium text-text-main mb-1">Complemento (Opcional)</label>
                  <input
                    id="complemento_base"
                    type="text"
                    {...register("complemento_base")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: Apto 101, Bloco B"
                  />
                  {errors.complemento_base && <p className="mt-1 text-xs text-red-500">{errors.complemento_base.message}</p>}
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
                <label htmlFor="raio_atendimento_km" className="block text-sm font-medium text-text-main mb-1">Raio de atendimento</label>
                <select
                  id="raio_atendimento_km"
                  {...register("raio_atendimento_km", { valueAsNumber: true })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all bg-white"
                >
                  <option value={5}>Até 5 km</option>
                  <option value={10}>Até 10 km (Recomendado)</option>
                  <option value={15}>Até 15 km</option>
                  <option value={20}>Até 20 km</option>
                  <option value={30}>Até 30 km</option>
                  <option value={50}>Até 50 km</option>
                </select>
                {errors.raio_atendimento_km && <p className="mt-1 text-xs text-red-500">{errors.raio_atendimento_km.message}</p>}
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
              <div className="space-y-4 pt-4 border-t border-gray-100 mt-4">
                <h3 className="text-lg font-semibold text-text-main">Sua Precificação (Mínimos)</h3>
                <p className="text-sm text-text-secondary">
                  Estes valores serão usados pela nossa plataforma internamente para garantir que você não receba convites com valores abaixo do seu mínimo desejado. Eles não ficam públicos para as famílias.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="valor_minimo_4h" className="block text-xs font-medium text-text-main mb-1">Mínimo para 4h (R$)</label>
                    <input id="valor_minimo_4h" type="number" step="0.01" {...register("valor_minimo_4h", { valueAsNumber: true })} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-light outline-none" placeholder="0.00" />
                  </div>
                  <div>
                    <label htmlFor="valor_minimo_6h" className="block text-xs font-medium text-text-main mb-1">Mínimo para 6h (R$)</label>
                    <input id="valor_minimo_6h" type="number" step="0.01" {...register("valor_minimo_6h", { valueAsNumber: true })} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-light outline-none" placeholder="0.00" />
                  </div>
                  <div>
                    <label htmlFor="valor_minimo_8h" className="block text-xs font-medium text-text-main mb-1">Mínimo para 8h (R$)</label>
                    <input id="valor_minimo_8h" type="number" step="0.01" {...register("valor_minimo_8h", { valueAsNumber: true })} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-light outline-none" placeholder="0.00" />
                  </div>
                  <div>
                    <label htmlFor="valor_minimo_12h" className="block text-xs font-medium text-text-main mb-1">Mínimo para 12h (R$)</label>
                    <input id="valor_minimo_12h" type="number" step="0.01" {...register("valor_minimo_12h", { valueAsNumber: true })} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-light outline-none" placeholder="0.00" />
                  </div>
                  <div>
                    <label htmlFor="valor_minimo_24h" className="block text-xs font-medium text-text-main mb-1">Mínimo para 24h (R$)</label>
                    <input id="valor_minimo_24h" type="number" step="0.01" {...register("valor_minimo_24h", { valueAsNumber: true })} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-light outline-none" placeholder="0.00" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="adicional_noturno" className="block text-xs font-medium text-text-main mb-1">Adicional Noturno Fixo (R$)</label>
                    <input id="adicional_noturno" type="number" step="0.01" {...register("adicional_noturno", { valueAsNumber: true })} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-light outline-none" placeholder="0.00" />
                  </div>
                  <div>
                    <label htmlFor="adicional_urgencia" className="block text-xs font-medium text-text-main mb-1">Adicional de Urgência (R$)</label>
                    <input id="adicional_urgencia" type="number" step="0.01" {...register("adicional_urgencia", { valueAsNumber: true })} className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-blue-light outline-none" placeholder="0.00" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input id="aceita_negociacao" type="checkbox" {...register("aceita_negociacao")} className="h-5 w-5 rounded border-gray-300 text-blue-light focus:ring-blue-light" />
                  <label htmlFor="aceita_negociacao" className="text-sm font-medium text-text-main">
                    Aceito negociar esses valores em caso de plantões recorrentes ou ofertas da família
                  </label>
                </div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="pix_tipo" className="block text-sm font-medium text-text-main mb-1">Tipo de Chave Pix (Opcional)</label>
                  <select
                    id="pix_tipo"
                    {...register("pix_tipo")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all bg-white"
                  >
                    <option value="">Selecione...</option>
                    <option value="CPF/CNPJ">CPF/CNPJ</option>
                    <option value="Celular">Celular</option>
                    <option value="E-mail">E-mail</option>
                    <option value="Chave Aleatória">Chave Aleatória</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="pix_chave" className="block text-sm font-medium text-text-main mb-1">Chave Pix para repasses (Opcional)</label>
                  <input
                    id="pix_chave"
                    type="text"
                    {...register("pix_chave")}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all"
                    placeholder="Ex: seu-email@email.com"
                  />
                  <p className="text-[10px] text-text-secondary mt-1">Usada para repassar seus pagamentos. Famílias não terão acesso.</p>
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
                    Li e aceito os <Link href="/termos-de-uso" className="text-blue-light hover:underline" target="_blank">Termos de Uso</Link>, a <Link href="/politica-de-privacidade" className="text-blue-light hover:underline" target="_blank">Política de Privacidade</Link> e a <Link href="/politica-de-cancelamento" className="text-blue-light hover:underline" target="_blank">Política de Cancelamento</Link>.
                  </label>
                  {errors.privacy_accepted && <p className="mt-1 text-xs text-red-500">{errors.privacy_accepted.message}</p>}
                </div>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-indigo-900 mb-1">Próximos passos</h4>
                  <p className="text-sm text-indigo-800">
                    Após o cadastro, a equipe da Zelare entrará em contato pelo WhatsApp para validar suas informações e solicitar documentos necessários, como documento de identificação, comprovantes e antecedentes, quando aplicável. <strong>Seu cadastro passará por análise antes de receber oportunidades.</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                data-testid="profissional-enviar"
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
