import { Page, expect } from '@playwright/test';
import { TEST_DATA } from './test-data';

export async function adminLogin(page: Page) {
  await page.goto('/admin/login');
  await page.getByTestId('admin-email').fill(TEST_DATA.admin.email);
  await page.getByTestId('admin-password').fill(TEST_DATA.admin.password);
  await page.getByTestId('admin-login-submit').click();
  
  // Aguarda carregar o Dashboard para garantir que o login concluiu
  await expect(page.getByRole('heading', { name: 'Visão Operacional' })).toBeVisible({ timeout: 15000 });
}

export async function gerenciarProfissional(page: Page) {
  await page.getByTestId('profissionais-lista').click();
  
  // Encontra o profissional teste e clica em Detalhes
  await page.getByRole('row', { name: TEST_DATA.profissional.nome }).getByRole('link', { name: 'Detalhes' }).first().click();
  
  // Aguarda a página de detalhes carregar
  await expect(page.getByRole('heading', { name: 'Detalhes do Profissional' })).toBeVisible({ timeout: 10000 });
  
  // Preenche checklist de validação
  const checklistItems = [
    'Documento de Identidade válido',
    'Comprovante de Residência',
    'Certificado / Diploma (se aplicável)',
    'Entrevista online realizada',
    'Referências checadas'
  ];
  for (const item of checklistItems) {
    const btn = page.getByRole('button', { name: item });
    if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(500); // Aguarda estado
    }
  }

  // Aprova o profissional através do Gerenciador de Status (procurando o combobox dentro do form de status)
  await page.locator('div').filter({ hasText: 'Gerenciar Status' }).getByRole('combobox').selectOption('Validado');
  const btnAtualizarStatus = page.getByRole('button', { name: 'Atualizar Status' });
  await btnAtualizarStatus.click();
  
  // Aguarda o botão voltar ao estado desabilitado (o que indica que a revalidação da página concluiu com o novo status)
  await expect(btnAtualizarStatus).toBeDisabled({ timeout: 10000 });
}

export async function enviarConviteParaSolicitacao(page: Page) {
  await page.getByTestId('solicitacoes-lista').click();
  
  // Encontra a solicitação teste e clica em Detalhes
  await page.getByRole('row', { name: TEST_DATA.familia.nome }).getByRole('link', { name: 'Detalhes' }).first().click();
  
  // Aguarda a página de detalhes carregar
  await expect(page.getByRole('heading', { name: 'Detalhes da Solicitação' })).toBeVisible({ timeout: 10000 });
  
  // Envia o convite APENAS para o profissional de teste E2E
  // Utilizamos o testid do card específico para não dar match no container principal
  const card = page.getByTestId('card-profissional-compativel').filter({ 
    has: page.getByRole('link', { name: TEST_DATA.profissional.nome, exact: true })
  }).first();
  
  await card.getByRole('button', { name: 'Convidar' }).click();
  
  // Aguarda o botão mudar para o status de 'Enviada'
  await expect(card.locator('text=Enviada')).toBeVisible({ timeout: 10000 });
}
