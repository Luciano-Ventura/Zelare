import { test, expect } from '@playwright/test';
import { solicitarCuidado } from './helpers/familia';
import { cadastrarProfissional, aceitarConvite } from './helpers/profissional';
import { adminLogin, gerenciarProfissional, enviarConviteParaSolicitacao } from './helpers/admin';
import { getProfissionalOTP } from './helpers/db';
import { TEST_DATA } from './helpers/test-data';

test.describe('Zelare - Fluxo End-to-End', () => {

  test('Deve completar o fluxo principal: Família -> Profissional -> Admin -> Aceite', async ({ page }) => {
    // 1. Família solicita cuidado
    await test.step('Família solicita cuidado', async () => {
      await solicitarCuidado(page);
    });

    // 2. Profissional se cadastra
    await test.step('Profissional se cadastra', async () => {
      await cadastrarProfissional(page);
    });

    // 3. Admin aprova profissional e envia convite
    await test.step('Admin gerencia sistema e envia convite', async () => {
      await adminLogin(page);
      
      // Aprova Profissional
      await gerenciarProfissional(page);
      
      // Envia Convite na Solicitação
      await enviarConviteParaSolicitacao(page);
    });

    // 4. Profissional loga e aceita convite
    await test.step('Profissional aceita convite', async () => {
      // Pega OTP no banco
      const otp = await getProfissionalOTP(TEST_DATA.profissional.whatsapp);
      expect(otp).toBeTruthy();
      
      await aceitarConvite(page, otp);
    });
  });

});
