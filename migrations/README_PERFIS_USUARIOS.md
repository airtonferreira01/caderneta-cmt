# Implementação da Tabela Perfis Usuários

## Problema Resolvido

O erro `ERROR: 42501: must be owner of table users` ocorria porque o script tentava modificar diretamente a tabela `auth.users` sem ter as permissões necessárias. Esta tabela pertence ao esquema `auth` gerenciado pelo Supabase e tem restrições de acesso.

## Solução Implementada

Em vez de modificar diretamente a tabela `auth.users`, criamos uma tabela separada `public.perfis_usuarios` que se relaciona com `auth.users` através do ID do usuário. Esta abordagem mantém a separação de responsabilidades e evita problemas de permissão.

## Arquivos Criados/Modificados

1. **setup_modificado.sql**: Versão atualizada do script de configuração inicial que usa a nova abordagem.

2. **04_criar_perfis_usuarios.sql**: Migração específica para criar a tabela `perfis_usuarios` e atualizar as políticas de segurança.

## Como Implementar

### Opção 1: Configuração Inicial (para novos projetos)

Se você está configurando o banco de dados pela primeira vez:

1. Execute o script `setup_modificado.sql` diretamente no console SQL do Supabase.

### Opção 2: Migração (para projetos existentes)

Se você já tem um banco de dados configurado:

1. Execute o script `04_criar_perfis_usuarios.sql` para criar a nova tabela e atualizar as políticas.

2. Verifique se os dados foram migrados corretamente da tabela `auth.users` para `public.perfis_usuarios`.

## Mudanças no Código da Aplicação

Você precisará atualizar seu código para usar a nova tabela `perfis_usuarios` em vez de acessar diretamente os campos personalizados em `auth.users`:

### Antes:

```typescript
// Obter perfil do usuário atual
const { data: userData } = await supabase.auth.getUser();
const userId = userData.user?.id;

// Obter dados adicionais do usuário
const { data: userProfile } = await supabase
  .from('users')
  .select('perfil, militar_id')
  .eq('id', userId)
  .single();
```

### Depois:

```typescript
// Obter perfil do usuário atual
const { data: userData } = await supabase.auth.getUser();
const userId = userData.user?.id;

// Obter dados adicionais do usuário
const { data: userProfile } = await supabase
  .from('perfis_usuarios')
  .select('perfil, militar_id, nome, posto')
  .eq('id', userId)
  .single();
```

## Benefícios da Nova Abordagem

1. **Evita problemas de permissão**: Não tenta modificar tabelas do sistema Supabase.

2. **Melhor separação de responsabilidades**: Mantém os dados de autenticação separados dos dados de perfil.

3. **Mais flexibilidade**: Permite adicionar campos personalizados sem modificar tabelas do sistema.

4. **Segurança melhorada**: Usa políticas RLS específicas para a tabela de perfis.

## Notas Importantes

- Ao registrar novos usuários, você precisará criar um registro correspondente na tabela `perfis_usuarios`.
- As políticas RLS foram atualizadas para usar a nova tabela `perfis_usuarios` em vez de `auth.users`.
- A migração de dados existentes é feita automaticamente pelo script `04_criar_perfis_usuarios.sql`.