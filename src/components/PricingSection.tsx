import { ShieldCheck } from "lucide-react";

export default function PricingSection() {
  return (
    <section id="valores" className="py-14 lg:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <div className="flex-1 w-full relative hidden sm:block order-2 lg:order-1">
            <div className="bg-sand-light/10 p-8 rounded-3xl ring-1 ring-sand-light/50 flex flex-col gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
                <div className="absolute -top-3 -right-3 bg-blue-light text-white p-2 rounded-full shadow-md">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                  Fatores considerados
                </h3>
                <ul className="space-y-3">
                  {[
                    "Região do atendimento",
                    "Duração do plantão",
                    "Horário diurno ou noturno",
                    "Tipo de cuidado necessário",
                    "Complexidade do atendimento",
                    "Disponibilidade de profissionais",
                    "Deslocamento",
                    "Recorrência ou plantão avulso",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-text-main text-sm font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-light" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex-1 order-1 lg:order-2">
            <h2 className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl mb-6">
              Como o valor é definido?
            </h2>
            <p className="text-lg text-text-secondary mb-6 leading-relaxed">
              O valor do plantão é calculado pela Zelare após a análise da solicitação. A família recebe o valor final antes da confirmação. O plantão só é confirmado após o aceite e pagamento.
            </p>
            <p className="text-md text-text-main font-medium leading-relaxed bg-blue-light/5 p-5 rounded-2xl border border-blue-light/20">
              O valor final inclui a busca de profissionais, triagem, organização do atendimento, confirmação, acompanhamento operacional e suporte da Zelare.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
