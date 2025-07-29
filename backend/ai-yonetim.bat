@echo off
echo ========================================
echo    COZ KAZAN AI EĞİTİM SİSTEMİ
echo ========================================
echo.

:menu
echo Lütfen bir seçenek seçin:
echo 1. AI Eğitim Sistemini Başlat
echo 2. AI Eğitim Sistemini Durdur
echo 3. AI Eğitim Sistemini Yeniden Başlat
echo 4. AI Durumunu Kontrol Et
echo 5. Tek Seferlik AI Eğitimi
echo 6. Çıkış
echo.
set /p choice="Seçiminiz (1-6): "

if "%choice%"=="1" goto start_ai
if "%choice%"=="2" goto stop_ai
if "%choice%"=="3" goto restart_ai
if "%choice%"=="4" goto status_ai
if "%choice%"=="5" goto single_training
if "%choice%"=="6" goto exit
goto menu

:start_ai
echo.
echo 🤖 AI Eğitim Sistemi başlatılıyor...
pm2 start ecosystem.config.js --only ai-egitim-sistemi
echo ✅ AI Eğitim Sistemi başlatıldı!
echo.
pause
goto menu

:stop_ai
echo.
echo 🛑 AI Eğitim Sistemi durduruluyor...
pm2 stop ai-egitim-sistemi
echo ✅ AI Eğitim Sistemi durduruldu!
echo.
pause
goto menu

:restart_ai
echo.
echo 🔄 AI Eğitim Sistemi yeniden başlatılıyor...
pm2 restart ai-egitim-sistemi
echo ✅ AI Eğitim Sistemi yeniden başlatıldı!
echo.
pause
goto menu

:status_ai
echo.
echo 📊 AI Eğitim Sistemi Durumu:
pm2 status ai-egitim-sistemi
echo.
pause
goto menu

:single_training
echo.
echo 🎓 Tek seferlik AI eğitimi başlatılıyor...
node ai-egitim.js
echo ✅ Tek seferlik AI eğitimi tamamlandı!
echo.
pause
goto menu

:exit
echo.
echo 👋 AI Eğitim Sistemi kapatılıyor...
exit 