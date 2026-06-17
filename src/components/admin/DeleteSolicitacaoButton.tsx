"use client";

import { Trash2 } from "lucide-react";
import { deleteSolicitacao } from "@/app/admin/(protected)/solicitacoes/[id]/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteSolicitacaoButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("ATENÇÃO: Tem certeza que deseja APAGAR esta solicitação? Todos os dados vinculados (plantões, pagamentos) também serão apagados. Esta ação não pode ser desfeita.")) {
      return;
    }
    
    setIsDeleting(true);
    const res = await deleteSolicitacao(id);
    if (res.error) {
      alert(res.error);
      setIsDeleting(false);
    } else {
      router.push("/admin/solicitacoes");
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center"
      title="Excluir Solicitação permanentemente"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
