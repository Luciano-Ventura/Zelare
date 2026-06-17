"use client";

import { useState } from "react";
import { CheckCircle2, Copy, MessageCircle, User, Briefcase, Wallet, AlertTriangle } from "lucide-react";

type Categoria = "Família" | "Profissional" | "Financeiro" | "Ocorrências";

const categorias = [
  { id: "Família", icon: User },
  { id: "Profissional", icon: Briefcase },
  { id: "Financeiro", icon: Wallet },
  { id: "Ocorrências", icon: AlertTriangle }
];

const mensagens = [
  // --- Família ---
  {
    id: "fam_solicitacao_recebida",
    categoria: "Família",
    titulo: "Solicitação recebida",
    texto: "Olá, [nome]! Tudo bem? Sou da Zelare.\nRecebemos sua solicitação para atendimento e nossa equipe já está buscando o profissional ideal na sua região.\nVocê pode acompanhar o status do seu pedido acessando o link:\n[link_acompanhamento]\nRetornaremos em breve com novidades!"
  },
  {
    id: "fam_profissional_encontrado",
    categoria: "Família",
    titulo: "Profissional encontrado",
    texto: "Boa notícia, [nome]! Encontramos um perfil compatível para o seu atendimento na data [data] às [horario].\nO profissional é [nome_profissional].\nVou te enviar os detalhes e o valor total a seguir."
  },
  {
    id: "fam_envio_valor",
    categoria: "Família",
    titulo: "Envio de valor final",
    texto: "Aqui estão os detalhes do seu atendimento:\n\nProfissional: [nome_profissional]\nData: [data] às [horario]\nValor total do plantão: R$ [valor_total]\n\nEsse valor inclui a organização do atendimento, busca de profissional compatível e acompanhamento pela Zelare."
  },
  {
    id: "fam_cobranca_pagamento",
    categoria: "Família",
    titulo: "Cobrança de pagamento",
    texto: "Olá, [nome]! Passando para lembrar que o plantão do dia [data] está aguardando confirmação de pagamento.\nPara garantir a agenda do(a) [nome_profissional], por favor realize o pagamento através deste link:\n[link_pagamento]"
  },
  {
    id: "fam_confirmacao_pagamento",
    categoria: "Família",
    titulo: "Confirmação de pagamento",
    texto: "Olá, [nome]! Recebemos a confirmação do seu pagamento.\nO plantão com [nome_profissional] no dia [data] às [horario] está **confirmado**.\nVocê pode acompanhar os detalhes em: [link_acompanhamento]"
  },
  {
    id: "fam_lembrete_plantao",
    categoria: "Família",
    titulo: "Lembrete antes do plantão",
    texto: "Lembrete da Zelare, [nome]!\nO plantão com [nome_profissional] acontecerá amanhã, dia [data] às [horario].\nQualquer dúvida, estamos à disposição por aqui."
  },
  {
    id: "fam_pedido_feedback",
    categoria: "Família",
    titulo: "Pedido de feedback",
    texto: "Olá, [nome]!\nComo foi o atendimento com [nome_profissional] no dia [data]?\nSeu feedback é muito importante para avaliarmos a qualidade dos nossos profissionais. Pode nos contar como foi?"
  },
  {
    id: "fam_acompanhamento_ocorrencia",
    categoria: "Família",
    titulo: "Acompanhamento de ocorrência",
    texto: "Olá, [nome]. Entramos em contato para informar que estamos analisando a ocorrência registrada sobre o plantão do dia [data].\nO status atual é: [status].\nAssim que tivermos uma atualização, informaremos por aqui."
  },

  // --- Profissional ---
  {
    id: "prof_cadastro_recebido",
    categoria: "Profissional",
    titulo: "Cadastro recebido",
    texto: "Olá, [nome]! Recebemos seu cadastro na Zelare.\nNossa equipe realizará uma análise inicial e entraremos em contato caso haja dúvidas ou para solicitar documentos."
  },
  {
    id: "prof_cadastro_em_analise",
    categoria: "Profissional",
    titulo: "Cadastro em análise",
    texto: "Olá, [nome]! Seu cadastro está em fase de análise pela nossa equipe. Em breve você receberá um retorno sobre a aprovação e os próximos passos."
  },
  {
    id: "prof_cadastro_aprovado",
    categoria: "Profissional",
    titulo: "Cadastro aprovado",
    texto: "Parabéns, [nome]! Seu cadastro foi validado na Zelare.\nA partir de agora você poderá receber oportunidades de plantão na sua região. Mantenha seus dados e disponibilidade sempre atualizados."
  },
  {
    id: "prof_envio_link_acesso",
    categoria: "Profissional",
    titulo: "Envio de link de acesso",
    texto: "Olá, [nome]! Acesse o painel da Zelare para verificar suas oportunidades de plantão:\n[link_profissional]\nSeu código de acesso único é enviado para este WhatsApp no login."
  },
  {
    id: "prof_nova_oportunidade",
    categoria: "Profissional",
    titulo: "Nova oportunidade de plantão",
    texto: "Olá, [nome]! Temos uma nova oportunidade de plantão compatível com você.\nData: [data] às [horario]\nVocê receberá o valor de R$ [valor_total] por este plantão.\nTem interesse em assumir? Responda confirmando!"
  },
  {
    id: "prof_confirmacao_plantao",
    categoria: "Profissional",
    titulo: "Confirmação de plantão",
    texto: "Plantão confirmado, [nome]!\nO atendimento será no dia [data] às [horario].\nTodos os detalhes de endereço e orientações estão disponíveis no seu painel: [link_profissional]"
  },
  {
    id: "prof_lembrete_checkin",
    categoria: "Profissional",
    titulo: "Lembrete de check-in",
    texto: "Olá, [nome]! O plantão do dia [data] começa em breve às [horario].\nNão se esqueça de acessar seu painel para acompanhar os detalhes e registrar sua chegada. Bom plantão!"
  },
  {
    id: "prof_confirmacao_repasse",
    categoria: "Profissional",
    titulo: "Confirmação de repasse",
    texto: "Boa notícia, [nome]!\nO repasse referente ao plantão do dia [data] no valor de R$ [valor_total] acaba de ser realizado.\nObrigado por mais um atendimento concluído com excelência!"
  },
  {
    id: "prof_solicitacao_atualizacao",
    categoria: "Profissional",
    titulo: "Atualização de disponibilidade",
    texto: "Olá, [nome]! Para garantir que enviamos as melhores oportunidades, por favor, nos confirme se houve alguma mudança na sua disponibilidade para esta semana."
  },

  // --- Financeiro ---
  {
    id: "fin_cobranca_pagamento",
    categoria: "Financeiro",
    titulo: "Cobrança de pagamento da família",
    texto: "Olá, [nome]! Para confirmar e liberar a agenda do profissional [nome_profissional] para o dia [data], por favor realize o pagamento do plantão no valor de R$ [valor_total].\nLink: [link_pagamento]"
  },
  {
    id: "fin_pagamento_confirmado",
    categoria: "Financeiro",
    titulo: "Pagamento confirmado",
    texto: "Confirmamos o pagamento do seu plantão no valor de R$ [valor_total]. O atendimento do dia [data] está garantido!"
  },
  {
    id: "fin_repasse_confirmado",
    categoria: "Financeiro",
    titulo: "Repasse ao profissional confirmado",
    texto: "Olá, [nome_profissional]! O repasse do seu plantão (Dia [data]) no valor de R$ [valor_total] foi efetuado. Verifique sua conta e qualquer dúvida nos avise."
  },
  {
    id: "fin_pagamento_pendente",
    categoria: "Financeiro",
    titulo: "Pagamento pendente",
    texto: "Olá! Consta em nosso sistema que o pagamento de R$ [valor_total] referente ao plantão do dia [data] ainda está pendente. Por favor, regularize assim que possível para evitarmos atrasos ou cancelamentos."
  },
  {
    id: "fin_reembolso",
    categoria: "Financeiro",
    titulo: "Reembolso/cancelamento em análise",
    texto: "Olá, [nome]. Recebemos sua solicitação de cancelamento. O processo de reembolso referente ao plantão do dia [data] está em análise pelo nosso time financeiro e daremos um retorno em breve."
  },

  // --- Ocorrências ---
  {
    id: "oco_recebida",
    categoria: "Ocorrências",
    titulo: "Ocorrência recebida",
    texto: "Olá, [nome]! Registramos o seu relato sobre o plantão do dia [data]. Nossa equipe está analisando as informações e fará contato em breve."
  },
  {
    id: "oco_em_analise",
    categoria: "Ocorrências",
    titulo: "Ocorrência em análise",
    texto: "Olá, [nome]. Estamos conduzindo uma análise interna referente à ocorrência do plantão de [data]. O status atual é [status]. Manteremos você informado(a)!"
  },
  {
    id: "oco_resolvida",
    categoria: "Ocorrências",
    titulo: "Ocorrência resolvida",
    texto: "Olá, [nome]. Informamos que a ocorrência referente ao dia [data] foi concluída com o status [status]. Agradecemos pela paciência e cooperação."
  },
  {
    id: "oco_info_adicionais",
    categoria: "Ocorrências",
    titulo: "Solicitação de informações adicionais",
    texto: "Olá, [nome]. Para darmos seguimento à análise da ocorrência do dia [data], precisamos que nos envie mais alguns detalhes ou comprovantes sobre o ocorrido."
  }
];

export default function MensagensPage() {
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Categoria>("Família");

  const handleCopy = (texto: string, id: string) => {
    navigator.clipboard.writeText(texto);
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 2000);
  };

  const mensagensFiltradas = mensagens.filter(m => m.categoria === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-[#2F3437] tracking-tight">Mensagens Padrão</h1>
        <p className="text-sm text-[#6B7280] mt-1">Scripts e atalhos de comunicação para agilizar o suporte no WhatsApp.</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categorias.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as Categoria)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                isActive 
                ? "bg-[#2F3437] text-white shadow-md" 
                : "bg-white text-[#6B7280] border border-gray-200 hover:bg-gray-50 hover:text-[#2F3437]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.id}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mensagensFiltradas.map((msg) => (
          <div key={msg.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col relative group">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-sm font-bold text-[#2F3437] flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#8ECADF]" />
                {msg.titulo}
              </h2>
              <button 
                onClick={() => handleCopy(msg.texto, msg.id)}
                className="text-xs font-semibold text-blue-dark bg-blue-light/10 hover:bg-blue-light/20 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                {copiadoId === msg.id ? (
                  <><CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> <span className="text-green-700">Copiado</span></>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copiar</>
                )}
              </button>
            </div>
            <div className="bg-[#FAFAF7] rounded-xl p-4 text-sm text-[#4B5563] whitespace-pre-wrap border border-gray-100 group-hover:border-[#8ECADF]/30 transition-colors">
              {msg.texto}
            </div>
            <div className="mt-4 text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full inline-block"></span>
              Dica: Substitua as variáveis [ ] pelos dados da operação.
            </div>
          </div>
        ))}
      </div>
      
      {mensagensFiltradas.length === 0 && (
        <div className="py-12 text-center text-gray-500 text-sm">
          Nenhuma mensagem cadastrada para esta categoria.
        </div>
      )}
    </div>
  );
}
