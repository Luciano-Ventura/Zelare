import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { ArrowLeft, MessageCircle, CalendarClock, Zap, MapPin, Star, Award, TrendingUp, DollarSign } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { notFound } from "next/navigation";
import { UpdateStatusForm } from "../../solicitacoes/[id]/UpdateStatusForm";
import { ObservacoesList } from "@/components/admin/ObservacoesList";

import { EditProfissionalModal } from "@/components/admin/EditProfissionalModal";
import { DeleteProfissionalButton } from "@/components/admin/DeleteProfissionalButton";
import { ChecklistValidacao } from "./ChecklistValidacao";
import { MagicLinkManager } from "@/components/admin/MagicLinkManager";

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
    .select("id, familia_nome, data_plantao, horario_inicio, duracao, status, valor_profissional")
    .eq("profissional_id", resolvedParams.id)
    .order("created_at", { ascending: false })
    .limit(50);

  // Buscar Avaliações
  const { data: avaliacoesList } = await supabaseAdmin
    .from("avaliacoes")
    .select("nota, comentario, created_at, plantao_id")
    .eq("profissional_id", resolvedParams.id)
    .order("created_at", { ascending: false });

  // Cálculos de Relatório / Gamificação
  const plantoesConcluidos = agenda?.filter(p => p.status === "Concluído") || [];
  const totalConcluidos = plantoesConcluidos.length;
  const totalRecebido = plantoesConcluidos.reduce((acc, p) => acc + (Number(p.valor_profissional) || 0), 0);
  
  const notas = avaliacoesList?.map(a => a.nota) || [];
  const mediaAvaliacoes = notas.length > 0 ? (notas.reduce((a,b) => a+b, 0) / notas.length).toFixed(1) : "N/A";

  // Lógica de Badges (Nível)
  let nivelBadge = { nome: "Iniciante", cor: "bg-gray-100 text-gray-700 border-gray-200" };
  if (totalConcluidos >= 1) nivelBadge = { nome: "Bronze", cor: "bg-orange-100 text-orange-800 border-orange-200" };
  if (totalConcluidos >= 5) nivelBadge = { nome: "Prata", cor: "bg-slate-200 text-slate-800 border-slate-300" };
  if (totalConcluidos >= 15) nivelBadge = { nome: "Ouro", cor: "bg-yellow-100 text-yellow-800 border-yellow-300" };
  if (totalConcluidos >= 30) nivelBadge = { nome: "Diamante", cor: "bg-cyan-100 text-cyan-800 border-cyan-300" };

  const isSuperCuidador = notas.length >= 3 && Number(mediaAvaliacoes) >= 4.8;

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

  const addressQuery = encodeURIComponent(`${prof.cep_base || ''} ${prof.endereco_base_completo || ''} ${prof.endereco_base_numero || ''} ${prof.cidade || ''}`.replace(/\s+/g, ' ').trim());
  
  const mapIframeUrl = addressQuery ? `https://maps.google.com/maps?q=${addressQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed` : null;
  
  const googleMapsUrl = addressQuery ? `https://www.google.com/maps/search/?api=1&query=${addressQuery}` : null;

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
        <div className="ml-auto flex items-center gap-2">
          <EditProfissionalModal prof={prof} />
          <DeleteProfissionalButton id={prof.id} />
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
                <button type="submit" data-testid="aprovar-profissional" className="px-4 py-2 bg-[#8ECADF] text-[#2F3437] hover:brightness-95 rounded-xl text-xs font-bold transition-all">
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
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-text-main">{prof.nome_completo}</h2>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${nivelBadge.cor}`}>
                    Nível {nivelBadge.nome}
                  </span>
                  {isSuperCuidador && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold border bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-purple-800" /> Super Cuidador
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  Cadastrado em {new Date(prof.created_at).toLocaleString('pt-BR')}
                </p>
              </div>
              <StatusBadge status={prof.status} />
            </div>

            {/* Gamificação / Estatísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                <div className="flex justify-center mb-2"><Award className="w-5 h-5 text-blue-500" /></div>
                <p className="text-2xl font-black text-text-main">{totalConcluidos}</p>
                <p className="text-[10px] uppercase font-bold text-text-secondary mt-1">Plantões</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                <div className="flex justify-center mb-2"><Star className={`w-5 h-5 ${mediaAvaliacoes !== "N/A" ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`} /></div>
                <p className="text-2xl font-black text-text-main">{mediaAvaliacoes}</p>
                <p className="text-[10px] uppercase font-bold text-text-secondary mt-1">Nota Média</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                <div className="flex justify-center mb-2"><DollarSign className="w-5 h-5 text-green-500" /></div>
                <p className="text-lg font-black text-text-main pt-1">R$ {totalRecebido.toLocaleString('pt-BR')}</p>
                <p className="text-[10px] uppercase font-bold text-text-secondary mt-1">Ganhos Totais</p>
              </div>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                <div className="flex justify-center mb-2"><TrendingUp className="w-5 h-5 text-indigo-500" /></div>
                <p className="text-2xl font-black text-text-main">{notas.length}</p>
                <p className="text-[10px] uppercase font-bold text-text-secondary mt-1">Avaliações</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Contato</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text-main">{prof.whatsapp}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Dados Bancários (Pix)</p>
                {prof.pix_chave ? (
                  <div>
                    <p className="text-sm font-medium text-text-main">{prof.pix_chave}</p>
                    <p className="text-xs text-text-secondary">{prof.pix_tipo || 'Não informado'}</p>
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary italic">Não cadastrado</p>
                )}
              </div>
              
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">Localização Base (Apenas Interno)</p>
                <p className="text-sm font-medium text-text-main">{prof.endereco_base_completo ? `${prof.endereco_base_completo}, ${prof.endereco_base_numero} - ${prof.endereco_base_bairro}, ${prof.endereco_base_cidade}/${prof.endereco_base_estado}` : `${prof.cidade} - ${prof.bairro}`}</p>
                {prof.endereco_base_complemento && <p className="text-xs text-text-secondary mt-1">Complemento: {prof.endereco_base_complemento}</p>}
                {prof.raio_atendimento_km && <p className="text-xs font-medium text-blue-700 mt-1">Raio de atendimento: {prof.raio_atendimento_km} km</p>}
                
                <div className="mt-4 border-t border-gray-100 pt-4">
                  {!mapIframeUrl ? null : (
                    <div className="space-y-3">
                      <div className="w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          frameBorder="0" 
                          scrolling="no" 
                          marginHeight={0} 
                          marginWidth={0} 
                          src={mapIframeUrl!} 
                          className="w-full h-full"
                        />
                      </div>
                      <a href={googleMapsUrl!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                        <MapPin className="w-4 h-4" /> Abrir no Google Maps
                      </a>
                    </div>
                  )}
                </div>
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
                 {agenda?.slice(0, 10).map(plantao => (
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

          {/* Card de Avaliações */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" /> Avaliações da Família
            </h3>
            {avaliacoesList?.length === 0 ? (
               <p className="text-xs text-text-secondary italic">Ainda não há avaliações.</p>
            ) : (
               <div className="space-y-4">
                 {avaliacoesList?.map((av, idx) => (
                   <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-yellow-50/30">
                     <div className="flex items-center gap-1 mb-2">
                       {[1,2,3,4,5].map(n => (
                         <Star key={n} className={`w-3 h-3 ${n <= av.nota ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                       ))}
                       <span className="text-xs font-bold text-gray-500 ml-2">{new Date(av.created_at).toLocaleDateString('pt-BR')}</span>
                     </div>
                     {av.comentario && <p className="text-sm text-text-main italic">"{av.comentario}"</p>}
                   </div>
                 ))}
               </div>
            )}
          </div>

          <ChecklistValidacao 
            profissionalId={prof.id} 
            initialChecklist={prof.checklist_validacao || {}} 
            isAtivoOuValidado={prof.status === 'Validado' || prof.status === 'Ativo'} 
          />

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-text-main mb-4">Gerenciar Status</h3>
            <UpdateStatusForm table="profissionais_cadastros" id={prof.id} currentStatus={prof.status} options={statusOptions} />
          </div>

          <MagicLinkManager
            profissionalId={prof.id}
            nome={prof.nome_completo.split(" ")[0]}
            whatsapp={prof.whatsapp}
            token={prof.token_acesso}
            status={prof.acesso_app_status}
            acessoToken={prof.acesso_token}
          />

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-text-main mb-4">Observações Internas</h3>
            <ObservacoesList entidadeTipo="profissional" entidadeId={prof.id} observacoes={observacoes || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
