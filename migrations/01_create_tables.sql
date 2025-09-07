-- Habilitar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de setores
CREATE TABLE IF NOT EXISTS setores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  setor_pai_id UUID REFERENCES setores(id),
  distintivo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de organizações militares
CREATE TABLE IF NOT EXISTS om (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  distintivo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de militares
CREATE TABLE IF NOT EXISTS militares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome_completo TEXT NOT NULL,
  nome_guerra TEXT NOT NULL,
  posto_grad TEXT NOT NULL,
  funcao TEXT NOT NULL,
  setor_id UUID NOT NULL REFERENCES setores(id),
  superior_id UUID REFERENCES militares(id),
  foto_url TEXT,
  endereco TEXT,
  telefone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_setores_updated_at
BEFORE UPDATE ON setores
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_om_updated_at
BEFORE UPDATE ON om
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_militares_updated_at
BEFORE UPDATE ON militares
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();