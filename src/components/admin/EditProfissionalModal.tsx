"use client";

import { useState } from "react";
import { updateProfissional } from "@/app/admin/(protected)/profissionais/[id]/actions";
import { Edit, X, CheckCircle2 } from "lucide-react";

export function EditProfissionalModal({ prof }: { prof: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: prof.nome_completo || "",
    whatsapp: prof.whatsapp || "",
    categoria_profissional: prof.categoria_profissional || "",
    cidade: prof.cidade || "",
    bairro: prof.bairro || "",
    endereco_base_cep: prof.endereco_base_cep || "",
    endereco_base_completo: prof.endereco_base_completo || "",
    endereco_base_numero: prof.endereco_base_numero || "",
    endereco_base_complemento: prof.endereco_base_complemento || "",
    latitude_base: prof.latitude_base || "",
    longitude_base: prof.longitude_base || "",
    raio_atendimento_km: prof.raio_atendimento_km || 10,
    pix_tipo: prof.pix_tipo || "",
    pix_chave: prof.pix_chave || "",
    // Financials
    valor_minimo_4h: prof.valor_minimo_4h || "",
    valor_minimo_6h: prof.valor_minimo_6h || "",
    valor_minimo_8h: prof.valor_minimo_8h || "",
    valor_minimo_12h: prof.valor_minimo_12h || "",
    valor_minimo_24h: prof.valor_minimo_24h || "",
    adicional_noturno: prof.adicional_noturno || "",
    adicional_urgencia: prof.adicional_urgencia || ""
  });
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    setFormData(prev => ({ ...prev, endereco_base_cep: cep }));

    if (cleanCep.length === 8) {
      setIsFetchingCep(true);
      try {
        // 1. Buscar endereço no ViaCEP
        const viaCepRes = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const viaCepData = await viaCepRes.json();
        
        if (!viaCepData.erro) {
          const updatedForm = {
            ...formData,
            endereco_base_cep: cep,
            endereco_base_completo: viaCepData.logradouro,
            bairro: viaCepData.bairro,
            cidade: viaCepData.localidade,
          };
          setFormData(updatedForm);

          // 2. Buscar Latitude e Longitude no Nominatim (OpenStreetMap)
          const query = `${viaCepData.logradouro}, ${viaCepData.bairro}, ${viaCepData.localidade}, ${viaCepData.uf}, Brazil`;
          const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
          const nomData = await nomRes.json();

          if (nomData && nomData.length > 0) {
            setFormData(prev => ({
              ...prev,
              latitude_base: parseFloat(nomData[0].lat),
              longitude_base: parseFloat(nomData[0].lon)
            }));
          } else {
            // Tenta busca mais branda se a primeira falhar
            const queryFallback = `${viaCepData.localidade}, ${viaCepData.uf}, Brazil`;
            const fbRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryFallback)}`);
            const fbData = await fbRes.json();
            if (fbData && fbData.length > 0) {
               setFormData(prev => ({
                 ...prev,
                 latitude_base: parseFloat(fbData[0].lat),
                 longitude_base: parseFloat(fbData[0].lon)
               }));
            }
          }
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
      }
      setIsFetchingCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSave = { ...formData };
    
    // Tratamento dos campos que podem estar vazios ou serem nulos no banco
    if (!dataToSave.latitude_base) (dataToSave as any).latitude_base = null;
    else (dataToSave as any).latitude_base = parseFloat((dataToSave as any).latitude_base);

    if (!dataToSave.longitude_base) (dataToSave as any).longitude_base = null;
    else (dataToSave as any).longitude_base = parseFloat((dataToSave as any).longitude_base);

    // Se as coords forem preenchidas, tira o aviso de "localizacao_pendente"
    if (dataToSave.latitude_base && dataToSave.longitude_base) {
      (dataToSave as any).localizacao_pendente = false;
    }

    // Converter valores para float se existirem
    ["valor_minimo_4h", "valor_minimo_6h", "valor_minimo_8h", "valor_minimo_12h", "valor_minimo_24h", "adicional_noturno", "adicional_urgencia"].forEach(key => {
      if ((dataToSave as any)[key] === "") {
        (dataToSave as any)[key] = null;
      } else {
        (dataToSave as any)[key] = parseFloat((dataToSave as any)[key]);
      }
    });

    const res = await updateProfissional(prof.id, dataToSave);
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
        title="Editar Profissional"
      >
        <Edit className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2F3437]/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden my-auto border border-white/50">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FAFAF7]">
              <h2 className="text-lg font-bold text-[#2F3437]">Editar Profissional</h2>
              <button onClick={() => setIsOpen(false)} className="text-[#6B7280] hover:text-[#2F3437] transition-colors p-1 rounded-md hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Nome Completo</label>
                  <input type="text" value={formData.nome_completo} onChange={(e) => setFormData({...formData, nome_completo: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">WhatsApp</label>
                  <input type="text" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Categoria</label>
                  <input type="text" value={formData.categoria_profissional} onChange={(e) => setFormData({...formData, categoria_profissional: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                </div>
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
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5 flex items-center justify-between">
                      CEP {isFetchingCep && <span className="text-blue-500 lowercase font-normal">buscando...</span>}
                    </label>
                    <input type="text" value={formData.endereco_base_cep} onChange={(e) => handleCepChange(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" placeholder="00000-000" maxLength={9} />
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
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Latitude</label>
                    <input type="number" step="any" value={formData.latitude_base} onChange={(e) => setFormData({...formData, latitude_base: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" placeholder="-27.592..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Longitude</label>
                    <input type="number" step="any" value={formData.longitude_base} onChange={(e) => setFormData({...formData, longitude_base: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" placeholder="-48.563..." />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Raio (KM)</label>
                    <input type="number" value={formData.raio_atendimento_km} onChange={(e) => setFormData({...formData, raio_atendimento_km: parseInt(e.target.value) || 10})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-[#2F3437] uppercase tracking-wider mb-3">Financeiro</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Tipo Pix</label>
                    <input type="text" value={formData.pix_tipo} onChange={(e) => setFormData({...formData, pix_tipo: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-[#6B7280] uppercase mb-1.5">Chave Pix</label>
                    <input type="text" value={formData.pix_chave} onChange={(e) => setFormData({...formData, pix_chave: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1">Mínimo 4h (R$)</label>
                    <input type="number" step="0.01" value={formData.valor_minimo_4h} onChange={(e) => setFormData({...formData, valor_minimo_4h: e.target.value})} className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1">Mínimo 6h (R$)</label>
                    <input type="number" step="0.01" value={formData.valor_minimo_6h} onChange={(e) => setFormData({...formData, valor_minimo_6h: e.target.value})} className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1">Mínimo 8h (R$)</label>
                    <input type="number" step="0.01" value={formData.valor_minimo_8h} onChange={(e) => setFormData({...formData, valor_minimo_8h: e.target.value})} className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1">Mínimo 12h (R$)</label>
                    <input type="number" step="0.01" value={formData.valor_minimo_12h} onChange={(e) => setFormData({...formData, valor_minimo_12h: e.target.value})} className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B7280] uppercase mb-1">Mínimo 24h (R$)</label>
                    <input type="number" step="0.01" value={formData.valor_minimo_24h} onChange={(e) => setFormData({...formData, valor_minimo_24h: e.target.value})} className="w-full px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium outline-none" />
                  </div>
                </div>
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
