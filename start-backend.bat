@echo off
echo 🚀 COZKAZAN BACKEND SUNUCUSU BAŞLATILIYOR...
echo ===============================================

cd /d "%~dp0\backend"

echo 📂 Backend klasörüne geçildi
echo 📡 Sunucu başlatılıyor...
echo 🌐 Sunucu: http://localhost:3000
echo.

:start
echo 🔄 Sunucu başlatılıyor...
node index.js

echo.
echo ⚠️ Sunucu kapandı
echo 🔄 3 saniye sonra yeniden başlatılıyor...
timeout /t 3 /nobreak >nul
goto start 