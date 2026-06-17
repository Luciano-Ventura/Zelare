export const maskPhone = (value: string | undefined) => {
  if (!value) return "";
  
  // Remove tudo que não é dígito
  let v = value.replace(/\D/g, "");
  
  // Limita a 11 dígitos
  if (v.length > 11) v = v.slice(0, 11);
  
  // Formata: (48) 99999-9999 ou (48) 9999-9999
  if (v.length > 2) {
    v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
  }
  if (v.length > 9) {
    v = `${v.slice(0, 10)}-${v.slice(10)}`;
  }
  
  return v;
};

export const maskCurrency = (value: string | undefined) => {
  if (!value) return "";
  
  // Remove tudo que não é dígito
  const v = value.replace(/\D/g, "");
  
  // Converte para número e divide por 100 para ter os centavos
  const num = Number(v) / 100;
  
  if (isNaN(num)) return "";

  // Formata como moeda BRL
  return num.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const maskDate = (value: string | undefined) => {
  if (!value) return "";
  let v = value.replace(/\D/g, "");
  if (v.length > 8) v = v.slice(0, 8);
  if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
  if (v.length > 5) v = `${v.slice(0, 5)}/${v.slice(5)}`;
  return v;
};

export const maskTime = (value: string | undefined) => {
  if (!value) return "";
  let v = value.replace(/\D/g, "");
  if (v.length > 4) v = v.slice(0, 4);
  if (v.length > 2) v = `${v.slice(0, 2)}:${v.slice(2)}`;
  return v;
};
