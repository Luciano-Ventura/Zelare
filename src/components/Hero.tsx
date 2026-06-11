"use client";

import Link from "next/link";
import { LINKS, HERO_CARDS } from "@/lib/constants";
import { MessageCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-16 lg:pt-24 lg:pb-24">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -z-10 -ml-[50%] h-[150%] w-[200%] rounded-b-[100%] bg-gradient-to-b from-blue-light/10 to-transparent sm:-ml-[50%] sm:w-[200%] lg:-ml-[30%] lg:w-[160%]" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
          
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full bg-sand-light/50 px-3 py-1 text-sm font-medium text-text-main mb-6">
              Cuidado domiciliar na Grande Florianópolis
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl xl:text-6xl">
              Precisa de cuidador, babá ou profissional de enfermagem?
            </h1>
            <p className="mt-6 text-lg leading-8 text-text-secondary">
              A Zelare conecta sua família a profissionais de cuidado para plantões avulsos ou recorrentes, com agilidade, segurança e confiança.
            </p>
            <p className="mt-2 text-sm text-text-secondary/80">
              Atendimento inicial em São José, Florianópolis, Palhoça, Biguaçu e região. A disponibilidade depende da região, horário e profissionais cadastrados.
            </p>
            
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href={LINKS.requestCare}
                className="w-full rounded-2xl bg-blue-light px-8 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-blue-light/30 transition-transform hover:-translate-y-1 sm:w-auto"
                onClick={() => console.log('clique_solicitar_cuidado')}
              >
                Solicitar cuidado agora
              </Link>
              <Link
                href={LINKS.professionalRegistration}
                className="w-full rounded-2xl bg-white px-8 py-4 text-center text-lg font-semibold text-text-main shadow-sm transition-transform hover:-translate-y-1 sm:w-auto ring-1 ring-sand-light"
                onClick={() => console.log('clique_cadastro_profissional')}
              >
                Quero trabalhar com a Zelare
              </Link>
              <a
                href={LINKS.whatsappGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-2xl bg-white px-8 py-4 text-center text-lg font-semibold text-text-secondary transition-transform hover:-translate-y-1 sm:w-auto hover:text-text-main flex justify-center items-center gap-2"
                onClick={() => console.log('clique_whatsapp')}
              >
                <MessageCircle className="h-5 w-5" />
                Falar pelo WhatsApp
              </a>
            </div>
            
            <p className="mt-6 text-sm text-text-secondary">
              Sem compromisso. Nossa equipe entra em contato pelo WhatsApp para entender sua necessidade.
            </p>
          </div>

          <div className="mt-16 flex-1 lg:mt-0 relative hidden md:block">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-4 rounded-3xl bg-green-light/20 blur-2xl" />
              <div className="relative flex flex-col gap-6 rounded-3xl bg-white/60 p-8 shadow-xl backdrop-blur-xl ring-1 ring-white/50">
                
                {HERO_CARDS.map((card, index) => {
                  const Icon = card.icon;
                  // Add slight translations to make it look like a floating stack
                  const translations = ["", "translate-x-4", "-translate-x-4"];
                  const bgs = ["bg-blue-light/20 text-blue-light", "bg-green-light/20 text-green-light", "bg-sand-light/50 text-text-main"];
                  
                  return (
                    <div key={index} className={`flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ${translations[index]}`}>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bgs[index]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-text-main">{card.title}</p>
                        <p className="text-sm text-text-secondary">{card.description}</p>
                      </div>
                    </div>
                  )
                })}

              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
