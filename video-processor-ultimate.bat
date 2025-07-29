@echo off
chcp 65001 >nul
title Video İşleme Aracı - Ultimate

echo ========================================
echo    Video İşleme Aracı - Ultimate
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
echo 🎬 Video işleniyor (ultimate efektler)...
echo ⚠️ Bu işlem 5-20 dakika sürebilir...
echo.

:: Çıktı dosya adı
for %%f in ("%video_file%") do set "base_name=%%~nf"
set "output_file=processed\%base_name%_ultimate.mp4"

:: Ultimate filtre (çok güçlü ses ve görüntü efektleri)
echo 🎨 Ultimate efektler uygulanıyor...
echo - Ses: Çok güçlü ton değişikliği ve filtreler
echo - Görüntü: Çok belirgin renk ve efekt değişiklikleri
echo - Telif hakkı: Tamamen farklı bir video olacak

:: Ultimate filtre (telif hakkı sorununu çözen güçlü efektler)
tools\ffmpeg.exe -i "%video_file%" -filter_complex "[0:a]asetrate=44100*1.8,highpass=f=500,lowpass=f=2000,volume=1.5,atempo=0.8[a];[0:v]hue=h=120,eq=contrast=2.0:brightness=0.3:gamma=1.5,unsharp=5:5:2:5:5:1,scale=iw*0.9:ih*0.9,pad=iw:ih:(ow-iw)/2:(oh-ih)/2[v]" -map "[a]" -map "[v]" -c:v libx264 -c:a aac -preset fast -crf 18 "%output_file%" -y

if %errorlevel% neq 0 (
    echo.
    echo ❌ Video işlenemedi!
    echo 🔍 Hata kodu: %errorlevel%
    echo.
    echo 🔧 Orta yöntem deneniyor...
    
    :: Orta güçlü alternatif
    tools\ffmpeg.exe -i "%video_file%" -filter_complex "[0:a]asetrate=44100*1.5,highpass=f=300,lowpass=f=2500,volume=1.3[a];[0:v]hue=h=90,eq=contrast=1.8:brightness=0.2:gamma=1.3,unsharp=3:3:1.5:3:3:0.5[v]" -map "[a]" -map "[v]" -c:v libx264 -c:a aac -preset fast -crf 20 "%output_file%" -y
    
    if %errorlevel% neq 0 (
        echo ❌ Orta yöntem de başarısız!
        pause
        exit /b 1
    ) else (
        echo ✅ Video işlendi (orta yöntemle)
    )
) else (
    echo ✅ Video işlendi (ultimate efektlerle)
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
echo 🎯 Ultimate Özellikler:
echo - Ses tonu çok değiştirildi (1.8x asetrate)
echo - Ses yavaşlatıldı (0.8x atempo)
echo - Ses filtreleri çok güçlü (500-2000Hz)
echo - Ses seviyesi artırıldı (1.5x)
echo - Renk tonları çok değiştirildi (120°)
echo - Kontrast çok artırıldı (2.0x)
echo - Parlaklık artırıldı (0.3)
echo - Gamma düzeltmesi (1.5x)
echo - Keskinlik çok artırıldı
echo - Video boyutu küçültüldü (%90)
echo - Video ortalandı (pad)
echo.
echo 🎯 Sonuç: Video tamamen farklı görünecek!
echo.
pause 