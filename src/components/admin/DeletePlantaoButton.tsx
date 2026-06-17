"use client";

import { Trash2 } from "lucide-react";
import { deletePlantao } from "@/app/admin/(protected)/solicitacoes/[id]/actions";
import { useState } from "react";

export function DeletePlantaoButton({ plantaoId, solicitacaoId }: { plantaoId: string; solicitacaoId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("ATENÇÃO: Tem certeza que deseja APAGAR este plantão? Todos os pagamentos e repasses atrelados a ele também serão excluídos. Esta ação não pode ser desfeita.")) {
      return;
    }
    
    setIsDeleting(true);
    const res = await deletePlantao(plantaoId, solicitacaoId);
    if (res.error) {
      alert(res.error);
      setIsDeleting(false);
    }
    // Sucesso => revalidatePath atuará na action
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
      title="Excluir Plantão permanentemente"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
