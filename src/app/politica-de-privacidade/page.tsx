import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Zelare",
  description: "Política de privacidade e uso de dados da Zelare.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-bg-main py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-main transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o início
        </Link>
        
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm ring-1 ring-sand-light/50">
          <h1 className="text-3xl font-bold tracking-tight text-text-main mb-8">
            Política de Privacidade
          </h1>
          
          <div className="space-y-6 text-text-secondary leading-relaxed">
            <p>
              A Zelare valoriza a sua privacidade e está comprometida em proteger os seus dados pessoais. Esta política explica de forma simples como lidamos com as informações coletadas em nossa plataforma.
            </p>
            
            <div>
              <h2 className="text-lg font-semibold text-text-main mb-2">Fase Inicial (MVP)</h2>
              <p>
                Atualmente, a Zelare está em fase inicial de validação (MVP). Isso significa que estamos testando o formato do serviço antes de construir um aplicativo completo. Nosso atendimento é humanizado e feito de forma semi-manual pela nossa equipe.
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-text-main mb-2">Quais dados coletamos?</h2>
              <p>
                Coletamos apenas as informações essenciais enviadas voluntariamente por você através de nossos formulários (como nome, telefone, região e detalhes da necessidade de cuidado ou do perfil profissional).
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-text-main mb-2">Como os dados são usados?</h2>
              <p>
                Seus dados são usados exclusivamente para:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Analisar sua solicitação de cuidado ou cadastro profissional.</li>
                <li>Entrar em contato com você via WhatsApp para organizar os atendimentos.</li>
                <li>Melhorar a qualidade e segurança da nossa rede.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-text-main mb-2">Compartilhamento e Exposição</h2>
              <p>
                <strong>Seus dados não serão expostos publicamente.</strong> As informações são tratadas de forma confidencial pela nossa equipe de triagem. Apenas informações estritamente necessárias (como o bairro e o tipo de cuidado) serão compartilhadas entre a família e o profissional durante o processo de combinação do plantão.
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold text-text-main mb-2">Remoção de Dados</h2>
              <p>
                Você tem o direito de solicitar a remoção total dos seus dados da nossa base a qualquer momento. Basta entrar em contato conosco pelo WhatsApp oficial e sua solicitação será atendida prontamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
