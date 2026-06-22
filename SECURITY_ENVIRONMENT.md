# Ambiente e Credenciais - Segurança

Este documento lista as variáveis de ambiente necessárias para o correto funcionamento da Zelare, com foco nas restrições de segurança.

> [!WARNING]
> **O arquivo `.env.local` NUNCA deve ser commitado no repositório Git.** 

## Variáveis Públicas (`NEXT_PUBLIC_`)

Essas variáveis são injetadas no frontend (Browser) e podem ser expostas com segurança.
Elas servem para o cliente interagir com APIs públicas.

* `NEXT_PUBLIC_SUPABASE_URL`: A URL pública do seu projeto no Supabase.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: A chave anônima, com permissões muito restritas graças ao RLS.

## Variáveis Privadas (Somente Servidor)

Essas variáveis NUNCA devem ser enviadas ao frontend. O Next.js garante que variáveis sem `NEXT_PUBLIC_` só existam no servidor.

### Supabase
* `SUPABASE_SERVICE_ROLE_KEY`: **[PERIGO CRÍTICO]** Chave administrativa do Supabase. Ignora qualquer política de Row Level Security (RLS). Deve ser usada apenas no servidor para rotinas administrativas (ex: registrar logs de auditoria).

### AbacatePay
* `ABACATEPAY_API_KEY`: Chave da API do AbacatePay. Permite gerar cobranças e movimentar dinheiro virtualmente.
* `ABACATEPAY_WEBHOOK_SECRET`: Segredo compartilhado (HMAC) usado para validar se o webhook recebido é realmente da AbacatePay e não de um atacante.

## Como Rotacionar Chaves
1. **Supabase**: No painel do Supabase, em Settings > API, você pode gerar novas chaves. Se a `SERVICE_ROLE_KEY` vazar, gere uma nova imediatamente e atualize na Vercel.
2. **AbacatePay**: No painel do AbacatePay, você pode revogar a chave atual e gerar uma nova.

## Configuração na Vercel
Insira todas as variáveis no painel da Vercel (`Settings > Environment Variables`). Use o ambiente `Production` e `Preview` adequadamente.
