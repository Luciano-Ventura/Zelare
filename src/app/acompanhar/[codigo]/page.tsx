import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, Calendar, MapPin, User as UserIcon, Phone } from "lucide-react";
import FormAvaliacao from "./FormAvaliacao";

export const revalidate = 0;

export default async function AcompanharPage({ params }: { params: Promise<{ codigo: string }> }) {
  const resolvedParams = await params;
  
  const { data: sol } = await supabaseAdmin
    .from("familias_solicitacoes")
    .select("*, plantoes(id, profissional_nome, tipo_cuidado, data_plantao, horario_inicio, duracao, status, valor_profissional, status_profissional, taxa_zelare, total_familia)")
    .eq("codigo_acompanhamento", resolvedParams.codigo)
    .single();

  if (!sol) {
    notFound();
  }

  // Pegar o plantão mais recente vinculado
  const plantao = sol.plantoes && sol.plantoes.length > 0 ? sol.plantoes[0] : null;

  // Lógica da Timeline
  const statusGeral = plantao ? plantao.status : sol.status;
  
  const steps = [
    { label: "Pedido Recebido", completed: true },
    { label: "Buscando Profissional", completed: statusGeral !== "Novo pedido" },
    { label: "Profissional Confirmado", completed: !!plantao && (plantao.status !== "Cancelado") },
    { label: "Em Andamento", completed: plantao?.status === "Em andamento" || plantao?.status === "Concluído" },
    { label: "Concluído", completed: plantao?.status === "Concluído" },
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
            <Calendar className="w-4 h-4 mr-2 text-[#8ECADF]" /> A partir de {sol.data_inicio} ({sol.duracao_plantao})
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

        {/* Plantão Confirmado */}
        {plantao && plantao.status !== "Cancelado" && (
          <div className="bg-[#8ECADF]/10 rounded-3xl p-6 border border-[#8ECADF]/20 relative overflow-hidden">
            <h3 className="text-[10px] font-bold text-[#8ECADF] uppercase tracking-wider mb-4">Seu Profissional</h3>
            
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-black text-[#8ECADF] shadow-sm mr-4">
                {plantao.profissional_nome.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-[#2F3437] text-lg">{plantao.profissional_nome}</p>
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

            <div className="border-t border-[#8ECADF]/20 pt-4 flex justify-between items-center">
               <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Total a pagar</span>
               <span className="text-xl font-black text-[#2F3437]">R$ {plantao.total_familia}</span>
            </div>
          </div>
        )}

        {/* Avaliação (Se concluído) */}
        {plantao && plantao.status === "Concluído" && (
          <div id="avaliacao" className="bg-white rounded-3xl p-6 shadow-sm border border-[#A8D5BA]">
            <FormAvaliacao plantaoId={plantao.id} solicitacaoId={sol.id} profissionalId={plantao.profissional_id} />
          </div>
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
