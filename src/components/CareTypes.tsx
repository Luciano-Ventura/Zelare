import { CARE_TYPES } from "@/lib/constants";
import { AlertCircle } from "lucide-react";

export default function CareTypes() {
  return (
    <section className="py-14 lg:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl">
            Tipos de cuidado
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10 lg:mb-12">
          {CARE_TYPES.map((type, index) => {
            const Icon = type.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-2xl bg-bg-main ring-1 ring-sand-light/50 transition-colors hover:bg-blue-light/5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-light shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-main mb-1">
                    {type.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {type.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto max-w-3xl flex items-start gap-4 rounded-2xl bg-sand-light/30 p-5 text-sm text-text-secondary">
          <AlertCircle className="h-5 w-5 shrink-0 text-text-secondary mt-0.5" />
          <p>
            A Zelare não substitui atendimento médico, hospitalar ou serviços de urgência e emergência.
          </p>
        </div>
      </div>
    </section>
  );
}
