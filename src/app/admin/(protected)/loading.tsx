import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-[#6B7280]">
      <Loader2 className="w-10 h-10 animate-spin text-[#8ECADF] mb-4" />
      <p className="text-sm font-medium animate-pulse">Carregando informações...</p>
    </div>
  );
}
