"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Clock, Edit2, X, ChevronDown, ChevronUp } from "lucide-react";
import { updateChecklistItem } from "@/app/admin/(protected)/actions";

export function PreLaunchChecklist({ items }: { items: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const categories = Array.from(new Set(items.map(i => i.categoria)));

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsPending(true);
    await updateChecklistItem(id, newStatus);
    setIsPending(false);
  };

  const handleSaveObs = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    setIsPending(true);
    const fd = new FormData(e.currentTarget);
    await updateChecklistItem(id, items.find(i => i.id === id).status, fd.get("observacao") as string);
    setEditingId(null);
    setIsPending(false);
  };

  const progress = Math.round((items.filter(i => i.status === "Concluído").length / (items.length || 1)) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col mb-8 overflow-hidden">
      <div 
        className="p-5 border-b border-gray-100 flex justify-between items-center bg-blue-50 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h2 className="text-lg font-bold text-blue-900 tracking-tight flex items-center gap-2">
            🚀 Checklist de Operação Piloto
            <span className="text-xs font-semibold bg-blue-200 text-blue-800 px-2 py-0.5 rounded-md">{progress}% concluído</span>
          </h2>
          <p className="text-sm text-blue-700 mt-1">Conclua estes itens antes de divulgar massivamente.</p>
        </div>
        <button className="text-blue-500 hover:bg-blue-100 p-2 rounded-lg transition-colors">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat} className="space-y-3">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2">{cat}</h3>
              <div className="space-y-2">
                {items.filter(i => i.categoria === cat).map(item => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100 group">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <button 
                          disabled={isPending}
                          onClick={() => handleUpdateStatus(item.id, item.status === "Concluído" ? "Pendente" : "Concluído")}
                          className="mt-0.5 shrink-0"
                        >
                          {item.status === "Concluído" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : item.status === "Em andamento" ? (
                            <Clock className="w-5 h-5 text-yellow-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                          )}
                        </button>
                        <div>
                          <p className={`text-sm font-medium ${item.status === "Concluído" ? "line-through text-gray-400" : "text-gray-700"}`}>
                            {item.item}
                          </p>
                          {item.status !== "Concluído" && (
                            <div className="flex gap-2 mt-1">
                              {item.status === "Pendente" && (
                                <button onClick={() => handleUpdateStatus(item.id, "Em andamento")} className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 rounded uppercase font-semibold">Iniciar</button>
                              )}
                              {item.observacao && !editingId && (
                                <span className="text-[11px] text-gray-500 italic max-w-[150px] truncate" title={item.observacao}>{item.observacao}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => setEditingId(editingId === item.id ? null : item.id)}
                        className="text-gray-300 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100 p-1"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>

                    {editingId === item.id && (
                      <form onSubmit={(e) => handleSaveObs(e, item.id)} className="mt-3 bg-white p-2 border rounded-md shadow-sm animate-in fade-in slide-in-from-top-2">
                        <input 
                          name="observacao" 
                          defaultValue={item.observacao || ""} 
                          placeholder="Adicionar observação..." 
                          className="w-full text-xs border rounded px-2 py-1.5 focus:outline-blue-500"
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button type="button" onClick={() => setEditingId(null)} className="text-[10px] text-gray-500 font-medium px-2 py-1">Cancelar</button>
                          <button type="submit" className="text-[10px] bg-blue-600 text-white font-medium px-2 py-1 rounded">Salvar</button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
