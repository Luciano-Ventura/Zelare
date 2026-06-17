import { requireProfissional } from "@/lib/auth-profissional";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { User, Phone, Briefcase, MapPin } from "lucide-react";
import { AcoesPerfilProfissional } from "@/components/profissional/AcoesPerfilProfissional";

export const revalidate = 0;

export default async function PerfilPage() {
  const sessao = await requireProfissional();

  const { data: perfil } = await supabaseAdmin
    .from("profissionais_cadastros")
    .select("*")
    .eq("id", sessao.id)
    .single();

  return (
    <div className="p-6 pb-32 space-y-6">
      <h2 className="text-2xl font-black text-[#2F3437] tracking-tight">Meu Perfil</h2>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-[#A8D5BA] rounded-full flex items-center justify-center text-3xl font-black text-[#2F3437] mb-4">
          {sessao.nome_completo.charAt(0).toUpperCase()}
        </div>
        <h3 className="font-bold text-xl text-[#2F3437]">{sessao.nome_completo}</h3>
        <p className="text-[#8ECADF] font-bold text-sm uppercase tracking-wider">{sessao.categoria_profissional}</p>
        <span className="mt-2 bg-[#A8D5BA]/20 text-green-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
          {sessao.status}
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-5">
        <div className="flex items-center">
          <Phone className="w-5 h-5 text-[#8ECADF] mr-3" />
          <div>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">WhatsApp Cadastrado</p>
            <p className="font-bold text-[#2F3437]">{sessao.whatsapp}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <MapPin className="w-5 h-5 text-[#8ECADF] mr-3" />
          <div>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Localização Base</p>
            <p className="font-bold text-[#2F3437]">{perfil?.cidade} - {perfil?.bairro}</p>
          </div>
        </div>

        <div className="flex items-center">
          <Briefcase className="w-5 h-5 text-[#8ECADF] mr-3" />
          <div>
            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Formação / Experiência</p>
            <p className="font-bold text-[#2F3437]">{perfil?.formacao_experiencia || "Não informado"}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-center mt-6">
        <p className="text-sm font-medium text-[#2F3437] mb-3">Para alterar sua disponibilidade ou categoria profissional, entre em contato com a operação.</p>
        <a href="https://wa.me/5511999999999" target="_blank" className="inline-block bg-[#8ECADF] text-[#2F3437] font-black py-3 px-6 rounded-xl hover:brightness-95 transition-all">
          Falar com a Zelare
        </a>
      </div>

      <AcoesPerfilProfissional perfil={perfil} />
    </div>
  );
}
