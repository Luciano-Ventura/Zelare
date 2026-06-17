import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, Calendar, MapPin, User as UserIcon, Phone, Info } from "lucide-react";
import FormAvaliacao from "./FormAvaliacao";
import { CancelarSolicitacaoFamiliaButton } from "@/components/familia/CancelarSolicitacaoFamiliaButton";
import { RelatarProblemaButton } from "@/components/familia/RelatarProblemaButton";

export const revalidate = 0;

export default async function AcompanharPage({ params }: { params: Promise<{ codigo: string }> }) {
  const resolvedParams = await params;
  
  const { data: sol } = await supabaseAdmin
    .from("familias_solicitacoes")
    .select("*, plantoes(id, profissional_id, profissional_nome, tipo_cuidado, data_plantao, horario_inicio, duracao, status, valor_profissional, status_profissional, taxa_zelare, total_familia, pagamentos(link_pagamento, status_pagamento), diario_bordo(*))")
    .eq("codigo_acompanhamento", resolvedParams.codigo)
    .single();

  if (!sol) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] font-sans pb-32 flex flex-col items-center pt-20 px-6">
        <header className="absolute top-0 left-0 w-full bg-white border-b border-gray-100 p-6 flex justify-center items-center shadow-sm">
          <h1 className="font-black text-[#8ECADF] text-2xl tracking-tight">ZELARE</h1>
        </header>
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-sm text-center border border-gray-100 mt-10">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#2F3437] mb-2">Código não encontrado</h2>
          <p className="text-sm text-[#6B7280] mb-6">
            Não encontramos uma solicitação com esse código. Verifique se digitou corretamente ou fale com a equipe da Zelare.
          </p>
          <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full bg-blue-light text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-light/90 transition-colors">
            <Phone className="w-4 h-4 mr-2" /> Falar com a Zelare
          </a>
        </div>
      </div>
    );
  }

  // Pegar o plantão mais recente vinculado
  const plantao = sol.plantoes && sol.plantoes.length > 0 ? sol.plantoes[0] : null;

  // Lógica da Timeline
  const statusGeral = plantao ? plantao.status : sol.status;
  const isAguardandoPgto = statusGeral === "Aguardando pagamento";
  const isPago = statusGeral === "Confirmado" || statusGeral === "Em andamento" || statusGeral === "Concluído";
  const pagamentoObj = plantao && plantao.pagamentos && plantao.pagamentos.length > 0 ? plantao.pagamentos[0] : null;
  const linkPagamento = pagamentoObj?.link_pagamento;
  const diario = plantao && plantao.diario_bordo && plantao.diario_bordo.length > 0 ? plantao.diario_bordo[0] : null;
  
  const steps = [
    { label: "Pedido Recebido", completed: true },
    { label: "Buscando Profissional", completed: statusGeral !== "Novo pedido" },
    { label: "Aguardando Pagamento", completed: isAguardandoPgto || isPago, isCurrent: isAguardandoPgto },
    { label: "Plantão Confirmado", completed: isPago },
    { label: "Em Andamento", completed: statusGeral === "Em andamento" || statusGeral === "Concluído" },
    { label: "Concluído", completed: statusGeral === "Concluído" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans pb-32">
      <header className="bg-white border-b border-gray-100 p-6 flex justify-center items-center shadow-sm sticky top-0 z-10">
        <h1 className="font-black text-[#8ECADF] text-2xl tracking-tight">ZELARE</h1>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-[#2F3437] tracking-tight">Acompanhamento</h2>
          <p className="text-sm text-[#6B7280] font-medium mt-1">Veja o status do seu pedido de cuidado.</p>
        </div>

        {/* Resumo do Pedido */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center text-sm font-bold text-[#2F3437] mb-4">
            <UserIcon className="w-4 h-4 mr-2 text-[#8ECADF]" /> {sol.tipo_profissional}
          </div>
          <div className="flex items-center text-sm font-bold text-[#2F3437] mb-4">
            <MapPin className="w-4 h-4 mr-2 text-[#8ECADF]" /> {sol.cidade} - {sol.bairro}
          </div>
          <div className="flex items-center text-sm font-bold text-[#2F3437]">
            <Calendar className="w-4 h-4 mr-2 text-[#8ECADF]" /> A partir de {sol.data_desejada} ({sol.duracao_plantao})
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-4">Status do Pedido</h3>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.completed ? 'bg-[#A8D5BA] text-[#2F3437]' : 'bg-gray-100 text-gray-300'}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-10 mt-2 ${steps[index + 1].completed ? 'bg-[#A8D5BA]' : 'bg-gray-100'}`} />
                  )}
                </div>
                <div className={`pt-0.5 font-bold ${step.completed ? 'text-[#2F3437]' : 'text-gray-400'}`}>
                  {step.label}
                  {step.isCurrent && step.label === "Aguardando Pagamento" && (
                    <span className="block text-xs font-medium text-orange-600 mt-1">Realize o pagamento para liberar o contato do profissional.</span>
                  )}
                  {step.label === "Em Andamento" && plantao?.status_profissional === "A caminho" && (
                    <span className="block text-xs font-medium text-[#8ECADF] mt-1">Profissional a caminho do local</span>
                  )}
                  {step.label === "Em Andamento" && plantao?.status_profissional === "No local" && (
                    <span className="block text-xs font-medium text-[#8ECADF] mt-1">Profissional chegou ao local</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plantão (Aguardando Pagamento ou Confirmado) */}
        {plantao && plantao.status !== "Cancelado" && (
          <div className="bg-[#8ECADF]/10 rounded-3xl p-6 border border-[#8ECADF]/20 relative overflow-hidden">
            <h3 className="text-[10px] font-bold text-[#8ECADF] uppercase tracking-wider mb-4">
              {isAguardandoPgto ? "Profissional Encontrado" : "Seu Profissional"}
            </h3>
            
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-black text-[#8ECADF] shadow-sm mr-4">
                {isAguardandoPgto ? "?" : plantao.profissional_nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-[#2F3437] text-lg">
                  {isAguardandoPgto ? "Nome Oculto" : plantao.profissional_nome}
                </p>
                <p className="text-xs font-bold text-[#6B7280]">{plantao.tipo_cuidado || "Profissional parceiro"}</p>
              </div>
            </div>

            <div className="bg-white/50 rounded-xl p-4 space-y-2 mb-4">
               <p className="text-sm font-bold text-[#2F3437] flex items-center">
                 <Calendar className="w-4 h-4 mr-2 text-[#6B7280]" /> {plantao.data_plantao} às {plantao.horario_inicio}
               </p>
               <p className="text-sm font-bold text-[#2F3437] flex items-center">
                 <Clock className="w-4 h-4 mr-2 text-[#6B7280]" /> Duração: {plantao.duracao}
               </p>
            </div>

            {!isAguardandoPgto && (
              <div className="mb-4 bg-[#8ECADF]/10 border border-[#8ECADF]/20 p-3 rounded-xl text-xs font-medium text-[#2F3437] italic text-center">
                Profissional selecionado pela Zelare com base em proximidade, experiência e disponibilidade.
              </div>
            )}

            {isAguardandoPgto ? (
              <div className="bg-white rounded-xl p-4 border border-orange-200 mt-4">
                <p className="text-sm font-bold text-orange-800 mb-2">Seu plantão ainda não está confirmado.</p>
                <div className="space-y-3 mb-4 text-xs font-medium text-[#6B7280]">
                  <p className="text-justify leading-relaxed">
                    O valor do plantão inclui busca do profissional, organização, confirmação, suporte da Zelare e acompanhamento do atendimento.
                  </p>
                  <div className="flex justify-between pt-3 border-t border-gray-100 font-bold text-lg text-[#2F3437]">
                    <span>Total do plantão:</span> 
                    <span>R$ {plantao.total_familia}</span>
                  </div>
                </div>
                {linkPagamento ? (
                  <a href={linkPagamento} target="_blank" rel="noopener noreferrer" className="block text-center w-full bg-orange-500 text-white font-bold text-sm py-3 rounded-lg hover:bg-orange-600 transition-colors">
                    Pagar Plantão
                  </a>
                ) : (
                  <p className="text-xs text-center text-orange-600 font-bold">Aguarde o link de pagamento do operador ou entre em contato no WhatsApp abaixo.</p>
                )}
              </div>
            ) : (
              <div className="border-t border-[#8ECADF]/20 pt-4 flex justify-between items-center">
                 <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Total pago</span>
                 <span className="text-xl font-black text-[#2F3437]">R$ {plantao.total_familia}</span>
              </div>
            )}
            
            {isPago && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xs font-bold text-green-800 text-center">Pagamento confirmado. Seu plantão está confirmado.</p>
              </div>
            )}
          </div>
        )}

        {/* Relatório do Plantão (Diário de Bordo) */}
        {plantao && plantao.status === "Concluído" && diario && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#8ECADF]/30 relative overflow-hidden">
            <h3 className="text-sm font-black text-[#2F3437] mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" /> Relatório do Plantão
            </h3>
            <p className="text-xs text-gray-500 mb-6">Informações registradas por {plantao.profissional_nome} no momento da saída.</p>

            <div className="space-y-4">
              {diario.alimentacao && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Alimentação</p>
                  <p className="text-sm text-gray-800 font-medium">{diario.alimentacao}</p>
                </div>
              )}
              {diario.hidratacao && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Hidratação</p>
                  <p className="text-sm text-gray-800 font-medium">{diario.hidratacao}</p>
                </div>
              )}
              {diario.medicacao && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Medicação</p>
                  <p className="text-sm text-gray-800 font-medium">{diario.medicacao}</p>
                </div>
              )}
              {diario.higiene && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Higiene</p>
                  <p className="text-sm text-gray-800 font-medium">{diario.higiene}</p>
                </div>
              )}
              {diario.observacoes && (
                <div className="p-3 bg-[#8ECADF]/5 rounded-xl border border-[#8ECADF]/20">
                  <p className="text-[10px] uppercase font-bold text-[#8ECADF] mb-1">Observações e Atividades</p>
                  <p className="text-sm text-gray-800 font-medium">{diario.observacoes}</p>
                </div>
              )}
              {diario.sinais_alerta && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-xs font-bold text-red-800 uppercase">Sinal de Alerta</p>
                  <p className="text-sm text-red-700 font-medium mt-1">Houve o registro de algum sinal de alerta durante o plantão. Entre em contato com a Zelare para mais detalhes caso nossa equipe médica ainda não tenha falado com você.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Avaliação (Se concluído) */}
        {plantao && plantao.status === "Concluído" && (
          <div id="avaliacao" className="bg-white rounded-3xl p-6 shadow-sm border border-[#A8D5BA]">
            <FormAvaliacao plantaoId={plantao.id} solicitacaoId={sol.id} profissionalId={plantao.profissional_id} />
          </div>
        )}

        {/* Relatar Problema (Sempre disponível se não estiver cancelado) */}
        {sol.status !== "Cancelado" && (
          <RelatarProblemaButton 
            codigo={resolvedParams.codigo} 
            solicitacaoId={sol.id} 
            plantaoId={plantao?.id} 
          />
        )}

        {/* Cancelar (Apenas se não pago / inicial) */}
        {(sol.status === "Novo pedido" || sol.status === "Em análise" || sol.status === "Procurando profissional") && (
          <CancelarSolicitacaoFamiliaButton codigo={resolvedParams.codigo} solicitacaoId={sol.id} />
        )}
      </main>

      {/* Flutuante WhatsApp */}
      <div className="fixed bottom-6 w-full max-w-3xl left-1/2 -translate-x-1/2 px-6 z-20">
        <a href="https://wa.me/5511999999999" target="_blank" className="flex items-center justify-center w-full bg-[#2F3437] text-white py-4 rounded-2xl text-base font-black hover:brightness-95 transition-all shadow-xl">
          <Phone className="w-5 h-5 mr-2" /> Falar com a Zelare
        </a>
      </div>
    </div>
  );
}
