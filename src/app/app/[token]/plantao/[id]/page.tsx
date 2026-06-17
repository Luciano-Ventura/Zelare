import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Clock, User } from "lucide-react";
import { PlantaoStatusActions } from "./PlantaoStatusActions";

export const revalidate = 0;

export default async function DetalhesPlantao({
  params,
}: {
  params: Promise<{ token: string; id: string }>;
}) {
  const resolvedParams = await params;
  const token = resolvedParams.token;
  const plantaoId = resolvedParams.id;

  const { data: prof } = await supabaseAdmin
    .from("profissionais_cadastros")
    .select("id")
    .eq("token_acesso", token)
    .single();

  if (!prof) notFound();

  // Buscar plantão
  const { data: plantao, error } = await supabaseAdmin
    .from("plantoes")
    .select("*, familias_solicitacoes(latitude, longitude, endereco_completo, endereco_numero, endereco_complemento, endereco_bairro, endereco_cidade, endereco_estado, endereco_cep)")
    .eq("id", plantaoId)
    .eq("profissional_id", prof.id)
    .single();

  if (error) {
    console.error("ERRO AO BUSCAR PLANTAO:", error);
  }

  if (!plantao) {
    return <div>Erro ao buscar plantão. Verifique os logs. {error?.message}</div>;
  }

  const isAtivo = plantao.status !== "Cancelado" && plantao.status !== "Concluído";
  const podeVerDetalhes = plantao.status === "Confirmado" || plantao.status === "Em andamento" || plantao.status === "Concluído";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/app/${token}`} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-xl font-black text-[#2F3437] tracking-tight">Detalhes do Plantão</h2>
          <p className="text-sm font-bold text-[#8ECADF] uppercase tracking-wider">{plantao.status}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center text-sm font-bold text-[#2F3437] mb-4">
          <User className="w-4 h-4 mr-2 text-[#8ECADF]" /> {podeVerDetalhes ? plantao.familia_nome : "Família Cliente"}
        </div>
        <div className="flex items-start text-sm font-bold text-[#2F3437] mb-4">
          <MapPin className="w-4 h-4 mr-2 mt-0.5 text-[#8ECADF] flex-shrink-0" /> 
          <div>
            {podeVerDetalhes ? (
              <>
                <p>{plantao.familias_solicitacoes?.endereco_completo}, {plantao.familias_solicitacoes?.endereco_numero}</p>
                <p className="text-gray-500 font-medium">{plantao.familias_solicitacoes?.endereco_bairro} - {plantao.familias_solicitacoes?.endereco_cidade}</p>
                {plantao.familias_solicitacoes?.endereco_complemento && <p className="text-gray-500 font-medium">Comp: {plantao.familias_solicitacoes?.endereco_complemento}</p>}
              </>
            ) : (
              <>
                <p className="text-gray-500 font-medium">{plantao.familias_solicitacoes?.endereco_bairro} - {plantao.familias_solicitacoes?.endereco_cidade}</p>
                <p className="text-xs text-orange-600 mt-1">Endereço completo será liberado após o pagamento.</p>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center text-sm font-bold text-[#2F3437] mb-4">
          <Calendar className="w-4 h-4 mr-2 text-[#8ECADF]" /> {plantao.data_plantao}
        </div>
        <div className="flex items-center text-sm font-bold text-[#2F3437]">
          <Clock className="w-4 h-4 mr-2 text-[#8ECADF]" /> {plantao.horario_inicio} (Duração: {plantao.duracao})
        </div>
      </div>

      {isAtivo && (
        <PlantaoStatusActions 
          plantaoId={plantao.id}
          profissionalId={prof.id}
          token={token}
          status={plantao.status}
          statusProfissional={plantao.status_profissional}
          familiaLat={plantao.familias_solicitacoes?.latitude || 0}
          familiaLng={plantao.familias_solicitacoes?.longitude || 0}
        />
      )}

      {plantao.status === "Concluído" && (
        <div className="bg-green-50 rounded-2xl p-6 border border-green-100 text-center space-y-2">
          <p className="text-green-800 font-bold">Turno Concluído</p>
          <p className="text-sm text-green-700 font-medium">Você finalizou este plantão e preencheu o diário de bordo com sucesso.</p>
          <div className="pt-4 border-t border-green-200 mt-4">
            <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Valor do Repasse</p>
            <p className="text-2xl font-black text-green-700">R$ {plantao.valor_profissional}</p>
          </div>
        </div>
      )}
    </div>
  );
}
