"use client";

import Link from "next/link";
import { LINKS } from "@/lib/constants";
import { WhatsAppIcon } from "./WhatsAppIcon";

export default function FinalCTA() {
  return (
    <section className="py-14 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-blue-light/10 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-blue-light/5 blur-3xl rounded-full -z-10" />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-text-main sm:text-5xl mb-6">
          Vamos encontrar o cuidado certo para sua família?
        </h2>
        <p className="text-lg text-text-secondary mb-10 max-w-2xl mx-auto">
          Conte para a Zelare o que você precisa. Nossa equipe vai analisar sua solicitação e retornar pelo WhatsApp.
        </p>
        
        <div className="flex flex-col items-center gap-4 sm:flex-row justify-center w-full max-w-3xl mx-auto">
          <Link
            href={LINKS.requestCare}
            className="w-full sm:w-auto rounded-2xl bg-blue-light px-8 py-4 text-center text-lg font-semibold text-white shadow-lg shadow-blue-light/30 transition-transform hover:-translate-y-1"
            onClick={() => console.log('clique_cta_final_solicitar')}
          >
            Solicitar cuidado agora
          </Link>
          <Link
            href={LINKS.professionalRegistration}
            className="w-full sm:w-auto rounded-2xl bg-white px-8 py-4 text-center text-lg font-semibold text-text-main shadow-sm ring-1 ring-sand-light transition-transform hover:-translate-y-1"
            onClick={() => console.log('clique_cta_final_profissional')}
          >
            Cadastrar como profissional
          </Link>
        </div>
        <div className="mt-4 flex justify-center w-full max-w-3xl mx-auto">
          <a
            href={LINKS.whatsappGeneral}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto rounded-2xl bg-transparent px-8 py-4 text-center text-lg font-semibold text-text-secondary transition-transform hover:-translate-y-1 hover:text-text-main flex items-center justify-center gap-2 ring-1 ring-transparent hover:ring-sand-light/50 hover:bg-sand-light/10"
            onClick={() => console.log('clique_whatsapp')}
          >
            <WhatsAppIcon className="h-5 w-5" />
            Falar pelo WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
