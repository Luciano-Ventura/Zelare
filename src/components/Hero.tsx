"use client";

import Link from "next/link";
import Image from "next/image";
import { LINKS, HERO_CARDS } from "@/lib/constants";
import { WhatsAppIcon } from "./WhatsAppIcon";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-16 lg:pt-24 lg:pb-24">
      {/* Background Image */}
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/hero/cuidadora-idosa-ar-livre.webp"
          alt="Cuidado domiciliar"
          fill
          priority
          className="object-cover opacity-[0.15]"
        />
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -z-10 -ml-[50%] h-[150%] w-[200%] rounded-b-[100%] bg-gradient-to-b from-blue-light/10 to-transparent sm:-ml-[50%] sm:w-[200%] lg:-ml-[30%] lg:w-[160%]" />
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
          
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full bg-sand-light/50 px-3 py-1 text-sm font-medium text-text-main mb-6">
              Cuidado domiciliar em expansão pelo Brasil
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl xl:text-6xl">
              Precisa de cuidador, babá ou profissional de enfermagem?
            </h1>
            <p className="mt-6 text-lg leading-8 text-text-secondary">
              A Zelare conecta sua família a profissionais de cuidado para plantões avulsos ou recorrentes, com agilidade, segurança e confiança.
            </p>
            <p className="mt-2 text-sm text-text-secondary/80">
              A Zelare está em expansão para conectar famílias a profissionais de cuidado domiciliar em diferentes regiões do Brasil. A disponibilidade do atendimento depende da região, do tipo de cuidado e dos profissionais cadastrados no momento da solicitação.
            </p>
            
            <div className="mt-8 flex flex-col gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href={LINKS.requestCare}
                  data-testid="cta-solicitar-cuidado"
                  className="flex h-14 items-center justify-center rounded-2xl bg-blue-light px-4 text-center text-base font-semibold text-white shadow-lg shadow-blue-light/30 transition-transform hover:-translate-y-1"
                  onClick={() => console.log('clique_solicitar_cuidado')}
                >
                  Solicitar cuidado agora
                </Link>
                <Link
                  href={LINKS.professionalRegistration}
                  data-testid="cta-cadastrar-profissional"
                  className="flex h-14 items-center justify-center rounded-2xl bg-white px-4 text-center text-base font-semibold text-text-main shadow-sm transition-transform hover:-translate-y-1 ring-1 ring-sand-light"
                  onClick={() => console.log('clique_cadastro_profissional')}
                >
                  Quero trabalhar na Zelare
                </Link>
              </div>
              <a
                href={LINKS.whatsappGeneral}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-white/80 px-8 text-center text-base font-semibold text-text-main transition-transform hover:-translate-y-1 hover:bg-white sm:w-auto ring-1 ring-white/50 shadow-sm backdrop-blur-sm"
                onClick={() => console.log('clique_whatsapp')}
              >
                <WhatsAppIcon className="h-5 w-5 text-green-500" />
                Falar pelo WhatsApp
              </a>
            </div>
            
            <p className="mt-6 text-sm text-text-secondary">
              Sem compromisso. Nossa equipe entra em contato pelo WhatsApp para entender sua necessidade.
            </p>
          </div>

          <div className="mt-16 flex-1 lg:mt-0 relative hidden md:block">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-4 rounded-3xl bg-blue-light/10 blur-3xl" />
              <div className="relative flex flex-col gap-6 rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-xl ring-1 ring-white/50">
                
                <div className="flex flex-col gap-6">
                  {HERO_CARDS.map((card, index) => {
                    const Icon = card.icon;
                    const bgs = ["bg-sand-light/50 text-text-main", "bg-blue-light/20 text-blue-light", "bg-green-light/20 text-green-light"];
                    
                    return (
                      <div key={index} className="flex items-center gap-5">
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-sm ${bgs[index]}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold text-text-main leading-tight">{card.title}</p>
                          <p className="text-sm text-text-secondary leading-tight">{card.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
