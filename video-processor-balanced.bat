@echo off
chcp 65001 >nul
title YouTube Video İşleme Aracı - Dengeli

echo 🎬 YouTube Video İşleme Aracı - Dengeli
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
echo 🎬 Video işleniyor (dengeli ayarlar)...
echo ⚠️ Bu işlem 3-15 dakika sürebilir...
echo.

:: Çıktı dosya adı
for %%f in ("%video_file%") do set "base_name=%%~nf"
set "output_file=processed\%base_name%_balanced.mp4"

:: Dengeli FFmpeg filtresi
echo 🎨 Dengeli efektler uygulanıyor...
echo - Ses: 1.2x hız, ton değişikliği
echo - Görüntü: Belirgin renk değişiklikleri
echo - Logo: Küçük gobo logo'su (sadece orijinal gobo'yu kapatacak)

:: Dengeli filtre (daha yavaş ses, belirgin renkler, küçük logo)
"tools\ffmpeg.exe" -i "%video_file%" -i "gobo.png" -filter_complex "[0:a]atempo=1.2,asetrate=44100*1.1,highpass=f=150,lowpass=f=4000[a];[0:v]hue=h=180,eq=contrast=1.4:brightness=0.05:gamma=1.1,unsharp=2:2:1:2:2:0.3[v1];[v1][1:v]overlay=20:20:format=auto:shortest=1[v]" -map "[a]" -map "[v]" -c:v libx264 -c:a aac -preset fast -crf 22 "%output_file%" -y

if %errorlevel% neq 0 (
    echo.
    echo ❌ Video işlenemedi!
    echo 🔍 Hata kodu: %errorlevel%
    echo.
    echo 🔧 Alternatif yöntem deneniyor (logo olmadan)...
    
    :: Logo olmadan alternatif işleme
    "tools\ffmpeg.exe" -i "%video_file%" -filter_complex "[0:a]atempo=1.2,asetrate=44100*1.1,highpass=f=150,lowpass=f=4000[a];[0:v]hue=h=180,eq=contrast=1.4:brightness=0.05:gamma=1.1,unsharp=2:2:1:2:2:0.3[v]" -map "[a]" -map "[v]" -c:v libx264 -c:a aac -preset fast -crf 22 "%output_file%" -y
    
    if %errorlevel% neq 0 (
        echo ❌ Alternatif yöntem de başarısız!
        pause
        exit /b 1
    ) else (
        echo ✅ Video işlendi (logo olmadan)
    )
) else (
    echo ✅ Video işlendi (küçük logo ile)
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
echo 🎯 Dengeli Özellikler:
echo - Ses hızlandırıldı (1.2x - daha yavaş)
echo - Ses tonu değiştirildi (hafif)
echo - Ses filtreleri eklendi (yumuşak)
echo - Renk tonları değiştirildi (180° - çok belirgin)
echo - Kontrast artırıldı (1.4x)
echo - Parlaklık hafif artırıldı
echo - Gamma düzeltmesi
echo - Keskinlik hafif artırıldı
echo - Küçük gobo logo'su (20x20 piksel offset)
echo.
echo 📝 Not: Logo eklenemezse, video logo olmadan işlenir
echo.
pause 