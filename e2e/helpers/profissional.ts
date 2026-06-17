import { Page, expect } from '@playwright/test';
import { TEST_DATA } from './test-data';

export async function cadastrarProfissional(page: Page) {
  await page.goto('/');
  await page.getByTestId('cta-cadastrar-profissional').click();
  
  await expect(page).toHaveURL(/.*cadastro-profissional/);
  
  await page.getByTestId('profissional-nome').fill(TEST_DATA.profissional.nome);
  await page.getByTestId('profissional-whatsapp').fill(TEST_DATA.profissional.whatsapp);
  await page.getByTestId('profissional-cep').fill(TEST_DATA.profissional.cep);
  
  // Aguarda o Viacep preencher o endereço base
  await expect(page.locator('#endereco_base')).not.toBeEmpty({ timeout: 15000 });
  
  // Preencher campos obrigatórios faltantes
  await page.getByLabel('Número', { exact: true }).fill('123');
  await page.getByLabel('Qual a sua formação/categoria principal?').selectOption('Cuidador de Idosos');
  await page.getByLabel('Tipos de atendimento que você aceita fazer').fill('Idosos');
  await page.getByLabel('Tempo de experiência').fill('3 anos');
  await page.getByLabel('Sua disponibilidade de horários').fill('Segunda a Sexta');
  await page.getByLabel('Em quais regiões/cidades você tem disponibilidade para ir?').fill('Florianópolis');

  // Checkboxes obrigatórios
  await page.getByLabel(/Declaro que todas as informações/).check();
  await page.getByLabel(/Concordo em receber mensagens/).check();
  await page.getByLabel(/Li e aceito os/).check();
  
  await page.getByTestId('profissional-enviar').click();
  
  // Verifica se redirecionou para sucesso
  await expect(page.getByRole('heading', { name: /recebido/i })).toBeVisible({ timeout: 10000 });
}

export async function aceitarConvite(page: Page, tokenOTP: string) {
  // Login profissional
  await page.goto('/profissional/login');
  await page.getByTestId('profissional-login-whatsapp').fill(TEST_DATA.profissional.whatsapp);
  await page.getByTestId('profissional-login-token').fill(tokenOTP);
  await page.getByTestId('profissional-login-submit').click();

  // Dashboard profissional
  await expect(page).toHaveURL(/.*profissional/);
  
  // Entra nos convites
  await page.getByTestId('convites-lista').click();
  
  // Clica no primeiro convite com status 'Enviada'
  await page.locator('a').filter({ hasText: 'Enviada' }).first().click();
  
  // Aceita o convite
  await page.getByTestId('aceitar-convite').click();
  
  // Verifica mudança de estado ou aviso de sucesso
  // Após aceitar, o botão muda ou a página informa que aceitou.
  await expect(page.locator('text=Aceita').or(page.locator('text=já respondeu'))).toBeVisible({ timeout: 5000 });
}
