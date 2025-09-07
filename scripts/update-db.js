// Script para atualizar automaticamente o banco de dados
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Função para carregar variáveis de ambiente do arquivo .env.local
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const envLines = envContent.split('\n');
      
      envLines.forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          process.env[key] = value;
        }
      });
      
      console.log('Variáveis de ambiente carregadas com sucesso.');
    } else {
      console.warn('Arquivo .env.local não encontrado. Usando variáveis de ambiente do sistema.');
    }
  } catch (error) {
    console.error('Erro ao carregar variáveis de ambiente:', error);
  }
}

// Função principal
async function main() {
  try {
    // Carregar variáveis de ambiente
    loadEnv();
    
    console.log('Iniciando atualização do banco de dados...');
    
    // Verificar a versão atual do banco de dados
    console.log('\n=== Verificando versão atual do banco de dados ===');
    execSync('node scripts/check-db-version.js', { stdio: 'inherit' });
    
    // Executar migrações
    console.log('\n=== Executando migrações ===');
    execSync('node scripts/migrate.js', { stdio: 'inherit' });
    
    console.log('\n=== Processo de atualização concluído ===');
  } catch (error) {
    console.error('Erro durante o processo de atualização:', error);
    process.exit(1);
  }
}

// Executar função principal
main();