-- Habilitar Row Level Security (RLS) nas tabelas
ALTER TABLE militares ENABLE ROW LEVEL SECURITY;
ALTER TABLE setores ENABLE ROW LEVEL SECURITY;
ALTER TABLE om ENABLE ROW LEVEL SECURITY;

-- Criar perfis para diferentes níveis de acesso
CREATE TYPE perfil_usuario AS ENUM ('militar', 'comandante', 'admin');

-- Adicionar coluna de perfil na tabela de autenticação
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS perfil perfil_usuario DEFAULT 'militar';
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS militar_id UUID REFERENCES public.militares(id);

-- Política para militares visualizarem seus próprios dados
CREATE POLICY "Militares podem ver seus próprios dados"
  ON militares
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE militar_id = militares.id
    )
  );

-- Política para militares editarem seus próprios dados
CREATE POLICY "Militares podem editar seus próprios dados"
  ON militares
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE militar_id = militares.id
    )
  );

-- Política para comandantes verem dados de subordinados diretos
CREATE POLICY "Comandantes podem ver dados de subordinados diretos"
  ON militares
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT u.id FROM auth.users u
      JOIN militares m ON u.militar_id = m.id
      WHERE militares.superior_id = m.id
    )
  );

-- Política para comandantes editarem dados de subordinados diretos
CREATE POLICY "Comandantes podem editar dados de subordinados diretos"
  ON militares
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT u.id FROM auth.users u
      JOIN militares m ON u.militar_id = m.id
      WHERE militares.superior_id = m.id
    )
  );

-- Política para administradores (Cmt, Scmt, S1) terem acesso total
CREATE POLICY "Administradores têm acesso total aos militares"
  ON militares
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE perfil = 'admin'
    )
  );

-- Políticas para setores
CREATE POLICY "Todos podem visualizar setores"
  ON setores
  FOR SELECT
  USING (true);

CREATE POLICY "Apenas administradores podem modificar setores"
  ON setores
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE perfil = 'admin'
    )
  );

-- Políticas para OM
CREATE POLICY "Todos podem visualizar OM"
  ON om
  FOR SELECT
  USING (true);

CREATE POLICY "Apenas administradores podem modificar OM"
  ON om
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE perfil = 'admin'
    )
  );