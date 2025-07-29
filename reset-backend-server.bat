@echo off
REM --- ÇözKazan Backend Sunucu Reset ve Başlatıcı ---

REM Node.js processlerini öldür
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=2" %%a in ('tasklist ^| findstr node.exe') do taskkill /F /PID %%a >nul 2>&1

REM Backend klasörüne geç
cd /d "%~dp0backend"

REM Sunucuyu başlat
start "CozKazan Backend" cmd /k node index.js

echo Backend sunucusu başlatıldı. Tarayıcıdan http://localhost:3000/yonetim adresine gidebilirsiniz.
pause 