import { requireProfissional } from "@/lib/auth-profissional";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";
import { ChevronLeft, MapPin, Calendar, Clock, Phone, CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";
import AcoesPlantao from "./AcoesPlantao";

export const revalidate = 0;

export default async function PlantaoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const sessao = await requireProfissional();
  const resolvedParams = await params;

  const { data: p } = await supabaseAdmin
    .from("plantoes")
    .select("*")
    .eq("id", resolvedParams.id)
    .eq("profissional_id", sessao.id)
    .single();

  if (!p) {
    notFound();
  }

  return (
    <div className="p-6 pb-32">
      <Link href="/profissional/plantoes" className="inline-flex items-center text-sm font-bold text-[#6B7280] mb-6">
        <ChevronLeft className="w-5 h-5 mr-1" /> Voltar aos Plantões
      </Link>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#2F3437] tracking-tight">Plantão</h2>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md inline-block mt-2 ${
            p.status === 'Em andamento' ? 'bg-[#A8D5BA]/20 text-green-700' : 
            p.status === 'Concluído' ? 'bg-gray-100 text-gray-500' :
            'bg-[#8ECADF]/10 text-[#8ECADF]'
          }`}>
            Status Global: {p.status}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6 relative overflow-hidden">
        {p.status === "Em andamento" && (
          <div className="absolute top-0 left-0 w-full h-1 bg-[#A8D5BA]" />
        )}
        
        <div>
          <h3 className="text-[10px] font-bold text-[#8ECADF] uppercase tracking-wider mb-1">Cuidado Necessário</h3>
          <p className="font-black text-[#2F3437] text-xl">{p.tipo_cuidado}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Início</h3>
            <div className="flex items-center text-sm font-bold text-[#2F3437]">
              <Calendar className="w-4 h-4 mr-1 text-[#8ECADF]" /> {p.data_plantao} às {p.horario_inicio}
            </div>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Duração</h3>
            <div className="flex items-center text-sm font-bold text-[#2F3437]">
              <Clock className="w-4 h-4 mr-1 text-[#8ECADF]" /> {p.duracao}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Localização</h3>
          <div className="flex items-center text-sm font-bold text-[#2F3437]">
            <MapPin className="w-4 h-4 mr-1 text-[#8ECADF]" /> {p.cidade} - {p.bairro}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-2 flex items-center">
             Contato Família
          </h3>
          <p className="font-bold text-[#2F3437] mb-2">{p.familia_nome}</p>
          <a href={`https://wa.me/55${p.familia_whatsapp.replace(/\D/g, '')}`} target="_blank" className="inline-flex items-center px-4 py-2 bg-[#25D366]/10 text-[#25D366] rounded-lg text-sm font-bold hover:bg-[#25D366]/20 transition-colors">
            <Phone className="w-4 h-4 mr-2" /> WhatsApp
          </a>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider mb-1">Valor do Repasse</h3>
          <p className="text-2xl font-black text-[#8ECADF]">R$ {p.valor_profissional}</p>
        </div>
      </div>

      {p.status === "Concluído" && (
        <div className="bg-gradient-to-r from-[#A8D5BA]/20 to-[#A8D5BA]/40 border border-[#A8D5BA] rounded-3xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#A8D5BA] rounded-full flex items-center justify-center text-green-900 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-green-900">Plantão Finalizado!</h3>
          </div>
          <p className="text-green-800 text-sm font-medium">
            Muito obrigado pelo excelente trabalho. Seu repasse de <strong>R$ {p.valor_profissional}</strong> está em processamento e será depositado em breve na sua conta bancária cadastrada.
          </p>
        </div>
      )}

      <AcoesPlantao 
        id={p.id} 
        statusProfissional={p.status_profissional} 
        statusGlobal={p.status} 
      />

    </div>
  );
}
