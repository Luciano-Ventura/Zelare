import { createClient } from '@supabase/supabase-js';

// Usado EXCLUSIVAMENTE em Server Actions ou API Routes.
// O RLS impede leituras/escritas anônimas. Precisamos do service_role_key para contornar o RLS e inserir os dados.
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase credentials not found. Forms will not save data.");
    // Criamos um client "dummy" caso não tenha credencial, para não quebrar o build do Next.js
    return createClient("https://dummy.supabase.co", "dummy_key");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      fetch: (url, options) => {
        return fetch(url, { ...options, cache: 'no-store' });
      }
    }
  });
};

export const supabaseAdmin = createAdminClient();
