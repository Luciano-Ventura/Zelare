import {
  HeartHandshake,
  ShieldCheck,
  UserCheck,
  MapPin,
  Clock,
  HeartPulse,
  Baby,
  Cross
} from "lucide-react";

const WHATSAPP_NUMBER = "5548999999999"; // Substituir pelo número real

export const LINKS = {
  requestCare: "/solicitar-cuidado",
  professionalRegistration: "/cadastro-profissional",
  whatsappFamily: `https://wa.me/${WHATSAPP_NUMBER}?text=Ol%C3%A1!%20Quero%20solicitar%20um%20cuidado%20pela%20Zelare.`,
  whatsappProfessional: `https://wa.me/${WHATSAPP_NUMBER}?text=Ol%C3%A1!%20Quero%20me%20cadastrar%20como%20profissional%20na%20Zelare.`,
  whatsappGeneral: `https://wa.me/${WHATSAPP_NUMBER}?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20a%20Zelare.`,
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}?text=Ol%C3%A1!%20Quero%20saber%20mais%20sobre%20a%20Zelare.`
};

export const NAVIGATION = [
  { name: "Como funciona", href: "#como-funciona" },
  { name: "Para famílias", href: "#para-familias" },
  { name: "Para profissionais", href: "#para-profissionais" },
  { name: "Segurança", href: "#seguranca" },
  { name: "Dúvidas", href: "#faq" },
];

export const HERO_CARDS = [
  {
    title: "Profissionais cadastrados e analisados",
    description: "Triagem inicial cuidadosa",
    icon: UserCheck
  },
  {
    title: "Atendimento acompanhado",
    description: "Organização e acompanhamento operacional",
    icon: HeartHandshake
  },
  {
    title: "Pagamento centralizado",
    description: "Segurança e praticidade na Zelare",
    icon: ShieldCheck
  }
];

export const HERO_IMAGES = [
  {
    desktopSrc: "/images/hero/hero_new_2_desktop.webp",
    mobileSrc: "/images/hero/hero_new_2_mobile.webp",
    alt: "Cuidadora conversando alegremente com idosa em casa"
  },
  {
    desktopSrc: "/images/hero/hero_new_3_desktop.webp",
    mobileSrc: "/images/hero/hero_new_3_mobile.webp",
    alt: "Idosa sorrindo na cadeira de rodas em um parque com sua cuidadora"
  },
  {
    desktopSrc: "/images/hero/hero_new_1_desktop.webp",
    mobileSrc: "/images/hero/hero_new_1_mobile.webp",
    alt: "Mãos demonstrando cuidado, confiança e acolhimento"
  }
];

export const TRUST_CARDS = [
  {
    title: "Profissionais analisados",
    description: "Profissionais cadastrados passam por análise.",
    icon: UserCheck,
  },
  {
    title: "Atendimento organizado",
    description: "A Zelare organiza e acompanha a operação.",
    icon: HeartHandshake,
  },
  {
    title: "Pagamento centralizado",
    description: "Centralizamos e facilitamos o pagamento.",
    icon: ShieldCheck,
  },
  {
    title: "Solicitações avaliadas",
    description: "Cada caso é avaliado individualmente pela equipe.",
    icon: MapPin,
  },
];

export const HOW_IT_WORKS_STEPS = [
  { step: "1", title: "Você solicita o cuidado", description: "Informe quem precisa de atendimento, o tipo de cuidado, local, data, horário e principais necessidades." },
  { step: "2", title: "A Zelare analisa sua solicitação", description: "Avaliamos região, duração, horário, complexidade, urgência e disponibilidade de profissionais compatíveis." },
  { step: "3", title: "Buscamos profissionais analisados", description: "Selecionamos profissionais considerando região de atendimento, experiência, disponibilidade e perfil do cuidado." },
  { step: "4", title: "Você recebe o valor final", description: "O valor é informado pela Zelare após análise da solicitação e já considera a organização, busca, triagem, confirmação e acompanhamento." },
  { step: "5", title: "O plantão é confirmado", description: "Depois do aceite da família e pagamento, a Zelare confirma o plantão e acompanha o atendimento." },
];

export const CARE_TYPES = [
  { title: "Idosos", description: "Acompanhamento, companhia e apoio na rotina.", icon: UserCheck },
  { title: "Pessoas acamadas", description: "Apoio diário conforme a necessidade da família.", icon: HeartPulse },
  { title: "Pós-cirúrgico", description: "Suporte durante o período de recuperação.", icon: Cross },
  { title: "Alzheimer, Parkinson e demência", description: "Acompanhamento com paciência, atenção e cuidado humanizado.", icon: ShieldCheck },
  { title: "Babás", description: "Apoio para famílias que precisam de cuidado infantil.", icon: Baby },
  { title: "Técnicos e enfermeiros", description: "Profissionais para demandas que exigem formação técnica ou superior.", icon: HeartHandshake },
];

export const FAMILY_SERVICES = [
  "Cuidador para idoso",
  "Acompanhante para pessoa acamada",
  "Apoio noturno",
  "Plantão diurno",
  "Cuidado pós-cirúrgico",
  "Babá",
  "Técnico de enfermagem",
  "Enfermeiro",
];

export const PROFESSIONAL_BENEFITS = [
  "Receba oportunidades de plantão",
  "Informe sua disponibilidade",
  "Atue na sua região",
  "Aceite, recuse ou envie contraproposta",
  "Cadastro gratuito nesta fase inicial"
];

export const PROFESSIONAL_OPPORTUNITIES = [
  "Cuidador de idosos",
  "Babá",
  "Técnico de enfermagem",
  "Enfermeiro",
  "Acompanhante hospitalar",
  "Cuidador de pessoas acamadas",
  "Profissional com experiência em Alzheimer, Parkinson ou demência",
];

export const SAFETY_CARDS = [
  { title: "Cadastro analisado", description: "Triagem inicial das informações enviadas." },
  { title: "Informações claras", description: "Horário, valor e tipo de cuidado alinhados antes da confirmação." },
  { title: "Avaliação pós-atendimento", description: "Feedback após o plantão para melhorar a rede." },
  { title: "Expectativas reais", description: "A disponibilidade depende da região, horário e profissionais cadastrados." },
];

export const FAQS = [
  {
    question: "A família pode escolher quanto quer pagar?",
    answer: "Não. Para manter uma operação organizada e justa, a Zelare calcula o valor do plantão com base na região, duração, horário, tipo de cuidado, complexidade e disponibilidade profissional. A família recebe o valor final antes de confirmar."
  },
  {
    question: "A Zelare cobra taxa separada?",
    answer: "A família recebe um valor final do plantão. Esse valor já considera a operação da Zelare, incluindo análise da solicitação, busca de profissional compatível, triagem, confirmação, organização e acompanhamento."
  },
  {
    question: "Quando o plantão é confirmado?",
    answer: "O plantão é confirmado após a família aceitar o valor informado e realizar o pagamento."
  },
  {
    question: "O que está incluído no valor?",
    answer: "O valor inclui o atendimento combinado e a operação da Zelare para organizar, confirmar e acompanhar o plantão."
  },
  {
    question: "O valor pode mudar?",
    answer: "O valor pode variar conforme região, duração, horário, urgência, complexidade, deslocamento e disponibilidade de profissionais. A família sempre será informada do valor final antes da confirmação."
  },
  {
    question: "A Zelare atende emergências?",
    answer: "Não. A Zelare não é serviço de emergência e não substitui atendimento médico, hospitalar ou SAMU. Em casos urgentes de saúde, procure os canais oficiais de emergência."
  },
  {
    question: "Já solicitei um cuidado. Como acompanho?",
    answer: "Acesse \"Acompanhar plantão\" e informe o código enviado pela Zelare."
  }
];
