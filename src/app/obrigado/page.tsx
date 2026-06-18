"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Suspense } from "react";

function ObrigadoContent() {
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo");
  const codigo = searchParams.get("codigo");

  const isProfissional = tipo === "profissional";

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl shadow-xl ring-1 ring-sand-light/50 max-w-lg mx-auto">
      <div className={`flex h-20 w-20 items-center justify-center rounded-full mb-6 ${isProfissional ? 'bg-green-light/20 text-green-600' : 'bg-blue-light/20 text-blue-light'}`}>
        <CheckCircle2 className="h-10 w-10" />
      </div>
      
      <h1 className="text-3xl font-bold text-text-main mb-4">
        {isProfissional ? "Cadastro recebido!" : "Solicitação recebida!"}
      </h1>
      
      <p className="text-lg text-text-secondary mb-8 leading-relaxed">
        {isProfissional 
          ? "Cadastro recebido pela Zelare. Nossa equipe poderá entrar em contato pelo WhatsApp para confirmar informações e concluir a análise do seu perfil. O envio do cadastro não garante oportunidades imediatas."
          : "Solicitação recebida pela Zelare. Nossa equipe poderá entrar em contato pelo WhatsApp para confirmar os detalhes e verificar profissionais disponíveis. O envio da solicitação não garante disponibilidade imediata."}
      </p>

      {!isProfissional && codigo && (
        <div className="bg-sand-light/10 p-6 rounded-2xl border border-sand-light/50 mb-8 w-full">
          <p className="text-sm text-text-secondary mb-2">Seu código de acompanhamento:</p>
          <p className="text-2xl font-mono font-bold text-blue-600 tracking-wider mb-4">{codigo}</p>
          <Link
            href={`/acompanhar`}
            className="inline-block text-sm font-semibold text-blue-light hover:underline"
          >
            Acompanhar status da solicitação
          </Link>
        </div>
      )}

      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-2xl bg-sand-light/30 px-6 py-3 text-sm font-semibold text-text-main transition-colors hover:bg-sand-light/50 ring-1 ring-sand-light"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para o início
      </Link>
    </div>
  );
}

export default function ObrigadoPage() {
  return (
    <div className="min-h-screen bg-bg-main py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-light border-t-transparent" />
        </div>
      }>
        <ObrigadoContent />
      </Suspense>
    </div>
  );
}
