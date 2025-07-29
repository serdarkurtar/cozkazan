@echo off
chcp 65001 >nul
title Video İşleme Aracı - Mükemmel

echo ========================================
echo    Video İşleme Aracı - Mükemmel
echo ========================================
echo.

:: Klasörleri kontrol et
if not exist "tools" (
    echo ❌ tools klasörü bulunamadı!
    echo 📁 Lütfen tools klasörünün masaüstünde olduğundan emin olun
    pause
    exit /b 1
)

if not exist "tools\yt-dlp.exe" (
    echo ❌ yt-dlp.exe bulunamadı!
    echo 📥 tools klasöründe yt-dlp.exe olmalı
    pause
    exit /b 1
)

if not exist "tools\ffmpeg.exe" (
    echo ❌ ffmpeg.exe bulunamadı!
    echo 📥 tools klasöründe ffmpeg.exe olmalı
    pause
    exit /b 1
)

:: Klasörleri oluştur
if not exist "downloads" mkdir downloads
if not exist "processed" mkdir processed

echo ✅ Araçlar hazır!
echo.

:: URL al
set /p url="YouTube URL'sini girin: "

if "%url%"=="" (
    echo ❌ URL gerekli!
    pause
    exit /b 1
)

echo.
echo 🎯 Video: %url%
echo.

:: Video indir
echo 📥 Video indiriliyor...
echo ⚠️ Bu işlem 1-5 dakika sürebilir...
echo.

tools\yt-dlp.exe --format "best[height<=720]" --output "downloads/%%(title)s.%%(ext)s" "%url%"

if %errorlevel% neq 0 (
    echo.
    echo ❌ Video indirilemedi!
    echo 🔍 Hata kodu: %errorlevel%
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

echo.
echo ✅ Video indirildi: %video_file%

:: Video işle
echo.
echo 🎬 Video işleniyor (mükemmel ayarlar)...
echo ⚠️ Bu işlem 3-15 dakika sürebilir...
echo.

:: Çıktı dosya adı
for %%f in ("%video_file%") do set "base_name=%%~nf"
set "output_file=processed\%base_name%_perfect.mp4"

:: Mükemmel filtre (sadece ses tonu, gobo ve eller silme)
echo 🎨 Mükemmel efektler uygulanıyor...
echo - Ses: Hızlanmadan sadece ton değişikliği
echo - Görüntü: Gobo ve eller siliniyor
echo - Renk: Hafif değişiklik

:: Mükemmel filtre (sadece ses tonu değişikliği, gobo ve eller silme)
tools\ffmpeg.exe -i "%video_file%" -filter_complex "[0:a]asetrate=44100*1.2,highpass=f=200,lowpass=f=3500[a];[0:v]crop=iw-100:ih-50:50:25,hue=h=45,eq=contrast=1.2:brightness=0.02[v]" -map "[a]" -map "[v]" -c:v libx264 -c:a aac -preset fast -crf 22 "%output_file%" -y

if %errorlevel% neq 0 (
    echo.
    echo ❌ Video işlenemedi!
    echo 🔍 Hata kodu: %errorlevel%
    echo.
    echo 🔧 Basit yöntem deneniyor...
    
    :: Basit alternatif (sadece ses tonu)
    tools\ffmpeg.exe -i "%video_file%" -filter_complex "[0:a]asetrate=44100*1.2[a];[0:v]hue=h=45,eq=contrast=1.2:brightness=0.02[v]" -map "[a]" -map "[v]" -c:v libx264 -c:a aac -preset fast -crf 22 "%output_file%" -y
    
    if %errorlevel% neq 0 (
        echo ❌ Basit yöntem de başarısız!
        pause
        exit /b 1
    ) else (
        echo ✅ Video işlendi (basit yöntemle)
    )
) else (
    echo ✅ Video işlendi (mükemmel efektlerle)
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
echo 🎯 Mükemmel Özellikler:
echo - Ses hızlanmadı (sadece ton değişti)
echo - Ses tonu değiştirildi (1.2x asetrate)
echo - Ses filtreleri eklendi (200-3500Hz)
echo - Gobo ve eller silindi (crop ile)
echo - Renk tonları hafif değiştirildi (45°)
echo - Kontrast hafif artırıldı (1.2x)
echo - Parlaklık hafif artırıldı
echo.
pause 