import { TRUST_CARDS } from "@/lib/constants";

export default function TrustSection() {
  return (
    <section className="py-14 lg:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
            Cuidado com acolhimento, responsabilidade e proximidade.
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-8 rounded-3xl bg-bg-main ring-1 ring-sand-light/50 transition-transform hover:-translate-y-1"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-light/10 text-blue-light mb-6">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-text-main mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
