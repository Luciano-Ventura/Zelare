import { requireProfissional } from "@/lib/auth-profissional";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { ChevronLeft, Info, MapPin, Calendar, Clock } from "lucide-react";
import ResponderOportunidade from "./ResponderOportunidade";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function OportunidadeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const sessao = await requireProfissional();
  const resolvedParams = await params;

  const { data: op } = await supabaseAdmin
    .from("oportunidades_profissionais")
    .select("*, familias_solicitacoes(*)")
    .eq("id", resolvedParams.id)
    .eq("profissional_id", sessao.id)
    .single();

  if (!op) {
    notFound();
  }

  // Atualizar para visualizada se ainda for "Enviada"
  if (op.status === "Enviada") {
    await supabaseAdmin
      .from("oportunidades_profissionais")
      .update({ status: "Visualizada" })
      .eq("id", op.id);
    op.status = "Visualizada";
  }

  const sol = op.familias_solicitacoes as any;

  return (
    <div className="p-6 pb-32">
      <Link href="/profissional/oportunidades" className="inline-flex items-center text-sm font-bold text-[#6B7280] mb-6">
        <ChevronLeft className="w-5 h-5 mr-1" /> Voltar
      </Link>

      <h2 className="text-2xl font-black text-[#2F3437] tracking-tight mb-2">Detalhes do Convite</h2>
      <p className="text-sm text-[#6B7280] font-medium mb-6">Analise as informações abaixo antes de aceitar.</p>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div>
          <h3 className="text-[10px] font-bold text-[#8ECADF] uppercase tracking-wider mb-1">Cuidado Necessário</h3>
          <p className="font-black text-[#2F3437] text-xl">{sol.tipo_profissional}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Início</h3>
            <div className="flex items-center text-sm font-bold text-[#2F3437]">
              <Calendar className="w-4 h-4 mr-1 text-[#8ECADF]" /> {sol.data_inicio}
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Duração</h3>
            <div className="flex items-center text-sm font-bold text-[#2F3437]">
              <Clock className="w-4 h-4 mr-1 text-[#8ECADF]" /> {sol.duracao_plantao}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Localização</h3>
          <div className="flex items-center text-sm font-bold text-[#2F3437]">
            <MapPin className="w-4 h-4 mr-1 text-[#8ECADF]" /> {sol.cidade} - {sol.bairro}
          </div>
        </div>

        {sol.observacoes && (
          <div className="bg-[#E8DCC8]/20 rounded-xl p-4">
            <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1 flex items-center">
              <Info className="w-3 h-3 mr-1" /> Observações da Família
            </h3>
            <p className="text-sm text-[#2F3437] font-medium whitespace-pre-line">{sol.observacoes}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <div>
             <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Repasse Oferecido</h3>
             <p className="text-2xl font-black text-[#8ECADF]">{op.valor_oferecido ? `R$ ${op.valor_oferecido}` : "A combinar"}</p>
          </div>
        </div>
      </div>

      <ResponderOportunidade id={op.id} statusAtual={op.status} />

    </div>
  );
}
