"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  CalendarClock, 
  Star, 
  AlertTriangle,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { logout } from "@/app/admin/auth-actions";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Solicitações", href: "/admin/solicitacoes", icon: Users },
  { name: "Profissionais", href: "/admin/profissionais", icon: UserSquare2 },
  { name: "Plantões", href: "/admin/plantoes", icon: CalendarClock },
  { name: "Avaliações", href: "/admin/avaliacoes", icon: Star },
  { name: "Ocorrências", href: "/admin/ocorrencias", icon: AlertTriangle },
];

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
        <span className="font-bold text-blue-dark text-xl tracking-tight">Zelare CRM</span>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
          {isOpen ? <X className="w-6 h-6 text-text-main" /> : <Menu className="w-6 h-6 text-text-main" />}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:flex-shrink-0
      `}>
        <div className="h-full flex flex-col pt-16 lg:pt-0">
          <div className="hidden lg:flex h-16 items-center px-6 border-b border-gray-200">
            <span className="font-bold text-blue-dark text-2xl tracking-tight">Zelare CRM</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? "bg-blue-light/10 text-blue-light" 
                      : "text-text-secondary hover:bg-gray-50 hover:text-text-main"
                    }
                  `}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-blue-light" : "text-gray-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center px-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-light/20 flex items-center justify-center text-blue-light font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-text-main">{userName}</p>
                <p className="text-xs text-text-secondary">Administrador</p>
              </div>
            </div>
            
            <form action={logout}>
              <button 
                type="submit" 
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sair
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
