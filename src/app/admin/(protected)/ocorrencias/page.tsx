import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AlertTriangle } from "lucide-react";

export const revalidate = 0;

export default async function OcorrenciasPage() {
  await requireAdmin();

  const { data: ocorrencias } = await supabaseAdmin
    .from("ocorrencias")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Ocorrências</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Tipo / Gravidade</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Descrição</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Data</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Responsável</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ocorrencias?.map((oc) => (
                <tr key={oc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {oc.gravidade === "Alta" || oc.gravidade === "Crítica" ? (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      ) : null}
                      <span className="text-sm font-medium text-text-main">{oc.tipo_ocorrencia}</span>
                    </div>
                    <span className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-md font-semibold ${
                      oc.gravidade === "Baixa" ? "bg-green-100 text-green-700" :
                      oc.gravidade === "Média" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {oc.gravidade}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-secondary max-w-md truncate">{oc.descricao}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {new Date(oc.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main">
                    {oc.responsavel || "Não atribuído"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={oc.status} />
                  </td>
                </tr>
              ))}
              
              {(!ocorrencias || ocorrencias.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-text-secondary">
                    Nenhuma ocorrência registrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
