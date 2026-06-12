import { getProfissionalSessao } from "@/lib/auth-profissional";
import Link from "next/link";
import { Home, CalendarClock, Bell, User } from "lucide-react";

export default async function ProfissionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessao = await getProfissionalSessao();

  // Se não tem sessão, exibe a página sem o menu inferior (como a tela de login)
  if (!sessao) {
    return <div className="min-h-screen bg-[#FAFAF7]">{children}</div>;
  }

  return (
    <div className="h-screen bg-[#FAFAF7] flex flex-col md:flex-row w-full overflow-hidden">
      
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col z-20 shadow-sm shrink-0">
        <div className="p-8 border-b border-gray-100">
          <h1 className="font-black text-[#8ECADF] text-3xl tracking-tighter leading-none">ZELARE</h1>
          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.2em] mt-1">Profissional</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/profissional" className="flex items-center gap-3 p-3 text-[#6B7280] hover:text-[#8ECADF] hover:bg-[#8ECADF]/10 rounded-xl transition-colors">
            <Home className="w-5 h-5" />
            <span className="font-bold text-sm">Início</span>
          </Link>
          <Link href="/profissional/oportunidades" className="flex items-center gap-3 p-3 text-[#6B7280] hover:text-[#8ECADF] hover:bg-[#8ECADF]/10 rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span className="font-bold text-sm">Convites Novos</span>
          </Link>
          <Link href="/profissional/plantoes" className="flex items-center gap-3 p-3 text-[#6B7280] hover:text-[#8ECADF] hover:bg-[#8ECADF]/10 rounded-xl transition-colors">
            <CalendarClock className="w-5 h-5" />
            <span className="font-bold text-sm">Meus Plantões</span>
          </Link>
          <Link href="/profissional/perfil" className="flex items-center gap-3 p-3 text-[#6B7280] hover:text-[#8ECADF] hover:bg-[#8ECADF]/10 rounded-xl transition-colors">
            <User className="w-5 h-5" />
            <span className="font-bold text-sm">Meu Perfil</span>
          </Link>
        </nav>
        <div className="p-6 border-t border-gray-100">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[#A8D5BA] flex items-center justify-center text-[#2F3437] font-bold shrink-0">
               {sessao.nome_completo.charAt(0).toUpperCase()}
             </div>
             <div className="flex-1 overflow-hidden">
               <p className="text-sm font-bold text-[#2F3437] truncate">{sessao.nome_completo}</p>
             </div>
           </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* HEADER MOBILE */}
        <header className="md:hidden bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10 flex justify-between items-center shadow-sm shrink-0">
          <div className="flex flex-col">
            <h1 className="font-black text-[#8ECADF] text-2xl tracking-tighter leading-none">ZELARE</h1>
            <p className="text-[9px] font-bold text-[#6B7280] uppercase tracking-[0.2em] mt-0.5">Profissional</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#A8D5BA] flex items-center justify-center text-[#2F3437] font-bold text-sm">
            {sessao.nome_completo.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* CONTEÚDO */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto w-full md:p-4">
            {children}
          </div>
        </main>

        {/* BOTTOM NAV MOBILE */}
        <nav className="md:hidden w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-20 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.02)] shrink-0">
          <Link href="/profissional" className="flex flex-col items-center text-[#6B7280] hover:text-[#8ECADF] transition-colors">
            <Home className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Início</span>
          </Link>
          <Link href="/profissional/oportunidades" className="flex flex-col items-center text-[#6B7280] hover:text-[#8ECADF] transition-colors relative">
            <Bell className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Convites</span>
          </Link>
          <Link href="/profissional/plantoes" className="flex flex-col items-center text-[#6B7280] hover:text-[#8ECADF] transition-colors">
            <CalendarClock className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Plantões</span>
          </Link>
          <Link href="/profissional/perfil" className="flex flex-col items-center text-[#6B7280] hover:text-[#8ECADF] transition-colors">
            <User className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold">Perfil</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
