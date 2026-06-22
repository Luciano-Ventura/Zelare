# Checklist de Conformidade com a LGPD

A Zelare lida com dados sensíveis, incluindo saúde, localização e informações financeiras, que exigem atenção especial sob a Lei Geral de Proteção de Dados (LGPD).

## Mapeamento de Dados

### Dados Coletados
* **Famílias:** Nome, email, telefone/WhatsApp, endereço completo (com geolocalização), informações de saúde do familiar/paciente.
* **Profissionais:** Nome, CPF, email, WhatsApp, endereço, documentos pessoais (RG/CNH), certificados (Coren/etc), chave Pix, foto.
* **Financeiro:** Valores de pagamentos, taxas, IDs de transação.

### Dados Sensíveis
Pela LGPD, dados de saúde são considerados sensíveis.
* Relatórios no `diario_bordo`.
* Tipos de cuidados exigidos na `solicitacao`.
* Ocorrências.

### Finalidade da Coleta
Os dados são estritamente coletados para viabilizar o serviço de agenciamento de cuidados.
* **Geolocalização:** Mapeamento de profissionais próximos.
* **Saúde:** Compreender a necessidade para a seleção do profissional adequado.
* **Financeiro:** Faturamento e repasse.

## Compartilhamento
* O endereço completo da família é ocultado até o plantão estar efetivado (pago e confirmado).
* O profissional recebe apenas os dados estritamente necessários para chegar ao local e realizar o serviço.
* Os dados de pagamento passam pelo gateway parceiro (AbacatePay) que possui suas próprias políticas de segurança.

## Retenção e Exclusão (Direito ao Esquecimento)
* **Retenção:** Os dados ficam armazenados durante todo o ciclo de vida da conta. Dados financeiros/fiscais têm prazos legais de manutenção de até 5 anos.
* **Exclusão:** Se solicitado pelo titular, remover dados de contato e conta. Manter apenas logs de pagamentos passados exigidos por lei, devidamente anonimizados, se possível.

> [!CAUTION]
> **Aviso Importante:** Esta plataforma passou por um hardening técnico. Porém, antes de uma expansão nacional agressiva, é estritamente necessária a revisão dos Termos de Uso e Política de Privacidade por um consultor jurídico especialista em saúde e LGPD.
