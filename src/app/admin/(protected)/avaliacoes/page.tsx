import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Star } from "lucide-react";

export const revalidate = 0;

export default async function AvaliacoesPage() {
  await requireAdmin();

  const { data: avaliacoes } = await supabaseAdmin
    .from("avaliacoes")
    .select("*, familias_solicitacoes(nome_completo), profissionais_cadastros(nome_completo)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Avaliações</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {avaliacoes?.map((av) => (
          <div key={av.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">
            <div className="absolute top-4 right-4 flex items-center bg-yellow-50 text-yellow-600 px-2.5 py-1 rounded-full text-sm font-bold">
              {av.nota} <Star className="w-4 h-4 ml-1 fill-current" />
            </div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Avaliado por: <span className="text-blue-600">{av.quem_avaliou === 'familia' ? 'Família' : 'Profissional'}</span>
            </p>
            <div className="mb-4 space-y-1">
              <p className="text-sm font-medium text-text-main">Família: {av.familias_solicitacoes?.nome_completo || "N/A"}</p>
              <p className="text-sm font-medium text-text-main">Profissional: {av.profissionais_cadastros?.nome_completo || "N/A"}</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-text-secondary italic">
              "{av.comentario || "Sem comentário"}"
            </div>

            <p className="text-xs text-gray-400 mt-4 text-right">
              {new Date(av.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        ))}

        {(!avaliacoes || avaliacoes.length === 0) && (
          <div className="col-span-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-text-secondary">
            Nenhuma avaliação registrada ainda.
          </div>
        )}
      </div>
    </div>
  );
}
