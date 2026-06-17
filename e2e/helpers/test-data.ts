const uniqueSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

export const TEST_DATA = {
  familia: {
    nome: `E2E Família Teste ${uniqueSuffix}`,
    whatsapp: `4899999${uniqueSuffix}`,
    cep: "88015000",
  },
  profissional: {
    nome: `E2E Cuidador Teste ${uniqueSuffix}`,
    whatsapp: `4898888${uniqueSuffix}`,
    cep: "88015000",
  },
  admin: {
    email: process.env.ADMIN_EMAIL || "admin@zelare.com",
    password: process.env.ADMIN_PASSWORD || "zelare123",
  }
};
