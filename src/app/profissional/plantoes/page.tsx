import { requireProfissional } from "@/lib/auth-profissional";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { ChevronRight, Calendar, MapPin, Clock } from "lucide-react";

export const revalidate = 0;

export default async function PlantoesPage() {
  const sessao = await requireProfissional();

  const { data: plantoes } = await supabaseAdmin
    .from("plantoes")
    .select("id, data_plantao, horario_inicio, duracao, cidade, bairro, status, tipo_cuidado, valor_profissional")
    .eq("profissional_id", sessao.id)
    .order("inicio_em", { ascending: false });

  // Agrupar plantões
  const emAndamento = plantoes?.filter(p => p.status === "Em andamento") || [];
  const proximos = plantoes?.filter(p => p.status === "Confirmado" || p.status === "Reagendado") || [];
  const historico = plantoes?.filter(p => p.status === "Concluído" || p.status === "Cancelado") || [];

  const PlantaoCard = ({ p }: { p: any }) => (
    <Link 
      href={`/profissional/plantoes/${p.id}`}
      className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-[#8ECADF] transition-colors"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
          p.status === 'Em andamento' ? 'bg-[#A8D5BA]/20 text-green-700' : 
          p.status === 'Concluído' ? 'bg-gray-100 text-gray-500' :
          'bg-[#8ECADF]/10 text-[#8ECADF]'
        }`}>
          {p.status}
        </span>
        <ChevronRight className="w-5 h-5 text-gray-300" />
      </div>

      <h3 className="font-bold text-[#2F3437] text-lg mb-2">{p.tipo_cuidado}</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-[#6B7280]">
          <MapPin className="w-4 h-4 mr-2 text-[#8ECADF]" />
          {p.cidade} - {p.bairro}
        </div>
        <div className="flex items-center text-sm text-[#6B7280]">
          <Calendar className="w-4 h-4 mr-2 text-[#8ECADF]" />
          {p.data_plantao} às {p.horario_inicio}
        </div>
        <div className="flex items-center text-sm text-[#6B7280]">
          <Clock className="w-4 h-4 mr-2 text-[#8ECADF]" />
          {p.duracao}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-black text-[#2F3437] tracking-tight">Meus Plantões</h2>
        <p className="text-sm text-[#6B7280] font-medium mt-1">Acompanhe sua agenda e histórico.</p>
      </div>

      {emAndamento.length > 0 && (
        <section>
          <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">Em Execução</h3>
          <div className="space-y-4">
            {emAndamento.map(p => <PlantaoCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      {proximos.length > 0 && (
        <section>
          <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">Próximos</h3>
          <div className="space-y-4">
            {proximos.map(p => <PlantaoCard key={p.id} p={p} />)}
          </div>
        </section>
      )}

      <section>
        <h3 className="text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-3">Histórico</h3>
        {historico.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhum histórico encontrado.</p>
        ) : (
          <div className="space-y-4 opacity-70">
            {historico.map(p => <PlantaoCard key={p.id} p={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
