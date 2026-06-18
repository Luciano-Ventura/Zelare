import { PaymentGateway, PaymentRequest, PaymentResponse } from "./types";

export class AbacatePayGateway implements PaymentGateway {
  name = "abacatepay";
  private apiKey: string;
  private baseUrl = "https://api.abacatepay.com/v1";

  constructor() {
    this.apiKey = process.env.ABACATEPAY_API_KEY || "";
    if (!this.apiKey) {
      console.warn("ABACATEPAY_API_KEY is not defined. Payments will fail in production.");
    }
  }

  async createPixPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const payload = {
        frequency: "ONE_TIME",
        methods: ["PIX"],
        products: [
          {
            externalId: request.externalId || "plantao",
            name: request.description,
            quantity: 1,
            price: request.amountCentavos,
          }
        ],
        returnUrl: "https://app.zelare.com.br", // Fictional return url
        completionUrl: "https://app.zelare.com.br",
        customer: {
          name: request.customer.name,
          cellphone: request.customer.phone || "48999999999",
          email: request.customer.email,
          taxId: request.customer.tax_id.replace(/\D/g, "") || "11144477735",
        },
        metadata: {
          solicitacao_id: request.externalId
        }
      };

      const response = await fetch(`${this.baseUrl}/billing/create`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("AbacatePay API Error:", errorData);
        return { success: false, error: "Falha ao gerar cobrança no AbacatePay: " + JSON.stringify(errorData) };
      }

      const data = await response.json();
      
      // AbacatePay's /billing/create returns a checkout URL, not a direct PIX string.
      return {
        success: true,
        gatewayId: data.data?.id,
        pixEmv: "", // Not available directly in /create
        qrCodeUrl: data.data?.url, // The checkout URL
      };
    } catch (error) {
      console.error("AbacatePay Exception:", error);
      return { success: false, error: "Erro de conexão com o gateway." };
    }
  }
}
