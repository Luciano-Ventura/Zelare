export function sortSolicitacoes(items: any[]) {
  const priorityMap: Record<string, number> = {
    'Novo pedido': 1,
    'Aguardando informações': 1,
    'Procurando profissional': 1,
    'Aguardando pagamento': 1,
    'Confirmado': 2,
    'Em andamento': 2,
    'Concluído': 3,
    'Cancelado': 3,
    'Perdido': 3,
    'Sem profissional disponível': 3,
  };

  return items.sort((a, b) => {
    let pA = priorityMap[a.status] || 2;
    let pB = priorityMap[b.status] || 2;
    if (a.e_urgente) pA = 1;
    if (b.e_urgente) pB = 1;

    if (pA !== pB) return pA - pB;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function sortProfissionais(items: any[]) {
  const priorityMap: Record<string, number> = {
    'Novo cadastro': 1,
    'Em análise': 1,
    'Aguardando informações': 1,
    'Validado': 2,
    'Disponível': 2,
    'Ativo': 2,
    'Inativo': 3,
    'Bloqueado': 3,
    'Reprovado': 3,
  };

  return items.sort((a, b) => {
    const pA = priorityMap[a.status] || 2;
    const pB = priorityMap[b.status] || 2;
    if (pA !== pB) return pA - pB;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function sortOcorrencias(items: any[]) {
  const statusPriority: Record<string, number> = {
    'Aberta': 1,
    'Em análise': 1,
    'Resolvida': 3,
    'Arquivada': 3,
    'Cancelada': 3,
  };

  const gravidadePriority: Record<string, number> = {
    'Crítica': 1,
    'Alta': 1,
    'Média': 2,
    'Baixa': 3,
  };

  return items.sort((a, b) => {
    const sA = statusPriority[a.status] || 2;
    const sB = statusPriority[b.status] || 2;
    
    if (sA !== sB) return sA - sB;

    const gA = gravidadePriority[a.gravidade] || 2;
    const gB = gravidadePriority[b.gravidade] || 2;

    if (gA !== gB) return gA - gB;

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function sortPagamentos(items: any[]) {
  const priorityMap: Record<string, number> = {
    'Aguardando pagamento': 1,
    'Falhou': 1,
    'Expirado': 1,
    'Reembolsado': 2,
    'Cancelado': 2,
    'Pago': 3,
  };

  return items.sort((a, b) => {
    const pA = priorityMap[a.status_pagamento] || 2;
    const pB = priorityMap[b.status_pagamento] || 2;
    if (pA !== pB) return pA - pB;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function sortRepasses(items: any[]) {
  const priorityMap: Record<string, number> = {
    'Pronto para repasse': 1,
    'Bloqueado': 1,
    'Aguardando liberação': 1,
    'Aguardando conclusão': 2,
    'Repassado': 3,
    'Cancelado': 3,
  };

  return items.sort((a, b) => {
    const pA = priorityMap[a.status_repasse] || 2;
    const pB = priorityMap[b.status_repasse] || 2;
    if (pA !== pB) return pA - pB;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}
