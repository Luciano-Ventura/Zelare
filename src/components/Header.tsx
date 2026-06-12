import Link from "next/link";
import { LINKS, NAVIGATION } from "@/lib/constants";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { Heart } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-sand-light/50 bg-bg-main/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-light text-white shadow-sm transition-transform group-hover:scale-105">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-text-main">
            Zelare
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAVIGATION.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text-main"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={LINKS.whatsappGeneral}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center justify-center gap-2 rounded-full bg-blue-light px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-light/90 lg:flex shadow-sm"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Falar pelo WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
