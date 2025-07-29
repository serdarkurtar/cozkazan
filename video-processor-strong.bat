@echo off
chcp 65001 >nul
title Video İşleme Aracı - Güçlü Efektler

echo ========================================
echo    Video İşleme Aracı - Güçlü Efektler
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
echo 🎬 Video işleniyor (güçlü efektler)...
echo ⚠️ Bu işlem 3-15 dakika sürebilir...
echo.

:: Çıktı dosya adı
for %%f in ("%video_file%") do set "base_name=%%~nf"
set "output_file=processed\%base_name%_strong.mp4"

:: Güçlü filtre (çok daha güçlü ses ve görüntü efektleri)
echo 🎨 Güçlü efektler uygulanıyor...
echo - Ses: 1.3x hız, güçlü ton değişikliği, filtreler
echo - Görüntü: Çok belirgin renk değişiklikleri
echo - Logo: Farklı logo (eğer varsa)

:: Güçlü ses ve görüntü filtreleri
tools\ffmpeg.exe -i "%video_file%" -filter_complex "[0:a]atempo=1.3,asetrate=44100*1.3,highpass=f=300,lowpass=f=2500,volume=1.2[a];[0:v]hue=h=270,eq=contrast=1.6:brightness=0.1:gamma=1.3,unsharp=3:3:1.5:3:3:0.5[v]" -map "[a]" -map "[v]" -c:v libx264 -c:a aac -preset fast -crf 20 "%output_file%" -y

if %errorlevel% neq 0 (
    echo.
    echo ❌ Video işlenemedi!
    echo 🔍 Hata kodu: %errorlevel%
    echo.
    echo 🔧 Basit yöntem deneniyor...
    
    :: Basit alternatif
    tools\ffmpeg.exe -i "%video_file%" -filter_complex "[0:a]atempo=1.3,asetrate=44100*1.3[a];[0:v]hue=h=270,eq=contrast=1.6:brightness=0.1[v]" -map "[a]" -map "[v]" -c:v libx264 -c:a aac -preset fast -crf 20 "%output_file%" -y
    
    if %errorlevel% neq 0 (
        echo ❌ Basit yöntem de başarısız!
        pause
        exit /b 1
    ) else (
        echo ✅ Video işlendi (basit yöntemle)
    )
) else (
    echo ✅ Video işlendi (güçlü efektlerle)
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
echo 🎯 Güçlü Özellikler:
echo - Ses hızlandırıldı (1.3x)
echo - Ses tonu çok değiştirildi (1.3x asetrate)
echo - Ses filtreleri eklendi (300-2500Hz)
echo - Ses seviyesi artırıldı (1.2x)
echo - Renk tonları çok değiştirildi (270°)
echo - Kontrast çok artırıldı (1.6x)
echo - Parlaklık artırıldı
echo - Gamma düzeltmesi
echo - Keskinlik artırıldı
echo.
pause 