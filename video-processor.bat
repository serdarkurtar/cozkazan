@echo off
chcp 65001 >nul
title YouTube Video İşleme Aracı

echo 🎬 YouTube Video İşleme Aracı
echo ========================================

:: FFmpeg kontrolü
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ FFmpeg kurulu değil!
    echo 📥 FFmpeg'i şuradan indirin: https://ffmpeg.org/download.html
    echo 📥 Windows için: https://www.gyan.dev/ffmpeg/builds/
    pause
    exit /b 1
)

:: yt-dlp kontrolü
yt-dlp --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ yt-dlp kurulu değil!
    echo 📥 yt-dlp'yi şuradan indirin: https://github.com/yt-dlp/yt-dlp
    echo 📥 Veya: pip install yt-dlp
    pause
    exit /b 1
)

echo ✅ Gerekli araçlar kurulu!

:: Klasörleri oluştur
if not exist "downloads" mkdir downloads
if not exist "processed" mkdir processed

:: URL al
set /p url="📺 YouTube URL'sini girin: "

if "%url%"=="" (
    echo ❌ URL gerekli!
    pause
    exit /b 1
)

echo.
echo 🎯 İşlenecek video: %url%
echo.

:: Video indir
echo 📥 Video indiriliyor...
yt-dlp --format "best[height<=720]" --output "downloads/%%(title)s.%%(ext)s" "%url%"

if %errorlevel% neq 0 (
    echo ❌ Video indirilemedi!
    pause
    exit /b 1
)

:: İndirilen dosyayı bul
for %%f in (downloads\*.mp4 downloads\*.webm downloads\*.mkv) do (
    set "video_file=%%f"
    goto :found
)

:found
if not defined video_file (
    echo ❌ Video dosyası bulunamadı!
    pause
    exit /b 1
)

echo ✅ Video indirildi: %video_file%

:: Video işle
echo 🎬 Video işleniyor...

:: Çıktı dosya adı
for %%f in ("%video_file%") do set "base_name=%%~nf"
set "output_file=processed\%base_name%_modified.mp4"

:: FFmpeg ile işle
ffmpeg -i "%video_file%" -filter_complex "[0:a]atempo=1.3,asetrate=44100*1.15[a];[0:v]hue=h=45:sat=1.2[v]" -map "[a]" -map "[v]" -c:v libx264 -c:a aac -preset fast -crf 23 "%output_file%" -y

if %errorlevel% neq 0 (
    echo ❌ Video işlenemedi!
    pause
    exit /b 1
)

echo.
echo 🎉 İşlem tamamlandı!
echo 📁 Orijinal: %video_file%
echo 📁 İşlenmiş: %output_file%

:: Dosya boyutunu göster
for %%f in ("%output_file%") do (
    set "size=%%~zf"
    set /a "size_mb=!size!/1024/1024"
    echo 📊 Boyut: !size_mb! MB
)

echo.
echo ✅ Video başarıyla işlendi!
echo 📂 İşlenmiş video: %output_file%
echo.
pause 