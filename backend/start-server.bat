@echo off
echo 🚀 COZKAZAN SUNUCUSU BAŞLATILIYOR...
echo =====================================

cd /d "%~dp0"

echo 📂 Backend klasörüne geçildi
echo 📡 Sunucu başlatılıyor...

node index.js

echo.
echo ⚠️ Sunucu kapandı
echo 🔄 Yeniden başlatmak için herhangi bir tuşa basın...
pause

goto :eof 