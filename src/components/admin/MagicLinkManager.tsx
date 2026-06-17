"use client";

import { useState, useEffect } from "react";
import { Copy, RefreshCw, Key, ShieldOff, Send, Check } from "lucide-react";
import { generateOrRegenerateMagicLink, blockMagicLink } from "@/app/admin/(protected)/profissionais/[id]/magic-link-actions";

export function MagicLinkManager({
  profissionalId,
  nome,
  whatsapp,
  token,
  status,
  acessoToken
}: {
  profissionalId: string;
  nome: string;
  whatsapp: string;
  token: string | null;
  status: string;
  acessoToken?: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Consider it active if status is "Ativo" and it has a token
  const isActive = status === "Ativo" && (token || acessoToken);
  const isBlocked = status === "Bloqueado";

  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const pwaLink = origin ? `${origin}/profissional/login` : "";
  const magicLinkUrl = token && origin ? `${origin}/app/${token}` : "";

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
    const text = `Link do App: ${pwaLink}\nCódigo de Acesso: ${acessoToken || 'Não gerado'}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getWhatsAppLink = () => {
    const msg = `Olá, ${nome}. Seu acesso ao App da Zelare foi liberado!\n\nPara acessar seus plantões e convites, entre neste link:\n${pwaLink}\n\nE digite o seguinte código de acesso:\n*${acessoToken}*\n\nNão compartilhe este código com outras pessoas.`;
    return `https://wa.me/55${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
        <Key className="w-5 h-5 text-indigo-500" /> Acesso ao App (PWA)
      </h3>

      {!isActive ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600 mb-3">
            {isBlocked 
              ? "O acesso deste profissional está bloqueado." 
              : "Nenhum acesso gerado."}
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            {loading ? "Processando..." : (isBlocked ? "Gerar Novo Acesso" : "Gerar Código de Acesso")}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Código de Acesso (PWA)</p>
                <p className="text-2xl font-black text-indigo-800 tracking-widest">{acessoToken}</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-[10px] font-bold uppercase tracking-wider">
                Ativo
              </span>
            </div>
            
            {magicLinkUrl && (
              <div className="mt-3 pt-3 border-t border-indigo-200/50">
                 <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Link Mágico (Antigo)</p>
                 <span className="text-xs font-mono text-indigo-600 break-all truncate max-w-[200px] sm:max-w-xs block">
                    {magicLinkUrl}
                 </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 min-w-[120px] px-3 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              {copied ? <><Check className="w-4 h-4 text-green-500" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar</>}
            </button>
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[120px] px-3 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Enviar WhatsApp
            </a>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="text-[11px] font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Regenerar Acesso
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
