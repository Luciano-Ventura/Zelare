"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Info } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AcompanharGatewayPage() {
  const [codigo, setCodigo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sanitização do código (remover espaços, maiúsculas)
    const cleanCodigo = codigo.trim().toUpperCase();

    if (!cleanCodigo) {
      setErrorMsg("Informe o código recebido pela Zelare.");
      return;
    }

    router.push(`/acompanhar/${cleanCodigo}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-main">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl ring-1 ring-sand-light/50 p-8 space-y-6">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-text-main transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-text-main mb-2">Acompanhe seu plantão</h1>
            <p className="text-sm text-text-secondary">
              Digite o código recebido pela Zelare para acompanhar o andamento da sua solicitação ou plantão.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm flex items-start gap-2">
                <Info className="h-5 w-5 shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            <div>
              <label htmlFor="codigo" className="block text-sm font-bold text-text-main mb-1">
                Código da solicitação
              </label>
              <div className="relative">
                <input
                  id="codigo"
                  type="text"
                  value={codigo}
                  onChange={(e) => {
                    setCodigo(e.target.value);
                    setErrorMsg("");
                  }}
                  className="w-full rounded-xl border border-gray-300 pl-11 pr-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all uppercase"
                  placeholder="Ex: E2ETESTE"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-light px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-light/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-light transition-all"
            >
              Acessar meu plantão
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
