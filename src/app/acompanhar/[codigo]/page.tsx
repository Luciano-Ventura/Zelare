import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { ArrowLeft, Clock, CheckCircle2, User, Calendar, MapPin, AlertCircle, Star, Heart } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { PixCopyArea } from "./PixCopyArea";
import FormAvaliacao from "./FormAvaliacao";
import { getPublicSolicitacaoByCodigo } from "@/lib/security/sanitization";
import { checkRateLimit } from "@/lib/security/rate-limit";

export const revalidate = 0; // Dynamic page

export default async function AcompanhamentoDetalhesPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params;
  
  // Appply Rate Limit
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  
  const rateLimit = checkRateLimit(ip, 20, 60000); // 20 attempts per minute
  if (!rateLimit.success) {
    return (
      <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-16 w-16 text-orange-400 mb-4" />
        <h1 className="text-2xl font-bold text-text-main mb-2">Muitas tentativas</h1>
        <p className="text-text-secondary mb-6">Por favor, aguarde um momento antes de tentar novamente.</p>
      </div>
    );
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(codigo);
  
  const solicitacao = await getPublicSolicitacaoByCodigo(codigo);

  if (solicitacao && isUuid && solicitacao.codigo_acompanhamento) {
    redirect(`/acompanhar/${solicitacao.codigo_acompanhamento}`);
  }

  let pagamento = null;
  let plantoes: any[] = [];

  if (solicitacao) {
    if (solicitacao.pagamentos) {
      // Pega o último pagamento pending
      pagamento = solicitacao.pagamentos
        .filter((p: any) => p.status === "PENDING")
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] || null;
    }
    if (solicitacao.plantoes) {
      plantoes = solicitacao.plantoes;
    }
  }

  // Fetch se já foi avaliado
  const { data: avaliacaoFeita } = solicitacao ? await supabaseAdmin
    .from('avaliacoes')
    .select('id')
    .eq('solicitacao_id', solicitacao.id)
    .maybeSingle() : { data: null };

  if (!solicitacao) {
    return (
      <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-text-main mb-2">Solicitação não encontrada</h1>
        <p className="text-text-secondary mb-6">Não localizamos nenhuma solicitação com o código <strong>{codigo}</strong>.</p>
        <Link href="/acompanhar" className="inline-flex items-center justify-center rounded-xl bg-blue-light px-6 py-3 font-semibold text-white transition-all hover:bg-blue-light/90">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tentar outro código
        </Link>
      </div>
    );
  }

  // Define steps
  const steps = [
    { id: 'novo', label: 'Recebido', description: 'Recebemos sua solicitação.' },
    { id: 'analise', label: 'Em Análise', description: 'Buscando profissionais.' },
    { id: 'aguardando_pagamento', label: 'Aguardando Pagamento', description: 'Profissional encontrado.' },
    { id: 'confirmado', label: 'Confirmado', description: 'Plantão agendado.' },
    { id: 'andamento', label: 'Em Andamento', description: 'Profissional em atendimento.' },
    { id: 'concluido', label: 'Concluído', description: 'Plantão finalizado com sucesso.' }
  ];

  // Map database status to step index
  let currentStepIndex = 0;
  const dbStatus = solicitacao.status.toLowerCase();
  
  // Define keywords for each step
  const keywordsAnalise = ['análise', 'analise', 'buscando', 'informações', 'procurando', 'propostas', 'aguardando família'];
  const keywordsPagamento = ['pagamento', 'pix', 'cobrança'];

  if (keywordsAnalise.some(k => dbStatus.includes(k))) currentStepIndex = 1;
  if (keywordsPagamento.some(k => dbStatus.includes(k))) currentStepIndex = 2;
  if (dbStatus.includes('confirmado')) currentStepIndex = 3;
  if (dbStatus.includes('andamento')) currentStepIndex = 4;
  if (dbStatus.includes('concluído') || dbStatus.includes('concluido')) currentStepIndex = 5;
  if (dbStatus.includes('cancelado') || dbStatus.includes('perdido') || dbStatus.includes('sem profissional')) currentStepIndex = -1; // Special state

  // Force timeline step based on actual plantões status
  if (currentStepIndex !== -1 && plantoes && plantoes.length > 0) {
    const isAnyEmAndamento = plantoes.some((p: any) => p.status?.toLowerCase().includes('andamento'));
    const isAllConcluidoOuCancelado = plantoes.every((p: any) => 
      p.status?.toLowerCase().includes('concluido') || 
      p.status?.toLowerCase().includes('concluído') || 
      p.status?.toLowerCase().includes('cancelado')
    );
    const hasAtLeastOneConcluido = plantoes.some((p: any) => 
      p.status?.toLowerCase().includes('concluido') || 
      p.status?.toLowerCase().includes('concluído')
    );

    if (isAnyEmAndamento) {
      currentStepIndex = 4;
    } else if (hasAtLeastOneConcluido && isAllConcluidoOuCancelado) {
      currentStepIndex = 5;
    }
  }

  return (
    <div className="min-h-screen bg-bg-main py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/acompanhar" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-text-main mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para a busca
        </Link>

        <div className="bg-white rounded-3xl shadow-xl ring-1 ring-sand-light/50 overflow-hidden">
          <div className="bg-blue-light/10 p-8 border-b border-sand-light/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">Status da Solicitação</p>
              <h1 className="text-2xl font-bold text-text-main font-mono">{codigo}</h1>
            </div>
            
            {currentStepIndex === -1 ? (
              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                Cancelado
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {solicitacao.status}
              </span>
            )}
          </div>

          <div className="p-8">
            {/* Progress Bar */}
            {/* Vertical Modern Timeline */}
            {currentStepIndex !== -1 && (
              <div className="mb-10 relative">
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100 rounded-full md:left-8"></div>
                <div 
                  className="absolute left-6 top-6 w-0.5 bg-gradient-to-b from-[#8ECADF] to-[#5a9bb3] rounded-full transition-all duration-1000 ease-in-out md:left-8"
                  style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                ></div>

                <div className="space-y-8 relative">
                  {steps.map((step, idx) => {
                    const isCompleted = idx < currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    const isFuture = idx > currentStepIndex;

                    return (
                      <div key={step.id} className="relative flex items-start gap-4 md:gap-6 group">
                        <div className="relative flex items-center justify-center">
                          {/* Outer pulse for current step */}
                          {isCurrent && (
                            <span className="absolute w-12 h-12 bg-[#8ECADF]/30 rounded-full animate-ping"></span>
                          )}
                          
                          {/* Icon Circle */}
                          <div className={`relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 shadow-sm
                            ${isCompleted ? 'bg-[#8ECADF] border-white text-white' : 
                              isCurrent ? 'bg-white border-[#8ECADF] text-[#8ECADF]' : 
                              'bg-white border-gray-100 text-gray-300'}`
                          }
                          >
                            {isCompleted ? <CheckCircle2 className="w-5 h-5 md:w-7 md:h-7" /> : <div className="text-lg md:text-xl font-black">{idx + 1}</div>}
                          </div>
                        </div>

                        <div className={`flex-1 pt-2 md:pt-4 transition-all duration-500 ${isFuture ? 'opacity-40' : 'opacity-100'}`}>
                          <h3 className={`text-base md:text-lg font-bold tracking-tight ${isCurrent ? 'text-[#2F3437]' : 'text-gray-500'}`}>
                            {step.label}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1 font-medium">{step.description}</p>
                          
                          {/* Show Pix info inline if current step is payment */}
                          {isCurrent && step.id === 'aguardando_pagamento' && pagamento && pagamento.gateway === "abacatepay" && (
                            <div className="mt-4 p-5 bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-200 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-500 shadow-sm">
                               <p className="text-sm text-green-900 font-medium mb-4">Seu plantão foi efetivado! Finalize o pagamento para confirmá-lo definitivamente em nossa agenda.</p>
                               <a href={pagamento.qr_code_url || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow hover:shadow-md active:scale-[0.98]">
                                  Realizar Pagamento
                                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                               </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentStepIndex >= 2 && plantoes.length > 0 && (
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-8 text-left">
                <h3 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider">Profissional Designado</h3>
                <div className="space-y-4">
                  {plantoes.map(plantao => (
                    <div key={plantao.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                        {plantao.profissional_nome ? plantao.profissional_nome.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                      </div>
                      <div>
                        <p className="font-bold text-text-main">{plantao.profissional_nome || "Profissional"}</p>
                        <p className="text-xs text-text-secondary">
                          Plantão: {plantao.data_plantao} {plantao.horario_inicio ? `às ${plantao.horario_inicio}` : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStepIndex === 2 && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 text-center flex flex-col items-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-green-900 mb-2">Profissional Encontrado!</h3>
                <p className="text-green-800 text-sm mb-6">
                  O valor final foi gerado. Efetue o pagamento abaixo para confirmar o plantão.
                </p>

                {pagamento ? (
                  <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-sm border border-green-100 flex flex-col items-center">
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-widest mb-4">Pagamento Pix</p>
                    
                    {pagamento.qr_code_url ? (
                      <div className="bg-white p-2 border border-gray-200 rounded-xl mb-4">
                        <img src={pagamento.qr_code_url} alt="QR Code Pix" className="w-48 h-48 object-contain" />
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center border border-gray-200">
                        <span className="text-gray-400 text-xs">QR Code indisponível</span>
                      </div>
                    )}
                    
                    <p className="text-xs text-text-secondary mb-2">Ou copie o código abaixo:</p>
                    <PixCopyArea pixEmv={pagamento.pix_emv || ""} />
                  </div>
                ) : (
                  <p className="text-sm text-yellow-600 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    Aguardando geração da chave de pagamento...
                  </p>
                )}
              </div>
            )}

            {currentStepIndex === 5 && !avaliacaoFeita && (
              <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-8 text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 fill-current" />
                  </div>
                  <h3 className="text-xl font-bold text-text-main">Como foi sua experiência?</h3>
                  <p className="text-sm text-text-secondary mt-1">Por favor, avalie o profissional que atendeu você.</p>
                </div>
                {plantoes.filter((p: any) => p.status?.toLowerCase().includes('conclui') || p.status?.toLowerCase().includes('concluído')).map((plantao: any) => (
                   <div key={plantao.id} className="mb-4">
                      <FormAvaliacao plantaoId={plantao.id} solicitacaoId={solicitacao.id} profissionalId={plantao.profissional_id} />
                   </div>
                ))}
              </div>
            )}
            
            {currentStepIndex === 5 && avaliacaoFeita && (
              <div className="bg-gradient-to-b from-green-50 to-white border border-green-100 shadow-sm rounded-2xl p-8 mb-8 text-center animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                  <Heart className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-green-900 mb-3">Muito Obrigado!</h3>
                <p className="text-green-800 text-base max-w-md mx-auto">
                  Recebemos sua avaliação com sucesso. A Zelare agradece pela confiança! Esperamos poder cuidar de quem você ama novamente no futuro.
                </p>
              </div>
            )}

            <h2 className="text-lg font-semibold text-text-main border-b border-gray-100 pb-2 mb-6">Resumo do Pedido</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-text-secondary">Para quem</p>
                  <p className="font-medium text-text-main">{solicitacao.para_quem}</p>
                  <p className="text-sm text-text-main">{solicitacao.tipo_profissional}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-text-secondary">Quando</p>
                  <p className="font-medium text-text-main">
                    {solicitacao.data_desejada ? new Date(solicitacao.data_desejada).toLocaleDateString('pt-BR') : 'A combinar'}
                  </p>
                  <p className="text-sm text-text-main">
                    {solicitacao.horario_desejado} {solicitacao.horario_fim ? `às ${solicitacao.horario_fim}` : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-text-secondary">Duração</p>
                  <p className="font-medium text-text-main">{solicitacao.duracao_plantao}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-text-secondary">Local</p>
                  <p className="font-medium text-text-main">{solicitacao.endereco_bairro}</p>
                  <p className="text-sm text-text-main">{solicitacao.endereco_cidade}/{solicitacao.endereco_estado}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-text-secondary mb-4">
                Dúvidas? Entre em contato conosco pelo nosso WhatsApp de atendimento.
              </p>
              <a 
                href="https://wa.me/5548999999999" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-2xl bg-green-500 px-6 py-3 font-semibold text-white shadow-md transition-transform hover:-translate-y-1 hover:bg-green-600"
              >
                Falar com a Zelare
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
