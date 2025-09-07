-- Habilitar o Supabase Realtime para as tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE militares;
ALTER PUBLICATION supabase_realtime ADD TABLE setores;
ALTER PUBLICATION supabase_realtime ADD TABLE om;

-- Configurar o Supabase Storage para armazenamento de imagens
INSERT INTO storage.buckets (id, name, public)
VALUES ('fotos', 'Fotos de perfil dos militares', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('distintivos', 'Distintivos de setores e OM', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de acesso para o Storage
-- Permitir que todos visualizem as imagens públicas
CREATE POLICY "Imagens de perfil são públicas"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'fotos');

CREATE POLICY "Distintivos são públicos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'distintivos');

-- Permitir que militares façam upload de suas próprias fotos
CREATE POLICY "Militares podem fazer upload de suas fotos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'fotos' AND
    auth.uid() IN (
      SELECT id FROM auth.users WHERE militar_id::text = (storage.foldername(name))[1]
    )
  );

-- Permitir que militares atualizem suas próprias fotos
CREATE POLICY "Militares podem atualizar suas fotos"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'fotos' AND
    auth.uid() IN (
      SELECT id FROM auth.users WHERE militar_id::text = (storage.foldername(name))[1]
    )
  );

-- Permitir que administradores gerenciem todos os arquivos
CREATE POLICY "Administradores podem gerenciar todos os arquivos"
  ON storage.objects
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE perfil = 'admin'
    )
  );