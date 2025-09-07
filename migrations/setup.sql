-- Script para configuração inicial do banco de dados
-- Execute este script diretamente no console SQL do Supabase

-- Habilitar a extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabelas

-- Tabela de setores
CREATE TABLE IF NOT EXISTS public.setores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  sigla VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de organizações militares
CREATE TABLE IF NOT EXISTS public.om (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  sigla VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de militares
CREATE TABLE IF NOT EXISTS public.militares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(100) NOT NULL,
  posto_grad VARCHAR(50) NOT NULL,
  nome_guerra VARCHAR(50) NOT NULL,
  funcao VARCHAR(100),
  email VARCHAR(100),
  telefone VARCHAR(20),
  data_nascimento DATE,
  data_praca DATE,
  setor_id UUID REFERENCES public.setores(id),
  om_id UUID REFERENCES public.om(id),
  superior_id UUID REFERENCES public.militares(id),
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Triggers para atualização automática do campo updated_at

-- Trigger para setores
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_setores
BEFORE UPDATE ON public.setores
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Trigger para om
CREATE TRIGGER set_timestamp_om
BEFORE UPDATE ON public.om
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Trigger para militares
CREATE TRIGGER set_timestamp_militares
BEFORE UPDATE ON public.militares
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Configuração de segurança (RLS)

-- Habilitar RLS nas tabelas
ALTER TABLE public.militares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.setores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.om ENABLE ROW LEVEL SECURITY;

-- Criar enum para perfil de usuário
CREATE TYPE public.perfil_usuario AS ENUM ('militar', 'comandante', 'admin');

-- Adicionar coluna de perfil e militar_id na tabela de usuários
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS perfil public.perfil_usuario DEFAULT 'militar';
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS militar_id UUID REFERENCES public.militares(id);

-- Políticas de segurança para militares

-- Todos podem visualizar militares
CREATE POLICY "Todos podem visualizar militares"
  ON public.militares
  FOR SELECT
  USING (true);

-- Militares podem atualizar seus próprios dados
CREATE POLICY "Militares podem atualizar seus próprios dados"
  ON public.militares
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE militar_id = militares.id
    )
  );

-- Comandantes podem atualizar militares de seu setor
CREATE POLICY "Comandantes podem atualizar militares de seu setor"
  ON public.militares
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT u.id FROM auth.users u
      JOIN public.militares m ON u.militar_id = m.id
      WHERE u.perfil = 'comandante' AND m.setor_id = militares.setor_id
    )
  );

-- Administradores podem fazer tudo
CREATE POLICY "Administradores podem gerenciar militares"
  ON public.militares
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE perfil = 'admin'
    )
  );

-- Políticas de segurança para setores

-- Todos podem visualizar setores
CREATE POLICY "Todos podem visualizar setores"
  ON public.setores
  FOR SELECT
  USING (true);

-- Administradores podem gerenciar setores
CREATE POLICY "Administradores podem gerenciar setores"
  ON public.setores
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE perfil = 'admin'
    )
  );

-- Políticas de segurança para om

-- Todos podem visualizar om
CREATE POLICY "Todos podem visualizar om"
  ON public.om
  FOR SELECT
  USING (true);

-- Administradores podem gerenciar om
CREATE POLICY "Administradores podem gerenciar om"
  ON public.om
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE perfil = 'admin'
    )
  );

-- Configuração do Realtime

-- Habilitar Realtime para as tabelas
BEGIN;
  INSERT INTO supabase_realtime.schema_migrations(version) VALUES (20221215000000);
COMMIT;

ALTER PUBLICATION supabase_realtime ADD TABLE public.militares;
ALTER PUBLICATION supabase_realtime ADD TABLE public.setores;
ALTER PUBLICATION supabase_realtime ADD TABLE public.om;

-- Configuração do Storage

-- Criar buckets para armazenamento de fotos
INSERT INTO storage.buckets (id, name, public)
VALUES ('fotos_perfil', 'fotos_perfil', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('insignias', 'insignias', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso para fotos de perfil

-- Todos podem visualizar fotos de perfil
CREATE POLICY "Todos podem visualizar fotos de perfil"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'fotos_perfil'
  );

-- Militares podem fazer upload e atualizar suas próprias fotos
CREATE POLICY "Militares podem fazer upload de suas fotos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'fotos_perfil' AND
    (storage.filename(name))[1] = auth.uid()::text
  );

CREATE POLICY "Militares podem atualizar suas fotos"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'fotos_perfil' AND
    (storage.filename(name))[1] = auth.uid()::text
  );

-- Administradores podem gerenciar todos os arquivos
CREATE POLICY "Administradores podem gerenciar todos os arquivos"
  ON storage.objects
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE perfil = 'admin'
    )
  );

-- Tabela para controle de versão do banco de dados
CREATE TABLE IF NOT EXISTS public.db_version (
  id SERIAL PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  description TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_version UNIQUE (version)
);

-- Inserir versão inicial
INSERT INTO public.db_version (version, description)
VALUES ('1.0.0', 'Configuração inicial do banco de dados')
ON CONFLICT (version) DO NOTHING;