"use client";

import { UserX } from "lucide-react";
import { inativarProfissional } from "@/app/admin/(protected)/profissionais/[id]/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProfissionalButton({ id }: { id: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Deseja Inativar (Excluir) este profissional? Os plantões passados serão mantidos por segurança e auditoria financeira, mas ele não será mais listado como disponível.")) {
      return;
    }
    
    setIsDeleting(true);
    const res = await inativarProfissional(id);
    if (res.error) {
      alert(res.error);
      setIsDeleting(false);
    } else {
      router.push("/admin/profissionais");
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center"
      title="Inativar (Excluir) Profissional"
    >
      <UserX className="w-5 h-5" />
    </button>
  );
}
