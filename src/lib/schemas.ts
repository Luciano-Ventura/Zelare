import { z } from "zod";

export const familiaSchema = z.object({
  nome_completo: z.string().min(3, "Nome deve ter no mínimo 3 caracteres."),
  whatsapp: z.string().refine(v => {
    const digits = v.replace(/\D/g, "");
    return digits.length === 10 || digits.length === 11;
  }, "O WhatsApp deve ter 10 ou 11 dígitos. Ex: (48) 99999-9999"),
  cidade: z.string().min(2, "A cidade é obrigatória."),
  bairro: z.string().min(2, "O bairro é obrigatório."),
  para_quem: z.string().min(2, "Informe para quem é o cuidado."),
  tipo_profissional: z.string().min(2, "Informe o tipo de profissional desejado."),
  data_desejada: z.string().min(2, "Informe a data desejada."),
  horario_desejado: z.string().min(2, "Informe o horário desejado."),
  duracao_plantao: z.string().min(2, "Informe a duração do plantão."),
  e_urgente: z.boolean().optional(),
  atividades_necessarias: z.string().optional(),
  valor_sugerido: z.string().optional(),
  observacoes: z.string().optional(),
  
  // Consentimentos
  contact_accepted: z.literal(true, {
    message: "Você deve aceitar o contato via WhatsApp."
  }),
  privacy_accepted: z.literal(true, {
    message: "Você deve aceitar a Política de Privacidade."
  }),

  // Tracking oculto
  source: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export const profissionalSchema = z.object({
  nome_completo: z.string().min(3, "Nome deve ter no mínimo 3 caracteres."),
  whatsapp: z.string().refine(v => {
    const digits = v.replace(/\D/g, "");
    return digits.length === 10 || digits.length === 11;
  }, "O WhatsApp deve ter 10 ou 11 dígitos. Ex: (48) 99999-9999"),
  cidade: z.string().min(2, "A cidade é obrigatória."),
  bairro: z.string().min(2, "O bairro é obrigatório."),
  categoria_profissional: z.string().min(2, "Informe sua categoria."),
  tipos_atendimento: z.string().min(2, "Informe os tipos de atendimento que aceita."),
  tempo_experiencia: z.string().min(1, "Informe o tempo de experiência."),
  possui_formacao: z.boolean().optional(),
  descricao_experiencia: z.string().optional(),
  disponibilidade: z.string().min(2, "Informe sua disponibilidade."),
  regioes_atende: z.string().min(2, "Informe as regiões que atende."),
  valor_medio: z.string().optional(),
  possui_referencias: z.boolean().optional(),
  observacoes: z.string().optional(),

  // Consentimentos
  contact_accepted: z.literal(true, {
    message: "Você deve aceitar o contato via WhatsApp."
  }),
  privacy_accepted: z.literal(true, {
    message: "Você deve aceitar a Política de Privacidade."
  }),
  veracity_accepted: z.literal(true, {
    message: "Você deve declarar que as informações são verdadeiras."
  }),

  // Tracking oculto
  source: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
});

export type FamiliaData = z.infer<typeof familiaSchema>;
export type ProfissionalData = z.infer<typeof profissionalSchema>;
