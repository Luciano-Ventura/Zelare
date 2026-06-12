"use client";

import { useState } from "react";
import { updatePlantaoStatus } from "@/app/admin/(protected)/plantoes/actions";
import { MessageCircle, Play, CheckCircle2, XCircle, Clock } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export type Plantao = {
  id: string;
  familia_nome: string;
  familia_whatsapp: string;
  profissional_nome: string;
  profissional_whatsapp: string;
  data_plantao: string;
  horario_inicio: string;
  duracao: string;
  cidade: string;
  bairro: string;
  valor_profissional: number;
  taxa_zelare: number;
  total_familia: number;
  status: string;
};

const COLUMNS = [
  "Confirmado",
  "Em andamento",
  "Concluído",
  "Reagendado",
  "Cancelado"
];

export function KanbanBoard({ initialPlantoes }: { initialPlantoes: Plantao[] }) {
  const [plantoes, setPlantoes] = useState(initialPlantoes);
  const [movingId, setMovingId] = useState<string | null>(null);

  const moveCard = async (id: string, newStatus: string) => {
    setMovingId(id);
    
    // Optimistic update
    setPlantoes(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    
    const result = await updatePlantaoStatus(id, newStatus);
    
    if (result.error) {
      alert("Erro ao mover: " + result.error);
      // Revert on error
      setPlantoes(initialPlantoes);
    }
    
    setMovingId(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x h-full">
      {COLUMNS.map(colStatus => {
        const colPlantoes = plantoes.filter(p => p.status === colStatus);
        
        return (
          <div key={colStatus} className="flex-shrink-0 w-[320px] bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200/60 flex flex-col max-h-[85vh] snap-center shadow-sm">
            {/* Header */}
            <div className="p-5 border-b border-gray-200/50 flex justify-between items-center bg-[#FAFAF7] rounded-t-3xl">
              <h3 className="font-bold text-[#2F3437]">{colStatus}</h3>
              <span className="text-xs font-bold bg-[#8ECADF]/20 text-[#2F3437] px-2.5 py-1 rounded-full">
                {colPlantoes.length}
              </span>
            </div>

            {/* Cards Area */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {colPlantoes.map(p => {
                const isMoving = movingId === p.id;
                
                const zapFamilia = `https://wa.me/55${p.familia_whatsapp}`;
                const zapProfissional = `https://wa.me/55${p.profissional_whatsapp}`;

                return (
                  <div 
                    key={p.id} 
                    className={`bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-200 p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 ${isMoving ? 'opacity-50 scale-95' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-[11px] font-black tracking-wider text-[#8ECADF] bg-[#8ECADF]/10 px-2 py-1 rounded-md uppercase">
                        {p.data_plantao} às {p.horario_inicio}
                      </div>
                      <StatusBadge status={p.status} />
                    </div>

                    <div className="space-y-4 mb-5">
                      {/* Familia */}
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-[#6B7280]">Família</p>
                          <p className="text-sm font-bold text-[#2F3437] line-clamp-1">{p.familia_nome}</p>
                        </div>
                        <a href={zapFamilia} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#A8D5BA]/20 text-[#2F3437] rounded-xl hover:bg-[#A8D5BA] transition-colors" title="WhatsApp Família">
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>

                      {/* Profissional */}
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-[#6B7280]">Profissional</p>
                          <p className="text-sm font-bold text-[#2F3437] line-clamp-1">{p.profissional_nome}</p>
                        </div>
                        <a href={zapProfissional} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#A8D5BA]/20 text-[#2F3437] rounded-xl hover:bg-[#A8D5BA] transition-colors" title="WhatsApp Profissional">
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-5 bg-[#FAFAF7] p-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-[#6B7280]">Duração</p>
                        <p className="text-xs font-bold text-[#2F3437]">{p.duracao}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-[#6B7280]">Local</p>
                        <p className="text-xs font-bold text-[#2F3437] truncate">{p.cidade}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 border-t border-gray-100 pt-4 mb-5">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-[#6B7280]">Repasse:</span>
                        <span className="text-[#2F3437]">R$ {p.valor_profissional?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-[#6B7280]">Zelare:</span>
                        <span className="text-[#2F3437]">R$ {p.taxa_zelare?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs pt-2 mt-2 border-t border-gray-100">
                        <span className="font-bold text-[#6B7280]">Total Família:</span>
                        <span className="font-black text-[#8ECADF]">R$ {p.total_familia?.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Actions Específicas por Status */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                      
                      {p.status === "Confirmado" && (
                        <>
                          <button onClick={() => moveCard(p.id, "Em andamento")} disabled={isMoving} className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5">
                            <Play className="w-3.5 h-3.5" /> Iniciar
                          </button>
                          <button onClick={() => moveCard(p.id, "Reagendado")} disabled={isMoving} className="px-3 py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors flex items-center justify-center">
                            <Clock className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => moveCard(p.id, "Cancelado")} disabled={isMoving} className="px-3 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center">
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {p.status === "Em andamento" && (
                        <button onClick={() => moveCard(p.id, "Concluído")} disabled={isMoving} className="w-full py-2 bg-[#A8D5BA] text-[#2F3437] rounded-xl text-xs font-bold hover:brightness-95 transition-all shadow-sm flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Concluir Plantão
                        </button>
                      )}

                      {p.status === "Reagendado" && (
                        <>
                          <button onClick={() => moveCard(p.id, "Confirmado")} disabled={isMoving} className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5">
                            Reconfirmar
                          </button>
                          <button onClick={() => moveCard(p.id, "Cancelado")} disabled={isMoving} className="px-3 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center">
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {(p.status === "Concluído" || p.status === "Cancelado") && (
                        <div className="w-full text-center py-1.5 text-xs font-bold text-[#6B7280]">
                          Ação finalizada
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}

              {colPlantoes.length === 0 && (
                <div className="text-center p-8 border-2 border-dashed border-gray-200/60 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vazio</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
