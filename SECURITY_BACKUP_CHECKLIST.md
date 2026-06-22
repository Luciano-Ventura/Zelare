# Checklist de Backup e Recuperação

A Zelare armazena informações críticas: dados de clientes, profissionais, registros médicos básicos, e histórico financeiro.

## Política de Backups Automáticos
* **Onde:** O Supabase gerencia os backups através de sua infraestrutura PostgreSQL.
* **Frequência:** O plano Pro do Supabase inclui backups diários automáticos retidos por 7 a 30 dias (dependendo da configuração).
* **Responsabilidade:** Equipe técnica/CTO.

## Tabelas Críticas
As tabelas a seguir não podem sofrer perda de dados:
1. `familias_solicitacoes`
2. `profissionais_cadastros`
3. `plantoes`
4. `pagamentos`
5. `repasses_profissionais`
6. `audit_logs`

## Rotina Manual Recomendada
Para redundância fora da nuvem do Supabase, recomendamos um dump mensal:
1. Acesse o servidor ou use o Supabase CLI.
2. Extraia um `.sql` da base: `supabase db dump --data-only -f backup_YYYY_MM_DD.sql`
3. Armazene os dumps em um bucket seguro (ex: AWS S3 com versão de objetos) ou drive protegido.

## Procedimento de Recuperação (Restore)
1. **Em caso de deleção acidental de linha:** Utilize a funcionalidade *Point-in-Time Recovery (PITR)* do Supabase (se habilitada no plano), para voltar a base em minutos/horas antes do incidente.
2. **Em caso de catástrofe total:** Restaurar via Painel do Supabase usando o snapshot diário mais recente. 
3. Sempre testar a restauração primeiro em um ambiente de *Staging* antes da base principal de produção.
