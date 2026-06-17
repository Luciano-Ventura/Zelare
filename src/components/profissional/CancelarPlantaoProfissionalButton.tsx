"use client";

import { useState } from "react";
import { cancelarPlantaoProfissional } from "@/app/profissional/plantoes/actions";
import { AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function CancelarPlantaoProfissionalButton({ plantaoId }: { plantaoId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!motivo.trim()) {
      alert("Por favor, informe o motivo do cancelamento.");
      return;
    }

    if (!window.confirm("Você tem certeza que deseja cancelar este plantão? A Zelare será notificada.")) {
      return;
    }

    setIsSubmitting(true);
    const res = await cancelarPlantaoProfissional(plantaoId, motivo);
    setIsSubmitting(false);

    if (res.error) {
      alert(res.error);
    } else {
      setIsOpen(false);
      router.push("/profissional/plantoes");
    }
  };

  return (
    <div className="mt-6">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full bg-red-50 text-red-600 border border-red-200 py-3 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
        >
          <AlertTriangle className="w-4 h-4" /> Cancelar meu plantão
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-red-50 p-4 rounded-xl border border-red-200 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Cancelar Plantão
            </h4>
            <button type="button" onClick={() => setIsOpen(false)} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-xs text-red-700">Ao cancelar, a família ficará sem atendimento até que outro profissional assuma. Informe o motivo abaixo:</p>
          
          <textarea 
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ex: Imprevisto médico, problema no transporte..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-red-300 outline-none focus:border-red-500 bg-white"
            rows={3}
            required
          />

          <div className="flex gap-2">
            <button type="button" onClick={() => setIsOpen(false)} className="flex-1 py-2 text-xs font-bold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-gray-50">
              Voltar
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50">
              {isSubmitting ? "Cancelando..." : "Confirmar Cancelamento"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
