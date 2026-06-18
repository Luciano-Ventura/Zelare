import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Carrega o .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function wipeAll() {
  console.log('Iniciando limpeza total de dados (hard reset)...');

  try {
    // Apaga em ordem para evitar erros de restrição de chave estrangeira (foreign keys)
    console.log('Apagando pagamentos...');
    await supabase.from('pagamentos').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Apagando repasses...');
    await supabase.from('repasses_profissionais').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Apagando observacoes internas...');
    await supabase.from('observacoes_internas').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Apagando ocorrencias...');
    await supabase.from('ocorrencias').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Apagando plantoes...');
    await supabase.from('plantoes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Apagando pacotes...');
    await supabase.from('pacotes_plantoes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Apagando oportunidades_profissionais...');
    await supabase.from('oportunidades_profissionais').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Apagando familias_solicitacoes...');
    await supabase.from('familias_solicitacoes').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Apagando profissionais_cadastros...');
    await supabase.from('profissionais_cadastros').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Apagando log de webhook (se houver)...');
    await supabase.from('webhook_logs').delete().neq('id', '0');

    console.log('Banco de dados completamente zerado com sucesso!');
  } catch (error) {
    console.error('Erro durante a limpeza:', error);
  }
}

wipeAll();
