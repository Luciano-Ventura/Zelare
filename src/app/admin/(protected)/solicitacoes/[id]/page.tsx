import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { ArrowLeft, MessageCircle, CalendarClock, UserCheck, AlertTriangle } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { notFound } from "next/navigation";
import { UpdateStatusForm } from "./UpdateStatusForm";
import { ObservacoesList } from "@/components/admin/ObservacoesList";

import { EditSolicitacaoModal } from "@/components/admin/EditSolicitacaoModal";
import { StartPlantaoModal } from "@/components/admin/StartPlantaoModal";
import { DeleteSolicitacaoButton } from "@/components/admin/DeleteSolicitacaoButton";
import { DeletePlantaoButton } from "@/components/admin/DeletePlantaoButton";
import { ConfirmarPagamentoButton } from "@/components/admin/ConfirmarPagamentoButton";
import { ConvidarProfissionalButton } from "@/components/admin/ConvidarProfissionalButton";
import { FinanceiroSolicitacaoCard } from "@/components/admin/FinanceiroSolicitacaoCard";
import { AddOcorrenciaAdminModal } from "@/components/admin/AddOcorrenciaAdminModal";
import { Copy, MapPin } from "lucide-react";
import { calcularDistanciaKm } from "@/lib/geo";

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
    .select("id, nome_completo, whatsapp, categoria_profissional, cidade, bairro, regioes_atende, status, latitude_base, longitude_base, raio_atendimento_km, localizacao_pendente, valor_minimo_4h, valor_minimo_6h, valor_minimo_8h, valor_minimo_12h, valor_minimo_24h, adicional_noturno, adicional_urgencia")
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

  // Buscar pacotes desta solicitação
  const { data: pacotesDaSolicitacao } = await supabaseAdmin
    .from("pacotes_plantoes")
    .select("*")
    .eq("solicitacao_id", resolvedParams.id)
    .order("created_at", { ascending: false });

  // Buscar plantões avulsos desta solicitação
  const { data: plantoesDaSolicitacao } = await supabaseAdmin
    .from("plantoes")
    .select("*")
    .eq("solicitacao_id", resolvedParams.id)
    .is("pacote_id", null)
    .order("created_at", { ascending: false });

  // Buscar pagamentos desta solicitação
  const { data: pagamentos } = await supabaseAdmin
    .from("pagamentos")
    .select("*")
    .eq("solicitacao_id", resolvedParams.id);

  // Buscar repasses dos plantões desta solicitação
  const plantaoIds = [...(pacotesDaSolicitacao || []).map(p => p.id), ...(plantoesDaSolicitacao || []).map(p => p.id)];
  let repasses: any[] = [];
  if (plantaoIds.length > 0) {
    const { data: r } = await supabaseAdmin
      .from("repasses_profissionais")
      .select("*")
      .in("plantao_id", plantaoIds);
    if (r) repasses = r;
  }

  // Buscar ocorrencias da solicitacao
  const { data: ocorrencias } = await supabaseAdmin
    .from("ocorrencias")
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
    "Aguardando pagamento",
    "Pagamento confirmado",
    "Confirmado",
    "Em andamento",
    "Concluído",
    "Cancelado",
    "Sem profissional disponível",
    "Perdido"
  ].filter(opt => {
    // Bloquear a seleção manual de Confirmado / Pagamento confirmado se estiver Aguardando pagamento
    if (solic.status === "Aguardando pagamento") {
      return opt !== "Confirmado" && opt !== "Pagamento confirmado";
    }
    return true;
  });

  let finalInicioEm = "";
  let finalFimEm = "";
  if (solic.data_desejada && solic.horario_desejado && solic.duracao_plantao) {
    const dateParts = solic.data_desejada.includes('/') ? solic.data_desejada.split('/') : solic.data_desejada.split('-');
    const [d, m, y] = solic.data_desejada.includes('/') ? dateParts : dateParts.reverse();
    const dataIso = `${y}-${m}-${d}`;
    const startIso = `${dataIso}T${solic.horario_desejado}:00-03:00`;
    const startDate = new Date(startIso);
    
    if (!isNaN(startDate.getTime())) {
      // Simplification for duracao mapping
      let duracaoHoras = 12; // default
      if (solic.duracao_plantao.includes("24h")) duracaoHoras = 24;
      else if (solic.duracao_plantao.includes("8h")) duracaoHoras = 8;
      else if (solic.duracao_plantao.includes("6h")) duracaoHoras = 6;
      else if (solic.duracao_plantao.includes("4h")) duracaoHoras = 4;
      
      const endDate = new Date(startDate.getTime() + duracaoHoras * 60 * 60 * 1000);
      finalInicioEm = startDate.toISOString();
      finalFimEm = endDate.toISOString();
    }
  }

  // Verificar disponibilidade rígida (considerando sobreposição)
  const isOcupado = (profId: string) => {
    if (!finalInicioEm || !finalFimEm) {
      // Fallback: se não conseguiu parsear a data, verifica se ele tem qualquer plantão ativo agora
      return ocupacoesAtivas?.some(o => o.profissional_id === profId) || false;
    }
    return ocupacoesAtivas?.some(o => {
      if (o.profissional_id !== profId) return false;
      if (!o.inicio_em || !o.fim_em) return false;
      // inicio_em < novo_fim AND fim_em > novo_inicio
      return (o.inicio_em < finalFimEm && o.fim_em > finalInicioEm);
    }) || false;
  };

  // Profissionais compatíveis por Raio (Geolocalização)
  const profsComGeo = profissionais?.filter(p => !p.localizacao_pendente && p.latitude_base && p.longitude_base) || [];
  const profsSemGeo = profissionais?.filter(p => p.localizacao_pendente || !p.latitude_base || !p.longitude_base) || [];

  let profsCompativeisGeo = [];
  
  if (solic.latitude && solic.longitude) {
    profsCompativeisGeo = profsComGeo.map(p => {
      const dist = calcularDistanciaKm(solic.latitude!, solic.longitude!, p.latitude_base!, p.longitude_base!);
      return { ...p, distancia_km: dist };
    })
    .filter(p => p.distancia_km <= (p.raio_atendimento_km || 10))
    .filter(p => p.categoria_profissional?.toLowerCase().includes(solic.tipo_profissional?.toLowerCase() || ""))
    .filter(p => !isOcupado(p.id)) // Apenas livres
    .sort((a, b) => {
      if (solic.preferencia_atendimento === "Opção mais econômica") {
        const precoA = a.valor_minimo_12h || 9999;
        const precoB = b.valor_minimo_12h || 9999;
        if (precoA !== precoB) return precoA - precoB;
      }
      // Fallback para distância
      return a.distancia_km - b.distancia_km;
    })
    .slice(0, 10);
  } else {
    // Fallback: se a família não tem lat/long, busca apenas pela cidade
    profsCompativeisGeo = profsComGeo.filter(p => 
      p.cidade?.toLowerCase() === solic.cidade?.toLowerCase() &&
      p.categoria_profissional?.toLowerCase().includes(solic.tipo_profissional?.toLowerCase() || "") &&
      !isOcupado(p.id)
    ).map(p => ({ ...p, distancia_km: null }))
    .sort((a, b) => {
      if (solic.preferencia_atendimento === "Opção mais econômica") {
        const precoA = a.valor_minimo_12h || 9999;
        const precoB = b.valor_minimo_12h || 9999;
        return precoA - precoB;
      }
      return 0;
    })
    .slice(0, 10);
  }

  const addressQuery = encodeURIComponent(`${solic.cep || ''} ${solic.endereco_completo || ''} ${solic.numero || ''} ${solic.cidade || ''}`.replace(/\s+/g, ' ').trim());
  const geoQuery = solic.latitude && solic.longitude ? `${solic.latitude},${solic.longitude}` : addressQuery;

  const mapIframeUrl = geoQuery ? `https://maps.google.com/maps?q=${geoQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed` : null;
  const googleMapsUrl = geoQuery ? `https://www.google.com/maps/search/?api=1&query=${geoQuery}` : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/solicitacoes" prefetch={false} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-text-secondary">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">Detalhes da Solicitação</h1>
          <p className="text-sm text-text-secondary">ID: {solic.id}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <EditSolicitacaoModal solic={solic} />
          <DeleteSolicitacaoButton id={solic.id} />
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

      {solic.status === "Aguardando pagamento" && (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-4 items-start">
          <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-orange-900">Atenção ao Pagamento</h3>
            <p className="text-xs text-orange-800 mt-1">
              Este plantão ainda está aguardando pagamento. Confirme o pagamento no módulo financeiro antes de confirmar o plantão.<br />
              <strong className="block mt-1 uppercase text-[10px]">Não libere contato direto ou endereço completo antes do pagamento confirmado.</strong>
            </p>
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
                <p className="text-sm font-medium text-text-main">{solic.endereco_completo ? `${solic.endereco_completo}, ${solic.endereco_numero} - ${solic.endereco_bairro}, ${solic.endereco_cidade}/${solic.endereco_estado}` : `${solic.cidade} - ${solic.bairro}`}</p>
                {solic.endereco_complemento && <p className="text-xs text-text-secondary">Complemento: {solic.endereco_complemento}</p>}
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
                <p className="text-sm font-medium text-text-main">
                  {solic.data_desejada} - das {solic.horario_desejado} às {solic.horario_fim || "?"}
                </p>
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
              {/* Mapa Iframe */}
              <div className="sm:col-span-2 mt-4 border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Mapa da Solicitação
                </p>
                {!solic.latitude || !solic.longitude ? (
                  <div className="p-4 bg-orange-50 text-orange-800 text-sm rounded-xl border border-orange-100 mb-4">
                    Esta solicitação ainda não possui latitude/longitude precisos. O mapa abaixo utiliza o endereço base.
                  </div>
                ) : null}
                
                {mapIframeUrl ? (
                  <div className="space-y-3">
                    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200">
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
                ) : null}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#8ECADF]" /> Profissionais Compatíveis (Raio)
            </h3>
            <p className="text-xs text-text-secondary mb-4">
              Estes profissionais estão dentro do raio de atendimento e possuem categoria compatível, além de aparentarem estar sem conflito de agenda.
            </p>
            {profsCompativeisGeo.length === 0 ? (
               <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-sm text-orange-800">
                 Nenhum profissional validado encontrado dentro do raio de atendimento com a categoria solicitada.
               </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profsCompativeisGeo.map(p => {
                  const convite = oportunidades?.find(o => o.profissional_id === p.id);
                  return (
                    <div key={p.id} data-testid="card-profissional-compativel" className="p-4 border border-gray-100 rounded-xl flex flex-col justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="mb-3">
                        <Link href={`/admin/profissionais/${p.id}`} prefetch={false} className="text-sm font-bold text-text-main hover:text-[#8ECADF]">{p.nome_completo}</Link>
                        <p className="text-[10px] uppercase font-bold text-text-secondary mt-1">{p.categoria_profissional}</p>
                        <p className="text-xs text-text-secondary mt-1">{p.cidade} - {p.bairro}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {p.distancia_km !== null && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-medium border border-blue-200">
                              Distância: {p.distancia_km.toFixed(1)} km
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-[10px] font-medium border border-green-200">
                            Dentro do raio ({p.raio_atendimento_km || 10}km)
                          </span>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-medium border border-emerald-200">
                            Livre para este plantão
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 mt-4">
                        <ConvidarProfissionalButton 
                          solicitacaoId={solic.id} 
                          profissionalId={p.id} 
                          jaConvidado={!!convite} 
                          statusConvite={convite?.status}
                          valorContraproposta={convite?.valor_contraproposta}
                        />
                        <div className="flex gap-2">
                          <Link href={`/admin/profissionais/${p.id}`} prefetch={false} className="flex-1 text-center text-xs font-medium bg-white border border-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            Ver Perfil
                          </Link>
                          {p.whatsapp && (
                            <a href={`https://wa.me/55${p.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs font-medium bg-green-50 border border-green-200 text-green-700 py-2 rounded-lg hover:bg-green-100 transition-colors">
                              WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {profsSemGeo.length > 0 && (
              <div className="mt-8">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Profissionais Sem Localização (Pendente)</h4>
                <div className="flex flex-wrap gap-2">
                  {profsSemGeo.map(p => (
                    <Link key={p.id} href={`/admin/profissionais/${p.id}`} className="text-xs bg-gray-100 border border-gray-200 px-2 py-1 rounded text-text-secondary hover:bg-gray-200">
                      {p.nome_completo} ({p.cidade})
                    </Link>
                  ))}
                </div>
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
              solicEstado={solic.endereco_estado || solic.estado}
              solicCidade={solic.endereco_cidade || solic.cidade}
              profissionais={profissionais || []}
              ocupacoes={ocupacoesAtivas || []}
              defaultData={solic.data_desejada}
              defaultHorario={solic.horario_desejado}
              defaultDuracao={solic.duracao_plantao}
            />

            {pacotesDaSolicitacao && pacotesDaSolicitacao.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Pacotes Gerados ({pacotesDaSolicitacao.length})</h4>
                <div className="space-y-3">
                  {pacotesDaSolicitacao.map((pc: any) => (
                    <div key={pc.id} className="bg-[#FAFAF7] border border-[#8ECADF]/30 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-text-main">PACOTE: {pc.profissional_nome}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{pc.quantidade_criada} plantões entre {pc.data_inicio.split("-").reverse().join("/")} e {pc.data_fim.split("-").reverse().join("/")}</p>
                        <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-wider">{pc.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <ConfirmarPagamentoButton pacoteId={pc.id} solicitacaoId={solic.id} currentStatus={pc.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {plantoesDaSolicitacao && plantoesDaSolicitacao.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">Plantões Avulsos ({plantoesDaSolicitacao.length})</h4>
                <div className="space-y-3">
                  {plantoesDaSolicitacao.map(pl => (
                    <div key={pl.id} className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-text-main">{pl.profissional_nome}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{pl.data_plantao} às {pl.horario_inicio}</p>
                        <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-wider">{pl.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <ConfirmarPagamentoButton plantaoId={pl.id} solicitacaoId={solic.id} currentStatus={pl.status} />
                        {/* AQUI VIRÁ EDITAR PLANTAO DEPOIS */}
                        <DeletePlantaoButton plantaoId={pl.id} solicitacaoId={solic.id} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <FinanceiroSolicitacaoCard 
            pagamentos={pagamentos || []} 
            repasses={repasses || []} 
            solicitacaoId={solic.id} 
          />

          <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Ocorrências Relacionadas ({ocorrencias?.length || 0})
              </h3>
              <AddOcorrenciaAdminModal solicitacaoId={solic.id} />
            </div>
            
            {ocorrencias && ocorrencias.length > 0 ? (
              <div className="space-y-3">
                {ocorrencias.map((oco: any) => (
                  <div key={oco.id} className="bg-white border border-red-200 p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-bold text-gray-800">{oco.tipo_ocorrencia}</p>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        oco.status === "Aberta" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                      }`}>
                        {oco.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{oco.descricao}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>Aberta por: <strong className="text-gray-700">{oco.aberta_por || oco.responsavel || "Sistema"}</strong></span>
                      <span>Gravidade: <strong className="text-gray-700">{oco.gravidade}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-red-600">Nenhuma ocorrência registrada para esta solicitação.</p>
            )}
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
