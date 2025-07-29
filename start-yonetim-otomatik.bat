@echo off
echo ========================================
echo    COZKAZAN YONETIM PANELI
echo ========================================
echo.
echo Sunucu baslatiliyor...
echo.

cd backend
start node index.js

echo Sunucu baslatildi, tarayici aciliyor...
timeout /t 3 /nobreak >nul

start http://localhost:3000/yonetim

echo.
echo Yonetim paneli tarayicida acildi!
echo Sunucuyu durdurmak icin terminal penceresini kapat.
echo.
pause 