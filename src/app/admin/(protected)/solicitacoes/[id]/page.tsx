import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { ArrowLeft, MessageCircle, CalendarClock, UserCheck, AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { notFound } from "next/navigation";
import { UpdateStatusForm } from "./UpdateStatusForm";
import { ObservacoesList } from "@/components/admin/ObservacoesList";

import { StartPlantaoModal } from "@/components/admin/StartPlantaoModal";
import { ConvidarProfissionalButton } from "@/components/admin/ConvidarProfissionalButton";
import { Copy } from "lucide-react";

export const revalidate = 0;

export default async function SolicitacaoDetails({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();

  const resolvedParams = await params;

  // Buscar solicitação
  const { data: solic } = await supabaseAdmin
    .from("familias_solicitacoes")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (!solic) {
    notFound();
  }

  // Buscar observações internas
  const { data: observacoes } = await supabaseAdmin
    .from("observacoes_internas")
    .select("*")
    .eq("entidade_tipo", "solicitacao")
    .eq("entidade_id", resolvedParams.id)
    .order("created_at", { ascending: false });

  // Buscar profissionais disponíveis para o Modal
  const { data: profissionais } = await supabaseAdmin
    .from("profissionais_cadastros")
    .select("id, nome_completo, categoria_profissional, cidade, regioes_atende")
    .in("status", ["Validado", "Disponível", "Ativo"]);

  // Buscar plantões ativos para verificar conflito de agenda no modal
  const { data: ocupacoesAtivas } = await supabaseAdmin
    .from("plantoes")
    .select("profissional_id, inicio_em, fim_em")
    .in("status", ["Confirmado", "Em andamento", "Reagendado"])
    .not("inicio_em", "is", null)
    .not("fim_em", "is", null);

  // Buscar oportunidades enviadas para esta solicitação
  const { data: oportunidades } = await supabaseAdmin
    .from("oportunidades_profissionais")
    .select("*")
    .eq("solicitacao_id", resolvedParams.id);

  const zapLink = `https://wa.me/55${solic.whatsapp}?text=${encodeURIComponent("Olá, tudo bem? Aqui é da Zelare. Recebemos sua solicitação de cuidado e vamos confirmar algumas informações.")}`;

  const statusOptions = [
    "Novo pedido",
    "Em análise",
    "Aguardando informações",
    "Procurando profissional",
    "Propostas recebidas",
    "Aguardando família",
    "Confirmado",
    "Em andamento",
    "Concluído",
    "Cancelado",
    "Sem profissional disponível",
    "Perdido"
  ];

  // Profissionais compatíveis básicos (Cidade e Categoria)
  const profsCompativeis = profissionais?.filter(p => 
    p.cidade?.toLowerCase() === solic.cidade?.toLowerCase() &&
    p.categoria_profissional?.toLowerCase().includes(solic.tipo_profissional?.toLowerCase() || "")
  ).slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/solicitacoes" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-text-secondary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">Detalhes da Solicitação</h1>
          <p className="text-sm text-text-secondary">ID: {solic.id}</p>
        </div>
      </div>

      {solic.status === "Novo pedido" && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4 items-start">
          <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-blue-900">Ação Recomendada: Iniciar Análise</h3>
            <p className="text-xs text-blue-800 mt-1">Esta é uma solicitação nova. Entre em contato com a família, confirme as necessidades e mude o status para "Em análise" ou "Procurando profissional".</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Detalhes Principais */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-text-main">{solic.nome_completo}</h2>
                <p className="text-sm text-text-secondary mt-1">
                  Enviado em {new Date(solic.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              <StatusBadge status={solic.status} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Contato</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-main">{solic.whatsapp}</p>
                  <a href={zapLink} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 bg-green-50 p-1.5 rounded-lg">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
              {solic.codigo_acompanhamento && (
                <div>
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Link da Família</p>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 border border-gray-100 w-max">
                    <span className="text-xs font-mono text-text-main truncate max-w-[150px]">.../acompanhar/{solic.codigo_acompanhamento}</span>
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Localização</p>
                <p className="text-sm font-medium text-text-main">{solic.cidade} - {solic.bairro}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Para quem é</p>
                <p className="text-sm font-medium text-text-main">{solic.para_quem}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Profissional Desejado</p>
                <p className="text-sm font-medium text-text-main">{solic.tipo_profissional}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Data / Horário</p>
                <p className="text-sm font-medium text-text-main">{solic.data_desejada} às {solic.horario_desejado}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Duração do Plantão</p>
                <p className="text-sm font-medium text-text-main">{solic.duracao_plantao}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Atividades Necessárias</p>
                <p className="text-sm text-text-main bg-gray-50 p-3 rounded-lg">{solic.atividades_necessarias || "Não especificado"}</p>
              </div>

              {solic.observacoes && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Observações da Família</p>
                  <p className="text-sm text-text-main bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">{solic.observacoes}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Valor Sugerido</p>
                <p className="text-sm font-medium text-text-main">{solic.valor_sugerido || "Não informado"}</p>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Urgência</p>
                <p className="text-sm font-medium text-text-main">
                  {solic.e_urgente ? <span className="text-red-600 font-bold">Sim (para as próximas 24h)</span> : "Não"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#8ECADF]" /> Profissionais Compatíveis (Perfil)
            </h3>
            <p className="text-xs text-text-secondary mb-4">
              Estes profissionais estão validados e combinam com a cidade e categoria desejada. A disponibilidade real será checada ao preencher o horário no momento da criação do plantão.
            </p>
            {profsCompativeis.length === 0 ? (
               <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
                 Nenhum profissional validado encontrado com o exato perfil solicitado.
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profsCompativeis.map(p => {
                  const convite = oportunidades?.find(o => o.profissional_id === p.id);
                  return (
                    <div key={p.id} className="p-4 border border-gray-100 rounded-xl flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div>
                        <Link href={`/admin/profissionais/${p.id}`} className="text-sm font-bold text-text-main hover:text-[#8ECADF]">{p.nome_completo}</Link>
                        <p className="text-[10px] uppercase font-bold text-text-secondary mt-1">{p.categoria_profissional}</p>
                      </div>
                      <ConvidarProfissionalButton 
                        solicitacaoId={solic.id} 
                        profissionalId={p.id} 
                        jaConvidado={!!convite} 
                        statusConvite={convite?.status}
                        valorContraproposta={convite?.valor_contraproposta}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Coluna Direita: Ações e Observações */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-text-main mb-4">Gerenciar Status</h3>
            <UpdateStatusForm table="familias_solicitacoes" id={solic.id} currentStatus={solic.status} options={statusOptions} />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="w-5 h-5 text-[#8ECADF]" />
              <h3 className="text-sm font-bold text-text-main">Criar Plantão</h3>
            </div>
            <p className="text-xs text-text-secondary mb-4">
              Gere um plantão oficial a partir desta solicitação para vincular a um profissional.
            </p>
            <StartPlantaoModal 
              solicitacaoId={solic.id}
              profissionais={profissionais || []}
              ocupacoes={ocupacoesAtivas || []}
              defaultData={solic.data_desejada}
              defaultHorario={solic.horario_desejado}
              defaultDuracao={solic.duracao_plantao}
            />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-text-main mb-4">Observações Internas</h3>
            <ObservacoesList entidadeTipo="solicitacao" entidadeId={solic.id} observacoes={observacoes || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
