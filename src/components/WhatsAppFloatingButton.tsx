import { LINKS } from "@/lib/constants";
import { WhatsAppIcon } from "./WhatsAppIcon";

export default function WhatsAppFloatingButton() {
  return (
    <a
      href={LINKS.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 ring-4 ring-white transition-transform hover:-translate-y-1 hover:scale-105 sm:bottom-8 sm:right-8"
      aria-label="Falar pelo WhatsApp"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}
