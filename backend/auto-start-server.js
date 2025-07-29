import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 SUNUCU OTOMATİK BAŞLATILIYOR...');
console.log('=====================================');

// Sunucu process'ini başlat
function startServer() {
    console.log('📡 Sunucu başlatılıyor...');
    
    const serverProcess = spawn('node', ['index.js'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });

    serverProcess.on('error', (error) => {
        console.error('❌ Sunucu başlatılırken hata:', error);
    });

    serverProcess.on('close', (code) => {
        console.log(`⚠️ Sunucu kapandı (kod: ${code})`);
        console.log('🔄 3 saniye sonra yeniden başlatılıyor...');
        
        setTimeout(() => {
            startServer();
        }, 3000);
    });

    return serverProcess;
}

// Sunucuyu başlat
const server = startServer();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Sunucu kapatılıyor...');
    server.kill('SIGINT');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Sunucu kapatılıyor...');
    server.kill('SIGTERM');
    process.exit(0);
}); 