export function StatusBadge({ status }: { status: string }) {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-800";

  switch (status.toLowerCase()) {
    case "novo pedido":
    case "novo cadastro":
    case "validado":
      bgColor = "bg-[#8ECADF]"; // Azul Zelare
      textColor = "text-[#2F3437]";
      break;
    case "em análise":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
    case "procurando profissional":
    case "propostas recebidas":
      bgColor = "bg-blue-50";
      textColor = "text-blue-700";
      break;
    case "aguardando família":
    case "aguardando informações":
      bgColor = "bg-[#E8DCC8]"; // Areia
      textColor = "text-[#2F3437]";
      break;
    case "confirmado":
    case "disponível":
    case "ativo":
      bgColor = "bg-[#A8D5BA]"; // Verde Zelare
      textColor = "text-[#2F3437]";
      break;
    case "em andamento":
      bgColor = "bg-blue-600";
      textColor = "text-white";
      break;
    case "concluído":
    case "resolvida":
      bgColor = "bg-emerald-700";
      textColor = "text-white";
      break;
    case "cancelado":
    case "bloqueado":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    case "sem profissional disponível":
      bgColor = "bg-orange-100";
      textColor = "text-orange-800";
      break;
    case "perdido":
    case "inativo":
      bgColor = "bg-gray-200";
      textColor = "text-gray-700";
      break;
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider font-bold ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
}
