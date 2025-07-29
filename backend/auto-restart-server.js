const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Otomatik Sunucu Başlatıcı Başlatıldı...');

function startServer() {
    console.log('📡 Sunucu başlatılıyor...');
    
    const server = spawn('node', ['index.js'], {
        cwd: __dirname,
        stdio: 'inherit',
        shell: true
    });
    
    server.on('close', (code) => {
        console.log(`❌ Sunucu kapandı (kod: ${code})`);
        console.log('🔄 3 saniye sonra yeniden başlatılıyor...');
        
        setTimeout(() => {
            startServer();
        }, 3000);
    });
    
    server.on('error', (error) => {
        console.error('❌ Sunucu hatası:', error);
        console.log('🔄 3 saniye sonra yeniden başlatılıyor...');
        
        setTimeout(() => {
            startServer();
        }, 3000);
    });
    
    // İlk başlatma
    console.log('✅ Sunucu başlatıldı!');
}

// Sunucuyu başlat
startServer();

// Ctrl+C ile durdurma
process.on('SIGINT', () => {
    console.log('\n🛑 Otomatik başlatıcı durduruluyor...');
    process.exit(0);
}); 