@echo off
title Cozkazan Server - Otomatik Başlatıcı
color 0A

echo.
echo ========================================
echo    COZKAZAN SERVER - OTOMATIK BASLATICI
echo ========================================
echo.

cd /d "%~dp0"

:start
echo [%date% %time%] Sunucu baslatiliyor...
echo.

node index.js

echo.
echo [%date% %time%] Sunucu kapandi!
echo [%date% %time%] 3 saniye sonra yeniden baslatiliyor...
echo.

timeout /t 3 /nobreak >nul

goto start 