import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { KanbanBoard } from "@/components/admin/KanbanBoard";

export const revalidate = 0;

export default async function PlantoesPage() {
  await requireAdmin();

  const { data: plantoes } = await supabaseAdmin
    .from("plantoes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">Kanban de Plantões</h1>
          <p className="text-sm text-text-secondary mt-1">Gerencie o fluxo de atendimentos em tempo real.</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <KanbanBoard initialPlantoes={plantoes || []} />
      </div>
    </div>
  );
}
