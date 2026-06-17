import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { notFound, redirect } from "next/navigation";
import { User, LogOut } from "lucide-react";

export default async function ProfissionalAppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = await params;
  const token = resolvedParams.token;

  if (!token || token.length < 32) {
    notFound();
  }

  // Validar Token
  const { data: prof } = await supabaseAdmin
    .from("profissionais_cadastros")
    .select("id, nome_completo, acesso_app_status")
    .eq("token_acesso", token)
    .single();

  if (!prof) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <LogOut className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Link Inválido</h1>
        <p className="text-sm text-gray-500">Este link de acesso não existe ou expirou.</p>
      </div>
    );
  }

  if (prof.acesso_app_status !== "Ativo") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
          <ShieldOff className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Acesso Bloqueado</h1>
        <p className="text-sm text-gray-500">Seu acesso ao painel está temporariamente suspenso. Entre em contato com a equipe da Zelare.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans pb-32">
      <header className="bg-white border-b border-gray-100 p-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
        <h1 className="font-black text-[#8ECADF] text-xl tracking-tight">ZELARE <span className="text-xs text-gray-400 font-medium ml-1">Profissional</span></h1>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
          <User className="w-3 h-3" /> {prof.nome_completo.split(" ")[0]}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 sm:p-6 space-y-6">
        {children}
      </main>
    </div>
  );
}

// Dummy icon to avoid adding another import right now
function ShieldOff(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 2 20 20"/><path d="m12.5 12.5 1.5 1.5"/><path d="M5 5.5A2.3 2.3 0 0 1 7 4a15 15 0 0 0 5-2 15 15 0 0 0 5 2 2.3 2.3 0 0 1 2 1.5c.3 1.3.4 3 .4 4.5 0 3-1.6 7-4 10l-1 .8-1-.8A18 18 0 0 1 7 13.5"/></svg>
  );
}
