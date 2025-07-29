const fs = require('fs');
const path = require('path');
const os = require('os');

// Masaüstü yolu
const desktopPath = path.join(os.homedir(), 'Desktop');

// Kısayol dosyaları oluştur
function createShortcuts() {
    console.log('CozKazan uygulaması için kısayollar oluşturuluyor...');
    
    // 1. Admin Panel Kısayolu
    const adminShortcut = `@echo off
echo CozKazan Admin Panel aciliyor...
start https://cozkazan-app.web.app/admin-panel.html
echo Admin Panel acildi!
pause`;
    
    fs.writeFileSync(path.join(desktopPath, 'CozKazan-Admin-Panel.bat'), adminShortcut);
    console.log('✅ Admin Panel kısayolu oluşturuldu');
    
    // 2. Flutter Uygulaması Kısayolu
    const flutterShortcut = `@echo off
echo CozKazan Flutter uygulamasi baslatiliyor...
cd /d "${path.resolve('.')}"
flutter run -d chrome --web-port 8080
pause`;
    
    fs.writeFileSync(path.join(desktopPath, 'CozKazan-Flutter-Uygulamasi.bat'), flutterShortcut);
    console.log('✅ Flutter uygulaması kısayolu oluşturuldu');
    
    // 3. Backend Server Kısayolu
    const backendShortcut = `@echo off
echo CozKazan Backend Server baslatiliyor...
cd /d "${path.resolve('./backend')}"
npm start
pause`;
    
    fs.writeFileSync(path.join(desktopPath, 'CozKazan-Backend-Server.bat'), backendShortcut);
    console.log('✅ Backend Server kısayolu oluşturuldu');
    
    // 4. Hızlı Başlat (Tüm Servisler)
    const quickStartShortcut = `@echo off
echo CozKazan Tum Servisler Baslatiliyor...
echo.
echo 1. Backend Server baslatiliyor...
start "Backend Server" cmd /k "cd /d "${path.resolve('./backend')}" && npm start"
timeout /t 3 /nobreak >nul
echo.
echo 2. Flutter uygulamasi baslatiliyor...
start "Flutter App" cmd /k "cd /d "${path.resolve('.')}" && flutter run -d chrome --web-port 8080"
timeout /t 3 /nobreak >nul
echo.
echo 3. Admin Panel aciliyor...
timeout /t 5 /nobreak >nul
start https://cozkazan-app.web.app/admin-panel.html
echo.
echo Tum servisler baslatildi!
echo - Backend Server: http://localhost:3000
echo - Flutter App: http://localhost:8080
echo - Admin Panel: https://cozkazan-app.web.app/admin-panel.html
echo.
pause`;
    
    fs.writeFileSync(path.join(desktopPath, 'CozKazan-Hizli-Baslat.bat'), quickStartShortcut);
    console.log('✅ Hızlı Başlat kısayolu oluşturuldu');
    
    // 5. Test Yönetimi Kısayolu
    const testManagementShortcut = `@echo off
echo CozKazan Test Yonetimi aciliyor...
start https://cozkazan-app.web.app/admin-panel.html#test-yonetimi
echo Test Yonetimi acildi!
pause`;
    
    fs.writeFileSync(path.join(desktopPath, 'CozKazan-Test-Yonetimi.bat'), testManagementShortcut);
    console.log('✅ Test Yönetimi kısayolu oluşturuldu');
    
    // 6. Flutter Hot Reload Kısayolu
    const hotReloadShortcut = `@echo off
echo Flutter Hot Reload icin 'r' tusuna basin...
echo Flutter Hot Restart icin 'R' tusuna basin...
echo Cikmak icin 'q' tusuna basin...
echo.
cd /d "${path.resolve('.')}"
flutter run -d chrome --web-port 8080 --hot
pause`;
    
    fs.writeFileSync(path.join(desktopPath, 'CozKazan-Hot-Reload.bat'), hotReloadShortcut);
    console.log('✅ Hot Reload kısayolu oluşturuldu');
    
    // 7. Sistem Durumu Kısayolu
    const systemStatusShortcut = `@echo off
echo CozKazan Sistem Durumu Kontrol Ediliyor...
echo.
echo 1. Backend Server durumu:
netstat -an | findstr :3000
echo.
echo 2. Flutter uygulamasi durumu:
netstat -an | findstr :8080
echo.
echo 3. Firebase durumu:
ping cozkazan-app.web.app
echo.
echo 4. Node.js versiyonu:
node --version
echo.
echo 5. Flutter versiyonu:
flutter --version
echo.
pause`;
    
    fs.writeFileSync(path.join(desktopPath, 'CozKazan-Sistem-Durumu.bat'), systemStatusShortcut);
    console.log('✅ Sistem Durumu kısayolu oluşturuldu');
    
    // 8. Temizlik Kısayolu
    const cleanupShortcut = `@echo off
echo CozKazan Sistem Temizligi Yapiliyor...
echo.
echo 1. Flutter temizligi:
cd /d "${path.resolve('.')}"
flutter clean
echo.
echo 2. Node modules temizligi:
cd /d "${path.resolve('./backend')}"
rmdir /s /q node_modules
npm install
echo.
echo 3. Build dosyalari temizligi:
cd /d "${path.resolve('.')}"
flutter clean
flutter pub get
echo.
echo Temizlik tamamlandi!
pause`;
    
    fs.writeFileSync(path.join(desktopPath, 'CozKazan-Sistem-Temizligi.bat'), cleanupShortcut);
    console.log('✅ Sistem Temizliği kısayolu oluşturuldu');
    
    // README dosyası oluştur
    const readmeContent = `# CozKazan Uygulaması Kısayolları

## 🚀 Hızlı Başlat
**CozKazan-Hizli-Baslat.bat** - Tüm servisleri tek tıkla başlatır

## 📱 Uygulama Kısayolları
- **CozKazan-Admin-Panel.bat** - Admin panelini açar
- **CozKazan-Flutter-Uygulamasi.bat** - Flutter uygulamasını başlatır
- **CozKazan-Backend-Server.bat** - Backend server'ı başlatır
- **CozKazan-Test-Yonetimi.bat** - Test yönetimi sayfasını açar

## 🔧 Geliştirici Kısayolları
- **CozKazan-Hot-Reload.bat** - Hot reload ile geliştirme
- **CozKazan-Sistem-Durumu.bat** - Sistem durumunu kontrol eder
- **CozKazan-Sistem-Temizligi.bat** - Sistem temizliği yapar

## 🌐 URL'ler
- **Admin Panel:** https://cozkazan-app.web.app/admin-panel.html
- **Test Yönetimi:** https://cozkazan-app.web.app/admin-panel.html#test-yonetimi
- **Flutter App:** http://localhost:8080
- **Backend API:** http://localhost:3000

## ⌨️ Klavye Kısayolları (Flutter)
- **r** - Hot Reload
- **R** - Hot Restart
- **q** - Çıkış

## 📞 Destek
Sorun yaşarsanız "CozKazan-Sistem-Durumu.bat" çalıştırın.
`;
    
    fs.writeFileSync(path.join(desktopPath, 'CozKazan-Kisayollar-README.txt'), readmeContent);
    console.log('✅ README dosyası oluşturuldu');
    
    console.log('\n🎉 Tüm kısayollar masaüstüne oluşturuldu!');
    console.log('📁 Masaüstünde şu dosyalar var:');
    console.log('   - CozKazan-Hizli-Baslat.bat (ÖNERİLEN)');
    console.log('   - CozKazan-Admin-Panel.bat');
    console.log('   - CozKazan-Flutter-Uygulamasi.bat');
    console.log('   - CozKazan-Backend-Server.bat');
    console.log('   - CozKazan-Test-Yonetimi.bat');
    console.log('   - CozKazan-Hot-Reload.bat');
    console.log('   - CozKazan-Sistem-Durumu.bat');
    console.log('   - CozKazan-Sistem-Temizligi.bat');
    console.log('   - CozKazan-Kisayollar-README.txt');
    console.log('\n💡 En hızlı başlatmak için "CozKazan-Hizli-Baslat.bat" kullanın!');
}

// Kısayolları oluştur
createShortcuts(); 