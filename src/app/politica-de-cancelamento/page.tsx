import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PoliticaDeCancelamentoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o início
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Política de Cancelamento</h1>
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">

          
          <h2>1. Cancelamento Antes do Pagamento</h2>
          <p>Se o plantão ainda não foi pago e confirmado, o cancelamento por parte da família ou do profissional pode ser feito a qualquer momento sem ônus financeiro. No entanto, o cancelamento repetitivo por parte do profissional nesta fase pode afetar sua classificação na plataforma.</p>

          <h2>2. Cancelamento Pela Família Após Pagamento</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Com antecedência superior a 24 horas:</strong> Reembolso integral.</li>
            <li><strong>Com antecedência inferior a 24 horas do plantão:</strong> Poderá ser retida uma taxa administrativa e parcial do valor do profissional, dependendo do tempo restante, para compensar o bloqueio de agenda.</li>
            <li><strong>Reembolsos:</strong> Todos os reembolsos são processados manualmente e podem levar alguns dias úteis para constar na fatura ou conta.</li>
          </ul>

          <h2>3. Cancelamento Pelo Profissional Após Confirmação</h2>
          <p>O cancelamento pelo profissional após o aceite e pagamento pela família é considerado falta grave, exceto em casos de força maior devidamente comprovados. A reincidência pode levar ao bloqueio permanente na Zelare. A família receberá reembolso integral ou a realocação imediata de um profissional substituto, a seu critério.</p>

          <h2>4. Cancelamento Pela Zelare</h2>
          <p>A Zelare reserva-se o direito de cancelar preventivamente qualquer plantão que apresente risco à segurança das partes, suspeita de fraude ou descumprimento dos Termos de Uso. O reembolso seguirá a análise da ocorrência.</p>
          
          <h2>5. Ocorrências e Disputas</h2>
          <p>Em caso de desacordos sobre o plantão prestado, o valor de repasse ao profissional será retido e uma ocorrência será aberta para mediação manual pela nossa equipe de operações.</p>
        </div>
      </div>
    </div>
  );
}
