import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.e2e') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "");

async function run() {
  const { data, error } = await supabase
    .from('oportunidades_profissionais')
    .select('*, profissionais_cadastros(nome_completo, whatsapp, status, created_at), familias_solicitacoes(id)')
    .order('created_at', { ascending: false })
    .limit(10);
  
  if (error) console.error(error);
  console.dir(data, { depth: null });
}

run();
