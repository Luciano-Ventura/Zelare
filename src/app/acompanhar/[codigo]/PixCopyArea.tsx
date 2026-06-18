"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function PixCopyArea({ pixEmv }: { pixEmv: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixEmv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2">
      <input 
        type="text" 
        readOnly 
        value={pixEmv} 
        className="flex-1 bg-transparent text-xs text-text-main outline-none px-2 truncate"
      />
      <button 
        onClick={handleCopy}
        className="shrink-0 flex items-center gap-1 bg-white border border-gray-200 text-text-main hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3 text-green-500" />
            <span className="text-green-600">Copiado</span>
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" />
            <span>Copiar</span>
          </>
        )}
      </button>
    </div>
  );
}
