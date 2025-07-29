@echo off
echo ========================================
echo    COZKAZAN BACKEND SUNUCU
echo ========================================
echo.
echo MongoDB kontrol ediliyor...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% neq 0 (
    echo ❌ MongoDB çalışmıyor! Başlatılıyor...
    net start MongoDB
    timeout /t 3 /nobreak >nul
)

echo.
echo Backend sunucu başlatılıyor...
echo.

cd /d "%~dp0backend"
node index.js

echo.
echo Sunucu durdu. Çıkmak için bir tuşa basın...
pause >nul 