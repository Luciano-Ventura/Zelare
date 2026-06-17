"use client";

import { useState } from "react";
import { updateStatusProfissional, processCheckIn, processCheckOutAndDiario } from "./actions";
import { Navigation, Play, CheckCircle2, ClipboardList, X } from "lucide-react";

export function PlantaoStatusActions({
  plantaoId,
  profissionalId,
  token,
  status,
  statusProfissional,
  familiaLat,
  familiaLng
}: {
  plantaoId: string;
  profissionalId: string;
  token: string;
  status: string;
  statusProfissional: string | null;
  familiaLat: number;
  familiaLng: number;
}) {
  const [loading, setLoading] = useState(false);
  const [showDiario, setShowDiario] = useState(false);
  
  // Diário State
  const [diarioForm, setDiarioForm] = useState({
    alimentacao: "",
    hidratacao: "",
    medicacao: "",
    higiene: "",
    troca_fralda: "",
    sono_repouso: "",
    humor: "",
    atividades_realizadas: "",
    intercorrencias: "",
    sinais_alerta: false,
    observacoes: "",
    confirmacao_profissional: true
  });

  const getGeoLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalização não suportada pelo navegador."));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      }
    });
  };

  const handleACaminho = async () => {
    setLoading(true);
    await updateStatusProfissional(plantaoId, "A caminho", token);
    setLoading(false);
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const pos = await getGeoLocation();
      const res = await processCheckIn(plantaoId, pos.coords.latitude, pos.coords.longitude, familiaLat, familiaLng, token);
      if (res.error) alert("Erro no check-in: " + res.error);
      else if (res.status === "Fora do raio") alert("Check-in realizado, porém você parece estar fora do raio esperado. Um alerta foi registrado.");
    } catch (e: any) {
      alert("Não foi possível capturar sua localização. Dê permissão ao navegador e tente novamente.");
    }
    setLoading(false);
  };

  const handleIniciarPlantao = async () => {
    setLoading(true);
    // Também poderia atualizar o status principal para "Em andamento"
    await updateStatusProfissional(plantaoId, "Em andamento", token);
    setLoading(false);
  };

  const handleFinalizarECheckOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diarioForm.confirmacao_profissional) {
      alert("Você deve confirmar as informações do diário.");
      return;
    }
    
    setLoading(true);
    try {
      const pos = await getGeoLocation();
      const res = await processCheckOutAndDiario(
        plantaoId, profissionalId, pos.coords.latitude, pos.coords.longitude, familiaLat, familiaLng, diarioForm, token
      );
      if (res.error) alert("Erro ao finalizar: " + res.error);
      else {
        setShowDiario(false);
        alert("Plantão finalizado com sucesso!");
      }
    } catch (e: any) {
      alert("Não foi possível capturar sua localização para o Check-out. Dê permissão e tente novamente.");
    }
    setLoading(false);
  };

  if (status === "Concluído") {
    return (
      <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 text-center font-bold">
        Plantão Concluído!
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {(!statusProfissional || statusProfissional === "Confirmado") && (
          <button onClick={handleACaminho} disabled={loading} className="w-full py-4 bg-white border-2 border-[#8ECADF] text-[#8ECADF] font-black rounded-xl hover:bg-[#8ECADF] hover:text-white transition-colors flex items-center justify-center gap-2">
            <Navigation className="w-5 h-5" /> Estou a Caminho
          </button>
        )}

        {statusProfissional === "A caminho" && (
          <button onClick={handleCheckIn} disabled={loading} className="w-full py-4 bg-[#8ECADF] text-white font-black rounded-xl hover:brightness-95 transition-colors flex items-center justify-center gap-2">
            <MapPin className="w-5 h-5" /> Fazer Check-in (Cheguei)
          </button>
        )}

        {statusProfissional === "No local" && (
          <button onClick={handleIniciarPlantao} disabled={loading} className="w-full py-4 bg-indigo-500 text-white font-black rounded-xl hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2">
            <Play className="w-5 h-5" /> Iniciar Plantão
          </button>
        )}

        {statusProfissional === "Em andamento" && (
          <button onClick={() => setShowDiario(true)} disabled={loading} className="w-full py-4 bg-green-500 text-white font-black rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Finalizar e Preencher Diário
          </button>
        )}
      </div>

      {showDiario && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setShowDiario(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <X className="w-5 h-5 text-gray-600" />
            </button>
            
            <h3 className="text-xl font-black text-gray-900 mb-2 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-green-500" /> Diário de Bordo
            </h3>
            <p className="text-xs text-gray-500 mb-6">Preencha o relatório para a família. Ao confirmar, o Check-out será realizado via GPS.</p>

            <form onSubmit={handleFinalizarECheckOut} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Alimentação</label>
                <input type="text" className="w-full p-3 border border-gray-200 rounded-xl text-sm" placeholder="Ex: Comeu bem, aceitou tudo" value={diarioForm.alimentacao} onChange={e => setDiarioForm({...diarioForm, alimentacao: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Medicação conforme orientação prévia da família/responsável</label>
                <input type="text" className="w-full p-3 border border-gray-200 rounded-xl text-sm" placeholder="Ex: Medicação das 10h dada" value={diarioForm.medicacao} onChange={e => setDiarioForm({...diarioForm, medicacao: e.target.value})} />
                <p className="text-[10px] text-orange-600 mt-1">* Não altere doses ou prescrições por conta própria.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Hidratação</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl text-sm" value={diarioForm.hidratacao} onChange={e => setDiarioForm({...diarioForm, hidratacao: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Higiene</label>
                  <input type="text" className="w-full p-3 border border-gray-200 rounded-xl text-sm" value={diarioForm.higiene} onChange={e => setDiarioForm({...diarioForm, higiene: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Observações / Atividades</label>
                <textarea className="w-full p-3 border border-gray-200 rounded-xl text-sm h-24" placeholder="Detalhes adicionais..." value={diarioForm.observacoes} onChange={e => setDiarioForm({...diarioForm, observacoes: e.target.value})}></textarea>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                <input type="checkbox" id="alerta" checked={diarioForm.sinais_alerta} onChange={e => setDiarioForm({...diarioForm, sinais_alerta: e.target.checked})} className="w-4 h-4 text-red-600" />
                <label htmlFor="alerta" className="text-sm font-bold text-red-800">Sinais de alerta graves? (Contato urgente)</label>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-green-500 text-white font-black rounded-xl hover:bg-green-600 transition-colors mt-6">
                {loading ? "Processando GPS..." : "Finalizar Turno e Check-out"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// Dummy icon
function MapPin(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  );
}
