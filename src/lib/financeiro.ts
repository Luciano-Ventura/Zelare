export type PricingRegiao = {
  id: string;
  valor_base_profissional: number;
  taxa_zelare_percentual: number;
  taxa_zelare_minima: number;
};

export type ProfissionalLimites = {
  valor_minimo_usado: number | null; 
};

export type CalcularPrecoParams = {
  regiao: PricingRegiao;
  profissional: ProfissionalLimites;
  adicionaisFixos?: number; 
};

export function calcularPrecoPlantao(params: CalcularPrecoParams) {
  const { regiao, profissional, adicionaisFixos = 0 } = params;

  // 1. Base vs Profissional Min
  const baseRegiao = Number(regiao.valor_base_profissional);
  const minProfissional = profissional.valor_minimo_usado ? Number(profissional.valor_minimo_usado) : 0;
  
  // 2. Usar o maior
  const baseRepasse = Math.max(baseRegiao, minProfissional);

  // 3. Somar adicionais ao repasse do profissional
  const valorProfissional = baseRepasse + adicionaisFixos;

  // 4. Calcular Taxa Zelare sobre o valorProfissional
  const percentual = Number(regiao.taxa_zelare_percentual) / 100;
  const taxaPercentualCalculada = valorProfissional * percentual;
  const taxaZelare = Math.max(Number(regiao.taxa_zelare_minima), taxaPercentualCalculada);

  // 5. Total Familia
  const totalFamilia = valorProfissional + taxaZelare;

  // 6. Margem %
  const margemPercentual = (taxaZelare / totalFamilia) * 100;

  return {
    pricing_id: regiao.id,
    valor_base_regiao: Number(baseRegiao.toFixed(2)),
    valor_minimo_profissional_usado: Number(minProfissional.toFixed(2)),
    valor_profissional: Number(valorProfissional.toFixed(2)),
    taxa_zelare: Number(taxaZelare.toFixed(2)),
    total_familia: Number(totalFamilia.toFixed(2)),
    margem_percentual: Number(margemPercentual.toFixed(2))
  };
}

