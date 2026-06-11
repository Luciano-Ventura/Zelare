import Link from "next/link";
import { LINKS, NAVIGATION } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-bg-main pt-16 pb-8 border-t border-sand-light/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 mb-16">
          
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold tracking-tight text-blue-light drop-shadow-sm mb-4 inline-block">
              Zelare
            </Link>
            <p className="text-sm text-text-secondary pr-4">
              Conectando famílias a quem sabe cuidar.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-text-main mb-4">Plataforma</h3>
            <ul className="space-y-3">
              {NAVIGATION.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-text-secondary hover:text-text-main transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-main mb-4">Acesso rápido</h3>
            <ul className="space-y-3">
              <li>
                <Link href={LINKS.requestCare} className="text-sm text-text-secondary hover:text-text-main transition-colors">
                  Solicitar cuidado
                </Link>
              </li>
              <li>
                <Link href={LINKS.professionalRegistration} className="text-sm text-text-secondary hover:text-text-main transition-colors">
                  Cadastrar profissional
                </Link>
              </li>
              <li>
                <a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-text-main transition-colors">
                  Atendimento WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-text-main mb-4">Aviso Legal</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              A Zelare está em fase inicial de validação. A disponibilidade de profissionais depende da região, horário, perfil solicitado e cadastros ativos. A Zelare não realiza atendimento médico de emergência.
            </p>
          </div>

        </div>

        <div className="border-t border-sand-light/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} Zelare. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
