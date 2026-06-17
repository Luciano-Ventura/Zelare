import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Carrega o .env.e2e
config({ path: '.env.e2e' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
  console.log('Iniciando limpeza de dados E2E...');

  try {
    // 1. Busca Profissionais E2E
    const { data: profs } = await supabase
      .from('profissionais_cadastros')
      .select('id')
      .like('nome_completo', 'E2E%');

    // 2. Busca Familias E2E
    const { data: fams } = await supabase
      .from('familias_solicitacoes')
      .select('id')
      .like('nome_completo', 'E2E%');

    const profIds = profs?.map(p => p.id) || [];
    const famIds = fams?.map(f => f.id) || [];

    console.log(`Encontrados ${profIds.length} profissionais e ${famIds.length} solicitações para limpar.`);

    if (profIds.length > 0 || famIds.length > 0) {
      // Como pode não ter CASCADE, apagamos oportunidades e plantões primeiro
      
      if (famIds.length > 0) {
        await supabase.from('oportunidades_profissionais').delete().in('solicitacao_id', famIds);
        await supabase.from('plantoes').delete().in('solicitacao_id', famIds);
        await supabase.from('ocorrencias').delete().in('solicitacao_id', famIds);
        await supabase.from('familias_solicitacoes').delete().in('id', famIds);
      }

      if (profIds.length > 0) {
         // Oportunidades e plantões já devem ter ido se for relacionado à família E2E,
         // mas se for um prof E2E numa família real, limpamos tb:
         await supabase.from('oportunidades_profissionais').delete().in('profissional_id', profIds);
         await supabase.from('plantoes').delete().in('profissional_id', profIds);
         await supabase.from('ocorrencias').delete().in('profissional_id', profIds);
         await supabase.from('profissionais_cadastros').delete().in('id', profIds);
      }

      console.log('Limpeza concluída com sucesso!');
    } else {
      console.log('Nenhum dado E2E encontrado para limpar.');
    }
  } catch (error) {
    console.error('Erro durante a limpeza:', error);
  }
}

cleanup();
