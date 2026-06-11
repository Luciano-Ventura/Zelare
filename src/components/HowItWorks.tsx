import { HOW_IT_WORKS_STEPS } from "@/lib/constants";

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-14 lg:py-24 bg-sand-light/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl mb-4">
            Como funciona a Zelare
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Em poucos passos, sua família informa a necessidade e nossa equipe busca profissionais disponíveis.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-8 top-8 -bottom-8 w-0.5 bg-sand-light hidden md:block" />

          <div className="space-y-8 lg:space-y-12">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <div key={index} className="relative flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl font-bold text-blue-light shadow-sm ring-1 ring-sand-light z-10">
                  {step.step}
                </div>
                <div className="flex-1 bg-white p-6 lg:p-8 rounded-3xl shadow-sm ring-1 ring-sand-light/50">
                  <h3 className="text-xl font-semibold text-text-main mb-2">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
