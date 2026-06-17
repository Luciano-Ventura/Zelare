import { Page, expect } from '@playwright/test';
import { TEST_DATA } from './test-data';

export async function solicitarCuidado(page: Page) {
  await page.goto('/');
  await page.getByTestId('cta-solicitar-cuidado').click();
  
  await expect(page).toHaveURL(/.*solicitar-cuidado/);
  
  await page.getByTestId('familia-nome').fill(TEST_DATA.familia.nome);
  await page.getByTestId('familia-whatsapp').fill(TEST_DATA.familia.whatsapp);
  await page.getByTestId('familia-cep').fill(TEST_DATA.familia.cep);
  
  // Aguarda o Viacep preencher o endereço
  await expect(page.locator('#endereco')).not.toBeEmpty({ timeout: 15000 });
  
  // Preencher campos obrigatórios faltantes
  await page.getByLabel('Número').fill('123');
  await page.getByLabel('Para quem é o cuidado?').fill('Mãe 80 anos');
  await page.getByLabel('Tipo de profissional desejado').selectOption('Cuidador de Idosos');
  await page.getByLabel('Data de início').fill('2024-12-01');
  await page.getByLabel('Horário de Início').fill('08:00');
  await page.getByLabel('Horário de Término').fill('18:00');
  await page.getByLabel('Frequência da demanda').fill('Segunda a Sexta');
  
  // Checkboxes obrigatórios
  await page.getByLabel(/Concordo em receber mensagens/).check();
  await page.getByLabel(/Li e aceito os/).check();
  
  await page.getByTestId('familia-enviar').click();
  
  // Verifica se a tela de sucesso ou agradecimento apareceu
  await expect(page.getByRole('heading', { name: /recebida/i })).toBeVisible({ timeout: 10000 });
}
