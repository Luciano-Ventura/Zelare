"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search, Loader2 } from "lucide-react";

export default function AcompanharPage() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim()) {
      setError("Por favor, informe o código.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Direct push to the dynamic route, which will do the fetching on the server
      router.push(`/acompanhar/${codigo.trim().toUpperCase()}`);
    } catch (err) {
      setError("Erro ao processar sua solicitação.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl ring-1 ring-sand-light/50">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-text-main transition-colors mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o início
          </Link>
          <h1 className="text-2xl font-bold text-text-main">Acompanhar Solicitação</h1>
          <p className="text-text-secondary text-sm mt-2">
            Insira o código gerado no momento da sua solicitação para visualizar o status.
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label htmlFor="codigo" className="block text-sm font-medium text-text-main mb-1">
              Código da Solicitação
            </label>
            <input
              id="codigo"
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-text-main focus:border-blue-light focus:ring-1 focus:ring-blue-light outline-none transition-all font-mono uppercase"
              placeholder="Ex: ZEL-ABC123"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center rounded-xl bg-blue-light px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-blue-light/90 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            Buscar Solicitação
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-text-secondary">
          <p>Não encontra seu código? Fale conosco pelo WhatsApp.</p>
        </div>
      </div>
    </div>
  );
}
