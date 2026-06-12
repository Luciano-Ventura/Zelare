import { requireAdmin } from "@/lib/auth";
import { Sidebar } from "@/components/admin/Sidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (err) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/40 via-gray-50 to-white flex flex-col lg:flex-row selection:bg-blue-100">
      <Sidebar userName={admin.nome || admin.email.split('@')[0]} />
      
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
