"use client";

import { useState } from "react";
import { loginProfissionalAction } from "./actions";

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const whatsapp = formData.get("whatsapp") as string;
    const token = formData.get("token") as string;

    const res = await loginProfissionalAction(whatsapp, token);
    
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // O redirect acontece na lib de auth ou via refresh da página
      window.location.href = "/profissional";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100 text-center">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">
          Seu WhatsApp (Apenas Números)
        </label>
        <input 
          type="tel" 
          name="whatsapp" 
          required 
          placeholder="Ex: 11999999999"
          className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-lg font-bold text-[#2F3437] focus:ring-4 focus:ring-[#8ECADF]/20 focus:border-[#8ECADF] outline-none transition-all placeholder:font-medium placeholder:text-gray-300"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wider mb-2">
          Código de Acesso
        </label>
        <input 
          type="text" 
          name="token" 
          required 
          placeholder="Digite o código enviado pela Zelare"
          className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-lg font-bold text-[#2F3437] focus:ring-4 focus:ring-[#8ECADF]/20 focus:border-[#8ECADF] outline-none transition-all placeholder:font-medium placeholder:text-gray-300 uppercase"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-[#8ECADF] text-[#2F3437] py-4 rounded-2xl text-base font-black hover:brightness-95 transition-all shadow-md disabled:opacity-50 mt-8"
      >
        {loading ? "Acessando..." : "Entrar na minha conta"}
      </button>
    </form>
  );
}
