# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Zelare - Fluxo End-to-End >> Deve completar o fluxo principal: Família -> Profissional -> Admin -> Aceite
- Location: e2e\e2e.spec.ts:10:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('familia-nome')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - button "Open Next.js Dev Tools" [ref=e7] [cursor=pointer]:
    - img [ref=e8]
  - alert [ref=e11]
  - generic [ref=e13]:
    - link "Voltar para a página inicial" [ref=e14] [cursor=pointer]:
      - /url: /
      - img [ref=e15]
      - text: Voltar para a página inicial
    - generic [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e19]:
          - heading "Solicitar cuidado" [level=1] [ref=e20]
          - paragraph [ref=e21]: Etapa 1 de 6
        - link "Já solicitou? Acompanhe aqui" [ref=e24] [cursor=pointer]:
          - /url: /acompanhar
      - generic [ref=e25]:
        - generic [ref=e26]:
          - heading "Quem precisa de cuidado?" [level=2] [ref=e27]
          - generic [ref=e28]:
            - generic [ref=e29] [cursor=pointer]:
              - radio "Idoso" [ref=e30]
              - text: Idoso
            - generic [ref=e31] [cursor=pointer]:
              - radio "Criança" [ref=e32]
              - text: Criança
            - generic [ref=e33] [cursor=pointer]:
              - radio "Pessoa acamada" [ref=e34]
              - text: Pessoa acamada
            - generic [ref=e35] [cursor=pointer]:
              - radio "Pós-cirúrgico" [ref=e36]
              - text: Pós-cirúrgico
            - generic [ref=e37] [cursor=pointer]:
              - radio "Pessoa com Alzheimer, Parkinson ou demência" [ref=e38]
              - text: Pessoa com Alzheimer, Parkinson ou demência
            - generic [ref=e39] [cursor=pointer]:
              - radio "Outro" [ref=e40]
              - text: Outro
          - generic [ref=e41]:
            - generic [ref=e42]: Conte rapidamente a situação (Opcional)
            - textbox "Conte rapidamente a situação (Opcional)" [ref=e43]:
              - /placeholder: "Ex: Precisa de ajuda para banho, alimentação e companhia."
        - button "Próxima etapa" [ref=e45]:
          - text: Próxima etapa
          - img [ref=e46]
```

# Test source

```ts
  1  | import { Page, expect } from '@playwright/test';
  2  | import { TEST_DATA } from './test-data';
  3  | 
  4  | export async function solicitarCuidado(page: Page) {
  5  |   await page.goto('/');
  6  |   await page.getByTestId('cta-solicitar-cuidado').click();
  7  |   
  8  |   await expect(page).toHaveURL(/.*solicitar-cuidado/);
  9  |   
> 10 |   await page.getByTestId('familia-nome').fill(TEST_DATA.familia.nome);
     |                                          ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  11 |   await page.getByTestId('familia-whatsapp').fill(TEST_DATA.familia.whatsapp);
  12 |   await page.getByTestId('familia-cep').fill(TEST_DATA.familia.cep);
  13 |   
  14 |   // Aguarda o Viacep preencher o endereço
  15 |   await expect(page.locator('#endereco')).not.toBeEmpty({ timeout: 15000 });
  16 |   
  17 |   // Preencher campos obrigatórios faltantes
  18 |   await page.getByLabel('Número').fill('123');
  19 |   await page.getByLabel('Para quem é o cuidado?').fill('Mãe 80 anos');
  20 |   await page.getByLabel('Tipo de profissional desejado').selectOption('Cuidador de Idosos');
  21 |   await page.getByLabel('Data de início').fill('2024-12-01');
  22 |   await page.getByLabel('Horário de Início').fill('08:00');
  23 |   await page.getByLabel('Horário de Término').fill('18:00');
  24 |   await page.getByLabel('Frequência da demanda').fill('Segunda a Sexta');
  25 |   
  26 |   // Checkboxes obrigatórios
  27 |   await page.getByLabel(/Concordo em receber mensagens/).check();
  28 |   await page.getByLabel(/Li e aceito os/).check();
  29 |   
  30 |   await page.getByTestId('familia-enviar').click();
  31 |   
  32 |   // Verifica se a tela de sucesso ou agradecimento apareceu
  33 |   await expect(page.getByRole('heading', { name: /recebida/i })).toBeVisible({ timeout: 10000 });
  34 | }
  35 | 
```