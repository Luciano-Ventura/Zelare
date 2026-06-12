import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { ArrowLeft, MessageCircle, CalendarClock, Zap } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { notFound } from "next/navigation";
import { UpdateStatusForm } from "../../solicitacoes/[id]/UpdateStatusForm";
import { ObservacoesList } from "@/components/admin/ObservacoesList";

export const revalidate = 0;

function parseArrayField(field: any): string[] {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    const parsed = JSON.parse(field);
    if (Array.isArray(parsed)) return parsed;
  } catch (e) {
    // Not a JSON array
  }
  return field.split(",").map((s: string) => s.trim()).filter(Boolean);
}

export default async function ProfissionalDetails({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const resolvedParams = await params;

  // Buscar profissional
  const { data: prof } = await supabaseAdmin
    .from("profissionais_cadastros")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (!prof) {
    notFound();
  }

  // Buscar observações internas
  const { data: observacoes } = await supabaseAdmin
    .from("observacoes_internas")
    .select("*")
    .eq("entidade_tipo", "profissional")
    .eq("entidade_id", resolvedParams.id)
    .order("created_at", { ascending: false });

  // Buscar Agenda (plantões do profissional)
  const { data: agenda } = await supabaseAdmin
    .from("plantoes")
    .select("id, familia_nome, data_plantao, horario_inicio, duracao, status")
    .eq("profissional_id", resolvedParams.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const zapLink = `https://wa.me/55${prof.whatsapp}?text=${encodeURIComponent("Olá, tudo bem? Aqui é da Zelare. Recebemos seu cadastro profissional e vamos confirmar algumas informações para iniciar a análise.")}`;

  const statusOptions = [
    "Novo cadastro",
    "Aguardando informações",
    "Em análise",
    "Validado",
    "Disponível",
    "Ativo",
    "Inativo",
    "Bloqueado"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/profissionais" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-text-secondary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">Detalhes do Profissional</h1>
          <p className="text-sm text-text-secondary">ID: {prof.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Detalhes Principais */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Actions Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-wrap gap-3 items-center">
            <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider flex items-center gap-1.5"><Zap className="w-4 h-4 text-yellow-500" /> Ações Rápidas:</span>
            <a href={zapLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-xs font-bold transition-colors flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Chamar WhatsApp
            </a>
            {prof.status === "Em análise" && (
              <form action={async () => {
                "use server";
                await supabaseAdmin.from("profissionais_cadastros").update({ status: "Validado" }).eq("id", prof.id);
              }}>
                <button type="submit" className="px-4 py-2 bg-[#8ECADF] text-[#2F3437] hover:brightness-95 rounded-xl text-xs font-bold transition-all">
                  Aprovar Validado
                </button>
              </form>
            )}
            {prof.status !== "Bloqueado" && (
              <form action={async () => {
                "use server";
                await supabaseAdmin.from("profissionais_cadastros").update({ status: "Bloqueado" }).eq("id", prof.id);
              }}>
                <button type="submit" className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors">
                  Bloquear
                </button>
              </form>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-text-main">{prof.nome_completo}</h2>
                <p className="text-sm text-text-secondary mt-1">
                  Cadastrado em {new Date(prof.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              <StatusBadge status={prof.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Contato</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-main">{prof.whatsapp}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Localização</p>
                <p className="text-sm font-medium text-text-main">{prof.cidade} - {prof.bairro}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Categoria</p>
                <p className="text-sm font-medium text-text-main">{prof.categoria_profissional}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Experiência</p>
                <p className="text-sm font-medium text-text-main">{prof.tempo_experiencia}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Tipos de Atendimento</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {parseArrayField(prof.tipos_atendimento).map((tipo: string) => (
                    <span key={tipo} className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                      {tipo}
                    </span>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Regiões Atendidas</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {parseArrayField(prof.regioes_atende).map((regiao: string) => (
                    <span key={regiao} className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
                      {regiao}
                    </span>
                  ))}
                </div>
              </div>

              {prof.formacao_curso && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Formação / Curso</p>
                  <p className="text-sm text-text-main bg-gray-50 p-3 rounded-lg">{prof.formacao_curso}</p>
                </div>
              )}

              {prof.descricao_experiencia && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Resumo da Experiência</p>
                  <p className="text-sm text-text-main bg-gray-50 p-3 rounded-lg">{prof.descricao_experiencia}</p>
                </div>
              )}

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Disponibilidade</p>
                <p className="text-sm text-text-main">{prof.disponibilidade}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Ações e Observações */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
              <CalendarClock className="w-5 h-5 text-[#8ECADF]" /> Agenda
            </h3>
            {agenda?.length === 0 ? (
               <p className="text-xs text-text-secondary italic">Nenhum plantão registrado.</p>
            ) : (
               <div className="space-y-3">
                 {agenda?.map(plantao => (
                   <div key={plantao.id} className="p-3 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                     <div className="flex justify-between items-start mb-2">
                       <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{plantao.data_plantao} às {plantao.horario_inicio}</p>
                       <StatusBadge status={plantao.status} />
                     </div>
                     <p className="text-sm font-bold text-text-main">{plantao.familia_nome}</p>
                     <p className="text-xs text-text-secondary mt-1">Duração: {plantao.duracao}</p>
                   </div>
                 ))}
               </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-text-main mb-4">Gerenciar Status</h3>
            <UpdateStatusForm table="profissionais_cadastros" id={prof.id} currentStatus={prof.status} options={statusOptions} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-text-main mb-4">Observações Internas</h3>
            <ObservacoesList entidadeTipo="profissional" entidadeId={prof.id} observacoes={observacoes || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
