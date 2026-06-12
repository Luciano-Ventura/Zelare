import { getProfissionalSessao } from "@/lib/auth-profissional";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Login Profissional | Zelare",
};

export default async function ProfissionalLoginPage() {
  const sessao = await getProfissionalSessao();
  
  if (sessao) {
    redirect("/profissional");
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col justify-center px-6 py-12 max-w-md mx-auto relative">
      <div className="absolute top-0 left-0 w-full h-64 bg-[#8ECADF]/10 rounded-b-[40px] -z-10" />
      
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-[#8ECADF] tracking-tighter mb-2">ZELARE</h1>
        <p className="text-sm font-bold text-[#6B7280] uppercase tracking-wider">Acesso do Profissional</p>
      </div>

      <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <h2 className="text-xl font-bold text-[#2F3437] mb-6 text-center">Bem-vindo(a) de volta</h2>
        <LoginForm />
      </div>

      <p className="text-center text-xs font-medium text-gray-400 mt-8 px-8">
        O seu código de acesso é único e intransferível. Nunca compartilhe com terceiros.
      </p>
    </div>
  );
}
