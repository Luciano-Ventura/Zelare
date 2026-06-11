"use client";

import Link from "next/link";
import { LINKS, PROFESSIONAL_OPPORTUNITIES, PROFESSIONAL_BENEFITS } from "@/lib/constants";
import { BriefcaseBusiness, Check } from "lucide-react";

export default function ProfessionalsSection() {
  return (
    <section id="para-profissionais" className="py-14 lg:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-16 items-center">
          
          <div className="flex-1 w-full relative hidden sm:block">
            <div className="aspect-square max-w-md mx-auto rounded-[3rem] bg-green-light/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl -z-10" />
            <div className="bg-bg-main p-8 rounded-3xl shadow-lg ring-1 ring-sand-light/50 flex flex-col gap-6">
              <div className="flex items-center gap-4 border-b border-sand-light/50 pb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-green-light shadow-sm">
                  <BriefcaseBusiness className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-main text-lg">Novas oportunidades</h3>
                  <p className="text-sm text-text-secondary">Plantões na sua região</p>
                </div>
              </div>
              <ul className="space-y-4 pt-2">
                {PROFESSIONAL_BENEFITS.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-light shrink-0 mt-0.5" />
                    <span className="text-text-main font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl mb-6">
              Você trabalha com cuidado e quer receber oportunidades de plantão?
            </h2>
            <p className="text-lg text-text-secondary mb-4">
              A Zelare está formando uma rede de profissionais de cuidado para atender famílias da região.
            </p>
            <p className="text-md font-medium text-text-main mb-8">
              Cadastre-se gratuitamente para receber oportunidades conforme sua região, experiência e disponibilidade.
            </p>
            
            <ul className="flex flex-wrap gap-2 mb-10">
              {PROFESSIONAL_OPPORTUNITIES.map((opportunity, index) => (
                <li key={index} className="rounded-full bg-sand-light/30 px-3 py-1.5 text-sm font-medium text-text-main">
                  {opportunity}
                </li>
              ))}
            </ul>

            <Link
              href={LINKS.professionalRegistration}
              className="inline-block rounded-2xl bg-white ring-1 ring-sand-light px-8 py-4 text-center text-lg font-semibold text-text-main shadow-sm transition-transform hover:-translate-y-1 w-full sm:w-auto"
              onClick={() => console.log('clique_cadastro_profissional')}
            >
              Cadastrar como profissional
            </Link>
            
            <p className="mt-4 text-sm text-text-secondary">
              O cadastro passa por análise. A Zelare poderá solicitar documentos, referências ou informações adicionais.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
