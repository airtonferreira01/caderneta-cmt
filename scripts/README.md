# Scripts de Migração e Atualização do Banco de Dados

Este diretório contém scripts para gerenciar as migrações e atualizações do banco de dados Supabase.

## Arquivos

- `check-db-version.js`: Verifica a versão atual do banco de dados.
- `migrate.js`: Executa as migrações SQL do diretório `/migrations`.
- `update-db.js`: Script principal que verifica a versão e executa as migrações necessárias.

## Como usar

### Configuração

Certifique-se de que o arquivo `.env.local` na raiz do projeto contém as credenciais corretas do Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

### Comandos disponíveis

Os seguintes comandos estão disponíveis no `package.json`:

```bash
# Verificar a versão atual do banco de dados
npm run db:check

# Executar migrações manualmente
npm run db:migrate

# Atualizar o banco de dados (verificar versão + migrar)
npm run db:update
```

### Fluxo de trabalho recomendado

1. Ao iniciar o projeto pela primeira vez, execute `npm run db:update` para criar todas as tabelas e configurações iniciais.

2. Para atualizar o banco de dados após alterações nos arquivos de migração, execute novamente `npm run db:update`.

3. Para verificar a versão atual do banco de dados sem executar migrações, use `npm run db:check`.

## Criando novas migrações

Para criar uma nova migração:

1. Crie um novo arquivo SQL no diretório `/migrations` com um prefixo numérico para garantir a ordem correta (ex: `04_add_new_table.sql`).

2. Atualize a constante `CURRENT_VERSION` no arquivo `migrate.js` para refletir a nova versão.

3. Execute `npm run db:update` para aplicar a nova migração.

## Solução de problemas

Se encontrar erros durante a migração:

1. Verifique se as credenciais do Supabase estão corretas no arquivo `.env.local`.

2. Certifique-se de que o banco de dados Supabase está acessível e funcionando corretamente.

3. Verifique a sintaxe SQL nos arquivos de migração.

4. Consulte os logs de erro para identificar problemas específicos.