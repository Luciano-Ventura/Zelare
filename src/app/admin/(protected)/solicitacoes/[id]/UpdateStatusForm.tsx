"use client";

import { useState } from "react";
import { updateStatus } from "@/app/admin/crm-actions";
import { Loader2 } from "lucide-react";

export function UpdateStatusForm({ 
  table, 
  id, 
  currentStatus, 
  options 
}: { 
  table: "familias_solicitacoes" | "profissionais_cadastros" | "plantoes" | "ocorrencias", 
  id: string, 
  currentStatus: string,
  options: string[]
}) {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const handleUpdate = async () => {
    setIsPending(true);
    const res = await updateStatus(table, id, status);
    if (!res.success) {
      alert("Erro ao atualizar: " + res.error);
    }
    setIsPending(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <select 
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-light focus:border-blue-light bg-white"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      
      <button 
        onClick={handleUpdate}
        disabled={isPending || status === currentStatus}
        className="w-full flex justify-center items-center py-2 px-4 rounded-lg bg-blue-light text-white text-sm font-medium hover:bg-blue-dark disabled:opacity-50 transition-colors"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Atualizar Status
      </button>
    </div>
  );
}
