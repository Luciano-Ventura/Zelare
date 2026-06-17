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
    description: "Triagem inicial manual",
    icon: UserCheck
  },
  {
    title: "Atendimento humanizado",
    description: "Apoio próximo pelo WhatsApp",
    icon: HeartHandshake
  },
  {
    title: "Combinação clara",
    description: "Horário, valor e cuidado alinhados antes do plantão",
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
    title: "Cadastro analisado",
    description: "Profissionais passam por uma triagem inicial antes de receber oportunidades.",
    icon: UserCheck,
  },
  {
    title: "Atendimento acompanhado",
    description: "A Zelare acompanha os primeiros contatos de forma manual pelo WhatsApp.",
    icon: HeartHandshake,
  },
  {
    title: "Combinação clara",
    description: "Nossa equipe alinha horário, local, valor e tipo de cuidado com o profissional antes da sua confirmação.",
    icon: ShieldCheck,
  },
  {
    title: "Foco regional",
    description: "Atuação inicial em São José, Florianópolis, Palhoça, Biguaçu e região.",
    icon: MapPin,
  },
];

export const HOW_IT_WORKS_STEPS = [
  { step: "1", title: "Você solicita o cuidado", description: "Informe região, data, horário, tipo de cuidado e observações importantes." },
  { step: "2", title: "A Zelare analisa o pedido", description: "Nossa equipe entende a necessidade e verifica o perfil ideal para o atendimento." },
  { step: "3", title: "Profissionais disponíveis respondem", description: "Profissionais cadastrados podem aceitar, recusar ou enviar uma contraproposta." },
  { step: "4", title: "O plantão é combinado", description: "Nossa equipe seleciona o perfil ideal e você aprova antes de realizar o pagamento." },
  { step: "5", title: "Você avalia o atendimento", description: "Após o plantão, coletamos a avaliação para melhorar a qualidade da rede." },
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
    question: "A Zelare já é um aplicativo?",
    answer: "Não. A Zelare está em fase inicial de validação, com atendimento via landing page, formulários e WhatsApp. O objetivo é validar a demanda antes de construir uma plataforma completa."
  },
  {
    question: "Como solicito um cuidado?",
    answer: "Você preenche o formulário informando região, data, horário, duração e tipo de cuidado necessário. Depois, nossa equipe entra em contato pelo WhatsApp."
  },
  {
    question: "A Zelare garante profissional disponível?",
    answer: "Não garantimos disponibilidade imediata. A confirmação depende da região, horário, tipo de cuidado e profissionais cadastrados."
  },
  {
    question: "Quem define o valor do plantão?",
    answer: "O valor pode ser sugerido pela família e alinhado com o profissional disponível. Em alguns casos, o profissional poderá enviar uma contraproposta."
  },
  {
    question: "A Zelare cobra alguma taxa?",
    answer: "Sim. A Zelare poderá cobrar uma taxa de serviço sobre plantões fechados. Tudo será informado com clareza antes da confirmação."
  },
  {
    question: "Quais profissionais podem se cadastrar?",
    answer: "Cuidadores, babás, técnicos de enfermagem, enfermeiros e profissionais com experiência em cuidado domiciliar."
  },
  {
    question: "A Zelare faz atendimento médico?",
    answer: "Não. A Zelare conecta famílias a profissionais de cuidado. Casos de urgência, emergência ou atendimento médico devem ser direcionados aos serviços adequados."
  },
  {
    question: "Quais regiões são atendidas?",
    answer: "Inicialmente, a Zelare pretende atuar em Areias, São José, Florianópolis, Palhoça, Biguaçu e região."
  }
];
