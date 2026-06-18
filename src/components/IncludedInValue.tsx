import { CheckCircle2 } from "lucide-react";

export default function IncludedInValue() {
  const INCLUDED_ITEMS = [
    "Análise da solicitação",
    "Busca de profissional compatível",
    "Triagem e validação cadastral",
    "Organização do plantão",
    "Confirmação do atendimento",
    "Acompanhamento operacional",
    "Suporte durante o processo"
  ];

  return (
    <section className="py-14 lg:py-24 bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl mb-4">
            O que está incluído no valor do plantão?
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            O valor final do plantão considera as características do atendimento e a operação da Zelare para organizar tudo com mais segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {INCLUDED_ITEMS.map((item, index) => (
            <div key={index} className="flex items-start gap-3 bg-bg-main p-6 rounded-2xl ring-1 ring-sand-light/50">
              <CheckCircle2 className="h-6 w-6 text-blue-light shrink-0" />
              <span className="text-text-main font-medium">{item}</span>
            </div>
          ))}
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <p className="text-text-secondary">
            A família recebe o valor final antes da confirmação. O plantão só é confirmado após aceite e pagamento.
          </p>
        </div>
      </div>
    </section>
  );
}
