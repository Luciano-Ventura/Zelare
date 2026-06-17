"use client";

import { useState } from "react";
import { updateSolicitacao } from "@/app/admin/(protected)/solicitacoes/[id]/actions";
import { Edit, X, CheckCircle2 } from "lucide-react";

export function EditSolicitacaoModal({ solic }: { solic: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: solic.nome_completo || "",
    whatsapp: solic.whatsapp || "",
    para_quem: solic.para_quem || "",
    tipo_profissional: solic.tipo_profissional || "",
    data_desejada: solic.data_desejada || "",
    horario_desejado: solic.horario_desejado || "",
    horario_fim: solic.horario_fim || "",
    duracao_plantao: solic.duracao_plantao || "",
    cidade: solic.cidade || "",
    bairro: solic.bairro || "",
    endereco_completo: solic.endereco_completo || "",
    endereco_numero: solic.endereco_numero || "",
    endereco_complemento: solic.endereco_complemento || "",
    observacoes: solic.observacoes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await updateSolicitacao(solic.id, formData);
    setIsSubmitting(false);
    if (res.error) {
      alert(res.error);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors flex items-center justify-center"
        title="Editar Solicitação"
      >
        <Edit className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2F3437]/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto border border-white/50">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FAFAF7]">
              <h2 className="text-lg font-bold text-[#2F3437]">Editar Solicitação</h2>
              <button onClick={() => setIsOpen(false)} className="text-[#6B7280] hover:text-[#2F3437] transition-colors p-1 rounded-md hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Nome da Família</label>
                  <input type="text" value={formData.nome_completo} onChange={(e) => setFormData({...formData, nome_completo: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">WhatsApp</label>
                  <input type="text" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Para quem é?</label>
                  <input type="text" value={formData.para_quem} onChange={(e) => setFormData({...formData, para_quem: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Profissional Desejado</label>
                  <input type="text" value={formData.tipo_profissional} onChange={(e) => setFormData({...formData, tipo_profissional: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-[#2F3437] uppercase tracking-wider mb-3">Agenda</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Data Desejada</label>
                    <input type="date" value={formData.data_desejada} onChange={(e) => setFormData({...formData, data_desejada: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Duração/Frequência</label>
                    <input type="text" value={formData.duracao_plantao} onChange={(e) => setFormData({...formData, duracao_plantao: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Horário Início</label>
                    <input type="time" value={formData.horario_desejado} onChange={(e) => setFormData({...formData, horario_desejado: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Horário Término</label>
                    <input type="time" value={formData.horario_fim} onChange={(e) => setFormData({...formData, horario_fim: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-[#2F3437] uppercase tracking-wider mb-3">Localização</h3>
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
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Endereço Completo (Rua)</label>
                    <input type="text" value={formData.endereco_completo} onChange={(e) => setFormData({...formData, endereco_completo: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Número</label>
                    <input type="text" value={formData.endereco_numero} onChange={(e) => setFormData({...formData, endereco_numero: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Complemento</label>
                    <input type="text" value={formData.endereco_complemento} onChange={(e) => setFormData({...formData, endereco_complemento: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Observações da Família</label>
                <textarea rows={3} value={formData.observacoes} onChange={(e) => setFormData({...formData, observacoes: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-5 py-2.5 text-sm font-bold text-[#6B7280] hover:bg-gray-100 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-[#8ECADF] text-[#2F3437] text-sm font-bold rounded-xl hover:brightness-95 transition-all flex items-center gap-2">
                  {isSubmitting ? "Salvando..." : <><CheckCircle2 className="w-4 h-4" /> Salvar Alterações</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
