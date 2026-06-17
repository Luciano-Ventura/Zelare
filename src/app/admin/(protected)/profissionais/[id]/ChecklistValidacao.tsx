"use client";

import { useState } from "react";
import { CheckSquare, Square, Loader2 } from "lucide-react";
import { updateProfissionalChecklist } from "./actions";

const CHECKLIST_ITEMS = [
  { id: "identidade", label: "Documento de Identidade válido" },
  { id: "residencia", label: "Comprovante de Residência" },
  { id: "certificado", label: "Certificado / Diploma (se aplicável)" },
  { id: "entrevista", label: "Entrevista online realizada" },
  { id: "referencias", label: "Referências checadas" }
];

export function ChecklistValidacao({ profissionalId, initialChecklist, isAtivoOuValidado }: { profissionalId: string, initialChecklist: Record<string, boolean>, isAtivoOuValidado: boolean }) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>(initialChecklist || {});
  const [isPending, setIsPending] = useState(false);

  const toggleItem = async (id: string) => {
    setIsPending(true);
    const newVal = !checklist[id];
    const newChecklist = { ...checklist, [id]: newVal };
    setChecklist(newChecklist);
    
    await updateProfissionalChecklist(profissionalId, newChecklist);
    setIsPending(false);
  };

  const allChecked = CHECKLIST_ITEMS.every(i => checklist[i.id]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-sm font-bold text-text-main mb-4 flex items-center justify-between">
        <span>Checklist de Validação</span>
        {isPending && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
      </h3>
      
      {!allChecked && isAtivoOuValidado && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
          Aviso: Profissional está Validado/Ativo mas o checklist não está completo.
        </div>
      )}

      <div className="space-y-3">
        {CHECKLIST_ITEMS.map(item => (
          <button
            key={item.id}
            disabled={isPending}
            onClick={() => toggleItem(item.id)}
            className="flex items-start gap-3 w-full text-left group"
          >
            <div className="mt-0.5 shrink-0">
              {checklist[item.id] ? (
                <CheckSquare className="w-5 h-5 text-green-500" />
              ) : (
                <Square className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors" />
              )}
            </div>
            <span className={`text-sm font-medium ${checklist[item.id] ? "text-gray-400 line-through" : "text-gray-700 group-hover:text-gray-900"}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
