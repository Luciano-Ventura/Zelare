const URL = 'https://cyrsdrgplzicnibcvanq.supabase.co';
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5cnNkcmdwbHppY25pYmN2YW5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTI1OTk4OCwiZXhwIjoyMDk2ODM1OTg4fQ.d1EcLAEPuuWEcgGytI6UTm01kCyr7bzf8rMf9pZEveU';

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(URL, KEY);

(async () => {
  const { data } = await supabase
    .from('profissionais_cadastros')
    .select('id, nome_completo, whatsapp, acesso_token, plantoes(id)')
    .not('acesso_token', 'is', null)
    .order('created_at', { ascending: false });
    
  if (data && data.length > 0) {
    const profsComPlantao = data.filter(p => p.plantoes && p.plantoes.length > 0);
    profsComPlantao.sort((a, b) => b.plantoes.length - a.plantoes.length);
    
    if (profsComPlantao.length > 0) {
      const prof = profsComPlantao[0];
      console.log('--- PROFISSIONAL ENCONTRADO ---');
      console.log('Nome:', prof.nome_completo);
      console.log('WhatsApp (Número):', prof.whatsapp);
      console.log('Token Acesso (OTP):', prof.acesso_token);
      console.log('Plantoes Vinculados:', prof.plantoes.length);
    } else {
      console.log('Nenhum profissional com plantões e token encontrado.');
      console.log('Mas aqui está um sem plantões:', data[0].nome_completo, data[0].whatsapp, data[0].acesso_token);
    }
  } else {
    console.log('Nenhum profissional com token encontrado.');
  }
})();
