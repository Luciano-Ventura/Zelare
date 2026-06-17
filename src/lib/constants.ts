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
    title: "Atendimento em expansão",
    description: "A Zelare está em expansão para conectar famílias a profissionais pelo Brasil, sujeito a disponibilidade na região.",
    icon: MapPin,
  },
];

export const HOW_IT_WORKS_STEPS = [
  { step: "1", title: "Você solicita o cuidado", description: "Informe o tipo de atendimento, local, data, horário e principais necessidades da pessoa que receberá o cuidado." },
  { step: "2", title: "A Zelare analisa sua solicitação", description: "Nossa equipe avalia a região, duração, tipo de cuidado, complexidade e disponibilidade de profissionais compatíveis." },
  { step: "3", title: "Buscamos profissionais cadastrados e analisados", description: "A Zelare procura profissionais com perfil compatível, considerando região de atendimento, disponibilidade, experiência e agenda." },
  { step: "4", title: "Você recebe o valor final do plantão", description: "O valor é informado pela Zelare com base nas características do atendimento e já considera a organização, triagem, acompanhamento e suporte da operação." },
  { step: "5", title: "O plantão é confirmado após o pagamento", description: "Após a confirmação da família e o pagamento online, o plantão é confirmado e acompanhado pela Zelare." },
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
    question: "A família pode escolher quanto quer pagar?",
    answer: "Não. Para manter uma operação organizada e justa para famílias e profissionais, a Zelare calcula o valor do plantão com base na região, duração, horário, tipo de cuidado e disponibilidade dos profissionais. A família recebe o valor final antes de confirmar o atendimento."
  },
  {
    question: "A Zelare cobra alguma taxa separada?",
    answer: "A família recebe um valor final do plantão. Esse valor já considera a operação da Zelare, incluindo análise da solicitação, triagem, busca de profissional compatível, organização, confirmação e acompanhamento do atendimento."
  },
  {
    question: "Quando o plantão é confirmado?",
    answer: "O plantão é confirmado após a família aceitar o valor informado e realizar o pagamento online."
  },
  {
    question: "O que está incluído no valor do plantão?",
    answer: "O valor inclui o atendimento combinado com o profissional e a operação da Zelare para organizar o plantão, analisar a solicitação, buscar profissionais compatíveis, acompanhar a confirmação e oferecer suporte durante o processo."
  },
  {
    question: "O valor pode mudar?",
    answer: "O valor pode variar conforme região, horário, duração, complexidade, urgência, deslocamento e disponibilidade de profissionais. A família sempre será informada do valor final antes da confirmação."
  },
  {
    question: "A Zelare faz atendimento médico?",
    answer: "Não. A Zelare conecta famílias a profissionais de cuidado. Casos de urgência, emergência ou atendimento médico devem ser direcionados aos serviços adequados."
  },
  {
    question: "Quais regiões são atendidas?",
    answer: "A Zelare está em expansão pelo Brasil. A disponibilidade do atendimento depende da região, do tipo de cuidado e dos profissionais cadastrados no momento da solicitação."
  }
];
