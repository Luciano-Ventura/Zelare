import { requireProfissional } from "@/lib/auth-profissional";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { ChevronRight, Calendar, MapPin, Clock } from "lucide-react";

export const revalidate = 0;

export default async function OportunidadesPage() {
  const sessao = await requireProfissional();

  const { data: oportunidades } = await supabaseAdmin
    .from("oportunidades_profissionais")
    .select("id, status, valor_oferecido, familias_solicitacoes(cidade, bairro, tipo_profissional, duracao_plantao, data_desejada)")
    .eq("profissional_id", sessao.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-black text-[#2F3437] tracking-tight mb-6">Meus Convites</h2>

      <div className="space-y-4">
        {oportunidades?.length === 0 && (
          <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
            <p className="text-[#6B7280] font-medium">Você não possui convites no momento.</p>
          </div>
        )}

        {oportunidades?.map((op) => {
          const sol = op.familias_solicitacoes as any;
          const isPendente = op.status === "Enviada" || op.status === "Visualizada";
          
          return (
            <Link 
              key={op.id} 
              href={`/profissional/oportunidades/${op.id}`}
              className={`block bg-white rounded-2xl p-5 shadow-sm border transition-shadow ${
                isPendente ? 'border-[#8ECADF] hover:shadow-md' : 'border-gray-100 opacity-70'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                  isPendente ? 'bg-[#8ECADF]/10 text-[#8ECADF]' : 
                  op.status === "Aceita" ? 'bg-[#A8D5BA]/20 text-green-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {op.status}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>

              <h3 className="font-bold text-[#2F3437] text-lg mb-2">{sol.tipo_profissional}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-[#6B7280]">
                  <MapPin className="w-4 h-4 mr-2 text-[#8ECADF]" />
                  {sol.cidade} - {sol.bairro}
                </div>
                <div className="flex items-center text-sm text-[#6B7280]">
                  <Calendar className="w-4 h-4 mr-2 text-[#8ECADF]" />
                  A partir de {sol.data_desejada}
                </div>
                <div className="flex items-center text-sm text-[#6B7280]">
                  <Clock className="w-4 h-4 mr-2 text-[#8ECADF]" />
                  {sol.duracao_plantao}
                </div>
              </div>

              <div className="border-t border-gray-50 pt-3">
                <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Valor Proposto</p>
                <p className="text-lg font-black text-[#8ECADF]">
                  {op.valor_oferecido ? `R$ ${op.valor_oferecido}` : "A combinar"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
