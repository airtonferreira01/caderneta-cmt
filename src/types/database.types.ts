export type Militar = {
  id: string;
  nome: string;
  nome_completo?: string;
  nome_guerra: string;
  posto: string;
  posto_grad?: string;
  funcao: string;
  setor_id: string;
  superior_id: string | null;
  foto_url: string | null;
  endereco: string | null;
  telefone: string | null;
  email: string | null;
  created_at?: string;
  updated_at?: string;
  setores?: Array<{ nome: string }>;
};

export type Setor = {
  id: string;
  nome: string;
  setor_pai_id: string | null;
  distintivo_url: string | null;
  created_at?: string;
  updated_at?: string;
};

export type OM = {
  id: string;
  nome: string;
  tipo: string;
  distintivo_url: string | null;
  created_at?: string;
  updated_at?: string;
};

export type Database = {
  militares: Militar;
  setores: Setor;
  om: OM;
};