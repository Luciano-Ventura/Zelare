import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermosDeUsoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o início
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Termos de Uso</h1>
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <h2>1. Sobre a Zelare</h2>
          <p>A Zelare é uma plataforma tecnológica que conecta famílias a profissionais de cuidado cadastrados e analisados pela nossa equipe.</p>
          
          <h2>2. Natureza do Serviço</h2>
          <p>A Zelare <strong>não é um serviço de emergência médica</strong> e <strong>não substitui atendimento médico ou hospitalar</strong>. Em caso de urgências médicas, acione imediatamente o SAMU (192) ou dirija-se a um hospital.</p>

          <h2>3. Pagamentos e Confirmação</h2>
          <p>Os plantões só são considerados confirmados após a realização e compensação do pagamento através da plataforma. Tentativas de "fechamento por fora" (desintermediação) violam estes Termos e podem resultar no bloqueio permanente da família e do profissional na plataforma, além da perda de qualquer suporte ou garantia associada ao serviço.</p>

          <h2>4. Responsabilidades</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Do Profissional:</strong> É responsável por cumprir o atendimento acordado no horário, local e condições estabelecidas, bem como por manter conduta ética e profissional.</li>
            <li><strong>Da Família:</strong> É responsável por fornecer informações corretas, detalhadas e verdadeiras sobre a necessidade de cuidado e as condições do local.</li>
          </ul>

          <h2>5. Cancelamentos</h2>
          <p>Os cancelamentos seguem regras específicas detalhadas na nossa <Link href="/politica-de-cancelamento" className="text-blue-600 hover:underline">Política de Cancelamento</Link>.</p>
        </div>
      </div>
    </div>
  );
}
