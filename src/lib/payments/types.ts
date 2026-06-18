export interface PaymentCustomer {
  name: string;
  email: string;
  tax_id: string; // CPF
  phone?: string;
}

export interface PaymentRequest {
  amountCentavos: number;
  description: string;
  customer: PaymentCustomer;
  externalId: string; // The solicitação ID for tracking
}

export interface PaymentResponse {
  success: boolean;
  gatewayId?: string;
  pixEmv?: string;
  qrCodeUrl?: string;
  error?: string;
}

export interface PaymentGateway {
  name: string;
  createPixPayment(request: PaymentRequest): Promise<PaymentResponse>;
}
