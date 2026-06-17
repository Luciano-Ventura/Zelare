import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getProfissionalOTP(whatsapp: string) {
  const cleanWhatsapp = whatsapp.replace(/\D/g, "");
  const { data } = await supabase
    .from('profissionais_cadastros')
    .select('acesso_token')
    .eq('whatsapp', cleanWhatsapp)
    .order('created_at', { ascending: false })
    .limit(1);
  
  return data?.[0]?.acesso_token;
}
