@echo off
chcp 65001 >nul
title YouTube Video İşleme Aracı - Gelişmiş

echo 🎬 YouTube Video İşleme Aracı - Gelişmiş
echo ========================================
echo.

:: Klasörleri oluştur
if not exist "tools" mkdir tools
if not exist "downloads" mkdir downloads
if not exist "processed" mkdir processed

:: yt-dlp indir (eğer yoksa)
if not exist "tools\yt-dlp.exe" (
    echo 📥 yt-dlp indiriliyor...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe' -OutFile 'tools\yt-dlp.exe'}"
    if exist "tools\yt-dlp.exe" (
        echo ✅ yt-dlp indirildi
    ) else (
        echo ❌ yt-dlp indirilemedi
        echo 🔗 Manuel indirme: https://github.com/yt-dlp/yt-dlp/releases
        pause
        exit /b 1
    )
) else (
    echo ✅ yt-dlp hazır
)

:: FFmpeg indir (eğer yoksa)
if not exist "tools\ffmpeg.exe" (
    echo 📥 FFmpeg indiriliyor...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip' -OutFile 'tools\ffmpeg.zip'}"
    
    if exist "tools\ffmpeg.zip" (
        echo 📦 FFmpeg arşivi indirildi, çıkartılıyor...
        powershell -Command "& {Expand-Archive -Path 'tools\ffmpeg.zip' -DestinationPath 'tools' -Force}"
        
        :: FFmpeg.exe'yi bul ve kopyala
        for /r tools %%f in (ffmpeg.exe) do (
            copy "%%f" "tools\ffmpeg.exe" >nul 2>&1
            goto :ffmpeg_found
        )
        
        :ffmpeg_found
        if exist "tools\ffmpeg.exe" (
            echo ✅ FFmpeg kuruldu
        ) else (
            echo ❌ FFmpeg kurulamadı
            echo 🔗 Manuel kurulum: https://www.gyan.dev/ffmpeg/builds/
            pause
            exit /b 1
        )
    ) else (
        echo ❌ FFmpeg indirilemedi
        echo 🔗 Manuel indirme: https://www.gyan.dev/ffmpeg/builds/
        pause
        exit /b 1
    )
) else (
    echo ✅ FFmpeg hazır
)

echo.
echo ✅ Tüm araçlar hazır!
echo.

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
echo.
echo ⚠️ Bu işlem 1-5 dakika sürebilir...
echo ⚠️ Lütfen bekleyin, pencereyi kapatmayın!
echo.

"tools\yt-dlp.exe" --format "best[height<=720]" --output "downloads/%%(title)s.%%(ext)s" "%url%"

if %errorlevel% neq 0 (
    echo.
    echo ❌ Video indirilemedi!
    echo 🔍 Hata kodu: %errorlevel%
    echo 📝 URL'yi kontrol edin
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
    echo 📁 downloads klasörünü kontrol edin
    pause
    exit /b 1
)

echo.
echo ✅ Video indirildi: %video_file%

:: Video işle
echo.
echo 🎬 Video işleniyor (gelişmiş efektler)...
echo ⚠️ Bu işlem 3-15 dakika sürebilir...
echo.

:: Çıktı dosya adı
for %%f in ("%video_file%") do set "base_name=%%~nf"
set "output_file=processed\%base_name%_advanced.mp4"

:: Gelişmiş FFmpeg filtresi
echo 🎨 Gelişmiş efektler uygulanıyor...
echo - Ses: 1.5x hız, ton değişikliği
echo - Görüntü: Renk değişikliği, kontrast artırma
echo - Logo: Gobo logo'su ekleniyor

:: Gelişmiş filtre (daha güçlü efektler)
"tools\ffmpeg.exe" -i "%video_file%" -i "gobo.png" -filter_complex "[0:a]atempo=1.5,asetrate=44100*1.2,highpass=f=200,lowpass=f=3000[a];[0:v]hue=h=90,eq=contrast=1.3:brightness=0.1:gamma=1.2,unsharp=3:3:1.5:3:3:0.5[v1];[v1][1:v]overlay=10:10:format=auto[v]" -map "[a]" -map "[v]" -c:v libx264 -c:a aac -preset fast -crf 20 "%output_file%" -y

if %errorlevel% neq 0 (
    echo.
    echo ❌ Video işlenemedi!
    echo 🔍 Hata kodu: %errorlevel%
    echo.
    echo 🔧 Alternatif yöntem deneniyor (logo olmadan)...
    
    :: Logo olmadan alternatif işleme
    "tools\ffmpeg.exe" -i "%video_file%" -filter_complex "[0:a]atempo=1.5,asetrate=44100*1.2,highpass=f=200,lowpass=f=3000[a];[0:v]hue=h=90,eq=contrast=1.3:brightness=0.1:gamma=1.2,unsharp=3:3:1.5:3:3:0.5[v]" -map "[a]" -map "[v]" -c:v libx264 -c:a aac -preset fast -crf 20 "%output_file%" -y
    
    if %errorlevel% neq 0 (
        echo ❌ Alternatif yöntem de başarısız!
        pause
        exit /b 1
    ) else (
        echo ✅ Video işlendi (logo olmadan)
    )
) else (
    echo ✅ Video işlendi (logo ile)
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
echo 🎯 Gelişmiş Özellikler:
echo - Ses hızlandırıldı (1.5x - daha hızlı)
echo - Ses tonu değiştirildi (daha belirgin)
echo - Ses filtreleri eklendi (yüksek/düşük geçiren)
echo - Renk tonları değiştirildi (90° döndürme)
echo - Kontrast artırıldı (1.3x)
echo - Parlaklık artırıldı
echo - Gamma düzeltmesi
echo - Keskinlik artırıldı
echo - Gobo logo'su eklendi (sol üst köşe)
echo.
echo 📝 Not: Logo eklenemezse, video logo olmadan işlenir
echo.
pause 