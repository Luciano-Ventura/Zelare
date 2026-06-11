import { SAFETY_CARDS } from "@/lib/constants";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function SafetySection() {
  return (
    <section id="seguranca" className="py-14 lg:py-24 bg-bg-main">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-sand-light/50 px-3 py-1 text-sm font-medium text-text-main mb-6">
              <ShieldCheck className="h-4 w-4" />
              Segurança em primeiro lugar
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl mb-6">
              Segurança vem antes de qualquer atendimento
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              A Zelare está em fase inicial de validação e trabalha com acompanhamento manual para organizar solicitações, analisar profissionais e orientar os primeiros plantões.
            </p>
            
            <div className="rounded-2xl bg-sand-light/30 p-6 flex gap-4 items-start ring-1 ring-sand-light/50">
              <AlertTriangle className="h-6 w-6 text-text-secondary shrink-0" />
              <p className="text-sm text-text-secondary">
                <strong className="font-semibold block mb-1 text-text-main">Atenção:</strong>
                Em casos de urgência, emergência médica ou risco imediato, procure o SAMU, hospital ou serviço de emergência da sua região.
              </p>
            </div>
          </div>

          <div className="flex-1 grid gap-4 sm:gap-6 sm:grid-cols-2 w-full">
            {SAFETY_CARDS.map((card, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-sand-light/50 flex flex-col gap-2">
                <div className="h-2 w-8 bg-blue-light rounded-full mb-2" />
                <h3 className="font-semibold text-text-main">
                  {card.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
