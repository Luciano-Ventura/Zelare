import { requireProfissional } from "@/lib/auth-profissional";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import FormOcorrencia from "./FormOcorrencia";

export const revalidate = 0;

export default async function NovaOcorrenciaPage() {
  const sessao = await requireProfissional();

  // Buscar plantões recentes do profissional para ele vincular a ocorrência
  const { data: plantoes } = await supabaseAdmin
    .from("plantoes")
    .select("id, data_plantao, cidade")
    .eq("profissional_id", sessao.id)
    .in("status", ["Confirmado", "Em andamento", "Concluído", "Reagendado"])
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <div className="p-6 pb-32">
      <Link href="/profissional" className="inline-flex items-center text-sm font-bold text-[#6B7280] mb-6">
        <ChevronLeft className="w-5 h-5 mr-1" /> Voltar
      </Link>

      <h2 className="text-2xl font-black text-[#2F3437] tracking-tight mb-2">Relatar Ocorrência</h2>
      <p className="text-sm text-[#6B7280] font-medium mb-6">Em caso de emergência médica, ligue 192 (SAMU). Utilize este formulário para relatar intercorrências do plantão à Zelare.</p>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <FormOcorrencia plantoes={plantoes || []} />
      </div>
    </div>
  );
}
