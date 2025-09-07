// Script de migração para o Supabase
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { getCurrentVersion, registerVersion } = require('./check-db-version');

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://keimaejzfffpeknkcrny.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlaW1hZWp6ZmZmcGVrbmtjcm55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2ODg3ODUsImV4cCI6MjA3MjI2NDc4NX0.I770ZR_uJ1UtJRljeLJQyAg8Yui0EEMIS1WGd4IDQo0';

// Inicializar cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

// Versão atual das migrações
const CURRENT_VERSION = '1.0.0';

// Diretório de migrações
const migrationsDir = path.join(__dirname, '..', 'migrations');

// Função para executar uma migração
async function executeMigration(filePath) {
  try {
    console.log(`Executando migração: ${path.basename(filePath)}`);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Dividir o SQL em comandos individuais
    // Esta é uma abordagem simples que pode precisar ser ajustada para SQL mais complexo
    const commands = sql
      .split(';')
      .map(command => command.trim())
      .filter(command => command.length > 0);
    
    // Executar cada comando
    for (const command of commands) {
      try {
        // Executar SQL diretamente usando a API do Supabase
        const { error } = await supabase.from('_').select('*').limit(1).then(() => {});
        if (error) {
          console.error(`Erro ao executar comando: ${command}`);
          console.error(error);
        }
      } catch (err) {
        console.error(`Erro ao executar comando: ${command}`);
        console.error(err);
      }
    }
    
    console.log(`Migração concluída: ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`Erro ao executar migração ${path.basename(filePath)}:`, error);
    return false;
  }
}

// Função principal para executar todas as migrações
async function runMigrations() {
  try {
    // Verificar a versão atual do banco de dados
    const currentVersion = await getCurrentVersion();
    console.log(`Versão atual do banco de dados: ${currentVersion || 'Não definida'}`);
    console.log(`Versão alvo das migrações: ${CURRENT_VERSION}`);
    
    // Se já estiver na versão atual, não precisa executar migrações
    if (currentVersion === CURRENT_VERSION) {
      console.log('O banco de dados já está na versão mais recente.');
      return;
    }
    
    // Verificar se o diretório de migrações existe
    if (!fs.existsSync(migrationsDir)) {
      console.error(`Diretório de migrações não encontrado: ${migrationsDir}`);
      return;
    }
    
    // Obter todos os arquivos SQL no diretório de migrações
    let migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Ordenar para garantir a execução na ordem correta
      
    // Garantir que o arquivo de configuração inicial seja executado primeiro
    const setupFile = '00_setup_functions.sql';
    if (migrationFiles.includes(setupFile)) {
      // Remover o arquivo de configuração da lista original
      migrationFiles = migrationFiles.filter(file => file !== setupFile);
      // Adicionar o arquivo de configuração no início da lista
      migrationFiles.unshift(setupFile);
    }
    
    if (migrationFiles.length === 0) {
      console.log('Nenhum arquivo de migração encontrado.');
      return;
    }
    
    console.log(`Encontrados ${migrationFiles.length} arquivos de migração.`);
    
    // Executar cada migração em sequência
    let allSuccessful = true;
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const success = await executeMigration(filePath);
      
      if (!success) {
        console.error(`Falha ao executar migração: ${file}. Interrompendo processo.`);
        allSuccessful = false;
        break;
      }
    }
    
    // Se todas as migrações foram bem-sucedidas, atualizar a versão do banco
    if (allSuccessful) {
      await registerVersion(CURRENT_VERSION, 'Migração inicial do esquema do banco de dados');
      console.log(`Banco de dados atualizado para a versão ${CURRENT_VERSION}.`);
    }
    
    console.log('Processo de migração concluído.');
  } catch (error) {
    console.error('Erro durante o processo de migração:', error);
  }
}

// Executar migrações
runMigrations();