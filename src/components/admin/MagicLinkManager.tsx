"use client";

import { useState, useEffect } from "react";
import { Copy, RefreshCw, Key, ShieldOff, Send, Check } from "lucide-react";
import { generateOrRegenerateMagicLink, blockMagicLink } from "@/app/admin/(protected)/profissionais/[id]/magic-link-actions";

export function MagicLinkManager({
  profissionalId,
  nome,
  whatsapp,
  token,
  status
}: {
  profissionalId: string;
  nome: string;
  whatsapp: string;
  token: string | null;
  status: string;
}) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Consider it active if status is "Ativo" and it has a token
  const isActive = status === "Ativo" && token;
  const isBlocked = status === "Bloqueado";

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const appLink = token && origin ? `${origin}/app/${token}` : "";

  const handleGenerate = async () => {
    if (!confirm("Isso vai gerar um novo link de acesso e invalidar o anterior. Deseja continuar?")) return;
    setLoading(true);
    const res = await generateOrRegenerateMagicLink(profissionalId);
    setLoading(false);
    if (res.error) alert("Erro: " + res.error);
  };

  const handleBlock = async () => {
    if (!confirm("Isso bloqueará imediatamente o acesso do profissional ao app. Continuar?")) return;
    setLoading(true);
    const res = await blockMagicLink(profissionalId);
    setLoading(false);
    if (res.error) alert("Erro: " + res.error);
  };

  const handleCopy = () => {
    if (!appLink) return;
    navigator.clipboard.writeText(appLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppLink = () => {
    const msg = `Olá, ${nome}. Este é seu link de acesso ao painel da Zelare:\n\n${appLink}\n\nPor ele você poderá acompanhar seus plantões, registrar chegada, finalizar atendimento e consultar seus ganhos.\n\nNão compartilhe este link com outras pessoas.`;
    return `https://wa.me/55${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
        <Key className="w-5 h-5 text-indigo-500" /> Acesso PWA (Link Mágico)
      </h3>

      {!isActive ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600 mb-3">
            {isBlocked 
              ? "O acesso deste profissional está bloqueado." 
              : "Nenhum link gerado ou acesso pendente."}
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            {loading ? "Processando..." : (isBlocked ? "Gerar Novo Acesso" : "Gerar Link de Acesso")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
            <span className="text-xs font-mono text-indigo-800 break-all truncate max-w-[200px] sm:max-w-xs">
              {appLink}
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-[10px] font-bold uppercase tracking-wider">
              Ativo
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 min-w-[120px] px-3 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              {copied ? <><Check className="w-4 h-4 text-green-500" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar Link</>}
            </button>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px] px-3 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> WhatsApp
            </a>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="text-[11px] font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Regenerar
            </button>
            <button
              onClick={handleBlock}
              disabled={loading}
              className="text-[11px] font-bold text-red-500 hover:text-red-700 flex items-center gap-1 ml-auto"
            >
              <ShieldOff className="w-3 h-3" /> Bloquear Acesso
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
