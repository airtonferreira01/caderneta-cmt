-- Migração para criar a tabela perfis_usuarios e atualizar as políticas de segurança

-- Criar tabela de perfis de usuários
CREATE TABLE IF NOT EXISTS public.perfis_usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  posto TEXT,
  militar_id UUID REFERENCES public.militares(id),
  perfil public.perfil_usuario DEFAULT 'militar',
  om_id UUID REFERENCES public.om(id),
  setor_id UUID REFERENCES public.setores(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualização automática do campo updated_at
CREATE TRIGGER set_timestamp_perfis_usuarios
BEFORE UPDATE ON public.perfis_usuarios
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Habilitar RLS na tabela
ALTER TABLE public.perfis_usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para perfis_usuarios

-- Usuários podem ver seus próprios perfis
CREATE POLICY "Usuários podem ver seus próprios perfis"
  ON public.perfis_usuarios
  FOR SELECT
  USING (auth.uid() = id);

-- Usuários podem editar seus próprios perfis
CREATE POLICY "Usuários podem editar seus próprios perfis"
  ON public.perfis_usuarios
  FOR UPDATE
  USING (auth.uid() = id);

-- Administradores podem gerenciar todos os perfis
CREATE POLICY "Administradores podem gerenciar todos os perfis"
  ON public.perfis_usuarios
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.perfis_usuarios WHERE perfil = 'admin'
    )
  );

-- Atualizar políticas de segurança para militares

-- Remover políticas antigas que referenciam auth.users
DROP POLICY IF EXISTS "Militares podem ver seus próprios dados" ON militares;
DROP POLICY IF EXISTS "Militares podem editar seus próprios dados" ON militares;
DROP POLICY IF EXISTS "Comandantes podem ver dados de subordinados diretos" ON militares;
DROP POLICY IF EXISTS "Comandantes podem editar dados de subordinados diretos" ON militares;
DROP POLICY IF EXISTS "Administradores têm acesso total aos militares" ON militares;

-- Criar novas políticas que referenciam perfis_usuarios
CREATE POLICY "Militares podem ver seus próprios dados"
  ON militares
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.perfis_usuarios WHERE militar_id = militares.id
    )
  );

CREATE POLICY "Militares podem editar seus próprios dados"
  ON militares
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.perfis_usuarios WHERE militar_id = militares.id
    )
  );

CREATE POLICY "Comandantes podem ver dados de subordinados diretos"
  ON militares
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT p.id FROM public.perfis_usuarios p
      JOIN militares m ON p.militar_id = m.id
      WHERE militares.superior_id = m.id
    )
  );

CREATE POLICY "Comandantes podem editar dados de subordinados diretos"
  ON militares
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT p.id FROM public.perfis_usuarios p
      JOIN militares m ON p.militar_id = m.id
      WHERE militares.superior_id = m.id
    )
  );

CREATE POLICY "Administradores têm acesso total aos militares"
  ON militares
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.perfis_usuarios WHERE perfil = 'admin'
    )
  );

-- Atualizar políticas para setores
DROP POLICY IF EXISTS "Apenas administradores podem modificar setores" ON setores;

CREATE POLICY "Apenas administradores podem modificar setores"
  ON setores
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.perfis_usuarios WHERE perfil = 'admin'
    )
  );

-- Atualizar políticas para OM
DROP POLICY IF EXISTS "Apenas administradores podem modificar OM" ON om;

CREATE POLICY "Apenas administradores podem modificar OM"
  ON om
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.perfis_usuarios WHERE perfil = 'admin'
    )
  );

-- Atualizar políticas para storage
DROP POLICY IF EXISTS "Administradores podem gerenciar todos os arquivos" ON storage.objects;

CREATE POLICY "Administradores podem gerenciar todos os arquivos"
  ON storage.objects
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.perfis_usuarios WHERE perfil = 'admin'
    )
  );

-- Adicionar tabela ao Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.perfis_usuarios;

-- Migrar dados existentes (se houver)
INSERT INTO public.perfis_usuarios (id, nome, posto, militar_id, perfil)
SELECT 
  u.id, 
  COALESCE(m.nome_completo, u.email), 
  m.posto_grad, 
  u.militar_id, 
  u.perfil
FROM auth.users u
LEFT JOIN militares m ON u.militar_id = m.id
WHERE NOT EXISTS (SELECT 1 FROM public.perfis_usuarios p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;