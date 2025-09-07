// Script para verificar a versão atual do banco de dados
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://keimaejzfffpeknkcrny.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlaW1hZWp6ZmZmcGVrbmtjcm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODg3ODUsImV4cCI6MjA3MjI2NDc4NX0.I770ZR_uJ1UtJRljeLJQyAg8Yui0EEMIS1WGd4IDQo0';

// Inicializar cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Função para verificar se a tabela de versões existe
async function checkVersionTable() {
  try {
    // Verificar se a tabela de versões existe
    const { data, error } = await supabase
      .from('db_version')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') { // Código para tabela não existe
      console.log('Tabela de versões não encontrada. Criando...');
      await createVersionTable();
      return false;
    } else if (error) {
      console.error('Erro ao verificar tabela de versões:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao verificar tabela de versões:', error);
    return false;
  }
}

// Função para criar a tabela de versões
async function createVersionTable() {
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS db_version (
          id SERIAL PRIMARY KEY,
          version TEXT NOT NULL,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          description TEXT
        );
      `
    });
    
    if (error) {
      console.error('Erro ao criar tabela de versões:', error);
      return false;
    }
    
    console.log('Tabela de versões criada com sucesso.');
    return true;
  } catch (error) {
    console.error('Erro ao criar tabela de versões:', error);
    return false;
  }
}

// Função para obter a versão atual do banco de dados
async function getCurrentVersion() {
  try {
    const tableExists = await checkVersionTable();
    
    if (!tableExists) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('db_version')
      .select('version')
      .order('applied_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Erro ao obter versão atual:', error);
      return null;
    }
    
    if (data && data.length > 0) {
      return data[0].version;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Erro ao obter versão atual:', error);
    return null;
  }
}

// Função para registrar uma nova versão
async function registerVersion(version, description) {
  try {
    const { error } = await supabase
      .from('db_version')
      .insert([
        { version, description }
      ]);
    
    if (error) {
      console.error('Erro ao registrar versão:', error);
      return false;
    }
    
    console.log(`Versão ${version} registrada com sucesso.`);
    return true;
  } catch (error) {
    console.error('Erro ao registrar versão:', error);
    return false;
  }
}

// Função principal
async function main() {
  try {
    const currentVersion = await getCurrentVersion();
    
    if (currentVersion) {
      console.log(`Versão atual do banco de dados: ${currentVersion}`);
    } else {
      console.log('Banco de dados não possui versão registrada.');
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Executar função principal
main();

// Exportar funções para uso em outros scripts
module.exports = {
  getCurrentVersion,
  registerVersion
};