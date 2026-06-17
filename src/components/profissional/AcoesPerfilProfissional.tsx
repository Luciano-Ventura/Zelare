"use client";

import { useState } from "react";
import { updateMeuPerfil, inativarMeuPerfil } from "@/app/profissional/perfil/actions";
import { Edit, UserX, X, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AcoesPerfilProfissional({ perfil }: { perfil: any }) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    whatsapp: perfil.whatsapp || "",
    cidade: perfil.cidade || "",
    bairro: perfil.bairro || "",
    endereco_base_completo: perfil.endereco_base_completo || "",
    endereco_base_numero: perfil.endereco_base_numero || "",
    endereco_base_complemento: perfil.endereco_base_complemento || "",
    pix_tipo: perfil.pix_tipo || "",
    pix_chave: perfil.pix_chave || "",
  });

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await updateMeuPerfil(formData);
    setIsSubmitting(false);
    if (res.error) {
      alert(res.error);
    } else {
      setIsEditOpen(false);
    }
  };

  const handleInativar = async () => {
    if (!window.confirm("ATENÇÃO: Deseja excluir (inativar) sua conta? Você não poderá mais receber plantões. Esta ação não pode ser desfeita online.")) {
      return;
    }
    
    setIsSubmitting(true);
    const res = await inativarMeuPerfil();
    if (res.error) {
      alert(res.error);
      setIsSubmitting(false);
    } else {
      router.push("/profissional/login"); // ou sair da sessão
    }
  };

  return (
    <div className="flex gap-2 w-full mt-4">
      <button 
        onClick={() => setIsEditOpen(true)}
        className="flex-1 bg-[#8ECADF] text-[#2F3437] py-3 rounded-xl text-sm font-bold hover:brightness-95 transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <Edit className="w-4 h-4" /> Editar Meus Dados
      </button>

      <button 
        onClick={handleInativar}
        disabled={isSubmitting}
        className="flex-none px-4 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
        title="Inativar Conta"
      >
        <UserX className="w-5 h-5" />
      </button>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2F3437]/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden my-auto border border-white/50">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FAFAF7]">
              <h2 className="text-lg font-bold text-[#2F3437]">Editar Meus Dados</h2>
              <button onClick={() => setIsEditOpen(false)} className="text-[#6B7280] hover:text-[#2F3437] transition-colors p-1 rounded-md hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 overflow-y-auto space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">WhatsApp</label>
                <input type="text" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-[#2F3437] uppercase tracking-wider mb-3">Localização (Base Geográfica)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Cidade</label>
                    <input type="text" value={formData.cidade} onChange={(e) => setFormData({...formData, cidade: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Bairro</label>
                    <input type="text" value={formData.bairro} onChange={(e) => setFormData({...formData, bairro: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Endereço Base</label>
                    <input type="text" value={formData.endereco_base_completo} onChange={(e) => setFormData({...formData, endereco_base_completo: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Número</label>
                    <input type="text" value={formData.endereco_base_numero} onChange={(e) => setFormData({...formData, endereco_base_numero: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Complemento</label>
                    <input type="text" value={formData.endereco_base_complemento} onChange={(e) => setFormData({...formData, endereco_base_complemento: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-[#2F3437] uppercase tracking-wider mb-3">Recebimentos (Pix)</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Tipo Pix</label>
                    <input type="text" value={formData.pix_tipo} onChange={(e) => setFormData({...formData, pix_tipo: e.target.value})} placeholder="CPF, Celular, Email, etc." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Chave Pix</label>
                    <input type="text" value={formData.pix_chave} onChange={(e) => setFormData({...formData, pix_chave: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-5 py-2.5 text-sm font-bold text-[#6B7280] hover:bg-gray-100 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-[#8ECADF] text-[#2F3437] text-sm font-bold rounded-xl hover:brightness-95 transition-all flex items-center gap-2">
                  {isSubmitting ? "Salvando..." : <><CheckCircle2 className="w-4 h-4" /> Salvar</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
