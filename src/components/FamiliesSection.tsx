"use client";

import Link from "next/link";
import { LINKS, FAMILY_SERVICES } from "@/lib/constants";
import { CheckCircle2, Star } from "lucide-react";

export default function FamiliesSection() {
  return (
    <section id="para-familias" className="py-14 lg:py-24 bg-blue-light/5">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          
          <div className="flex-1">
            <h2 className="text-3xl font-bold tracking-tight text-text-main sm:text-4xl mb-6">
              Sua família precisa de ajuda para cuidar de alguém?
            </h2>
            <p className="text-lg text-text-secondary mb-4">
              Nem sempre é fácil encontrar uma pessoa de confiança no momento certo. A Zelare nasceu para aproximar famílias de profissionais de cuidado, começando com um atendimento simples, humano e direto.
            </p>
            <p className="text-md font-medium text-text-main mb-8">
              Ideal para quem precisa de apoio por algumas horas, um dia, uma noite ou de forma recorrente.
            </p>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {FAMILY_SERVICES.map((service, index) => (
                <li key={index} className="flex items-center gap-3 text-text-main">
                  <CheckCircle2 className="h-5 w-5 text-blue-light shrink-0" />
                  <span>{service}</span>
                </li>
              ))}
            </ul>

            <Link
              href={LINKS.requestCare}
              className="inline-block rounded-2xl bg-blue-light px-8 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-blue-light/30 transition-transform hover:-translate-y-1 w-full sm:w-auto"
              onClick={() => console.log('clique_solicitar_cuidado')}
            >
              Solicitar cuidado agora
            </Link>
            <p className="mt-4 text-sm text-text-secondary">
              Após o envio, entraremos em contato pelo WhatsApp para confirmar as informações.
            </p>
          </div>

          <div className="flex-1 w-full relative hidden sm:block">
            <div className="aspect-square max-w-md mx-auto rounded-full bg-blue-light/20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl -z-10" />
            <div className="bg-white p-8 rounded-3xl shadow-xl ring-1 ring-sand-light/50 flex flex-col gap-6">
              
              {/* Card 1 */}
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-sand-light/50 flex items-center justify-center text-text-main font-semibold shrink-0 ring-1 ring-sand-light">
                  MS
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-text-main text-sm">Maria Silva</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-xs font-medium text-text-secondary">5.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary">Cuidadora de Idosos • São José</p>
                </div>
              </div>

              <div className="h-px w-full bg-gray-100" />

              {/* Card 2 */}
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-blue-light/20 flex items-center justify-center text-blue-light font-semibold shrink-0 ring-1 ring-blue-light/30">
                  RO
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-text-main text-sm">Roberto Oliveira</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-xs font-medium text-text-secondary">4.9</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary">Técnico de Enfermagem • Florianópolis</p>
                </div>
              </div>

              <div className="h-px w-full bg-gray-100" />

              {/* Card 3 */}
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-green-light/30 flex items-center justify-center text-green-700 font-semibold shrink-0 ring-1 ring-green-light/50">
                  JF
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-text-main text-sm">Juliana Freitas</p>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-xs font-medium text-text-secondary">5.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary">Babá • Palhoça</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
