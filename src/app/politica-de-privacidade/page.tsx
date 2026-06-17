import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o início
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Política de Privacidade</h1>
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">

          
          <h2>1. Coleta de Dados</h2>
          <p>Para o funcionamento da plataforma, coletamos:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>De Famílias:</strong> Nome, contato, endereço, localização aproximada e detalhes sobre a necessidade de cuidado para a organização dos plantões.</li>
            <li><strong>De Profissionais:</strong> Nome, contato, documentos, certificações, histórico profissional, foto e localização.</li>
          </ul>

          <h2>2. Uso dos Dados</h2>
          <p>Os dados coletados são utilizados exclusivamente para a operação do serviço, incluindo o "match" entre a necessidade da família e o perfil do profissional, processamento financeiro e comunicação operacional.</p>

          <h2>3. Compartilhamento</h2>
          <p>A Zelare realiza o compartilhamento mínimo necessário de dados entre a família e o profissional aprovado para a execução do plantão (ex: o endereço exato só é compartilhado com o profissional após a confirmação e pagamento do plantão).</p>

          <h2>4. Segurança</h2>
          <p>Adotamos medidas técnicas para proteger os dados armazenados contra acessos não autorizados. Dados financeiros sensíveis (como cartões de crédito) são processados diretamente por gateways de pagamento homologados, não sendo armazenados em nossos servidores.</p>

          <h2>5. Seus Direitos</h2>
          <p>Você pode solicitar a exclusão, alteração ou exportação dos seus dados a qualquer momento entrando em contato com nosso suporte.</p>
        </div>
      </div>
    </div>
  );
}
