import { PaymentGateway } from "./types";
import { AbacatePayGateway } from "./abacatepay";

// Aqui podemos usar um Switch com variável de ambiente se tivermos múltiplos gateways no futuro
export function getPaymentGateway(): PaymentGateway {
  return new AbacatePayGateway();
}
