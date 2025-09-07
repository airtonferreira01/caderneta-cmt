-- Criar função para executar SQL dinâmico
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar tabela para controle de versão do banco de dados
CREATE TABLE IF NOT EXISTS public.db_version (
  id SERIAL PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  description TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_version UNIQUE (version)
);