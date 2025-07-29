@echo off
chcp 65001 >nul
title Video Araçları Kurulum Sihirbazı

echo 🎬 Video İşleme Araçları Kurulum Sihirbazı
echo ==============================================
echo.

:: Klasörleri oluştur
if not exist "tools" mkdir tools
if not exist "downloads" mkdir downloads
if not exist "processed" mkdir processed

echo 📁 Klasörler oluşturuldu: tools, downloads, processed
echo.

:: yt-dlp indir
echo 📥 yt-dlp indiriliyor...
powershell -Command "& {Invoke-WebRequest -Uri 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe' -OutFile 'tools\yt-dlp.exe'}"

if exist "tools\yt-dlp.exe" (
    echo ✅ yt-dlp indirildi
) else (
    echo ❌ yt-dlp indirilemedi
    echo 🔗 Manuel indirme: https://github.com/yt-dlp/yt-dlp/releases
)

echo.

:: FFmpeg indir
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
    )
) else (
    echo ❌ FFmpeg indirilemedi
    echo 🔗 Manuel indirme: https://www.gyan.dev/ffmpeg/builds/
)

echo.

:: Test et
echo 🔍 Araçlar test ediliyor...

if exist "tools\yt-dlp.exe" (
    echo ✅ yt-dlp hazır
) else (
    echo ❌ yt-dlp eksik
)

if exist "tools\ffmpeg.exe" (
    echo ✅ FFmpeg hazır
) else (
    echo ❌ FFmpeg eksik
)

echo.

:: Video processor'ı güncelle
echo 🔧 Video processor güncelleniyor...

echo @echo off > video-processor-simple.bat
echo chcp 65001 ^>nul >> video-processor-simple.bat
echo title YouTube Video İşleme Aracı >> video-processor-simple.bat
echo. >> video-processor-simple.bat
echo echo 🎬 YouTube Video İşleme Aracı >> video-processor-simple.bat
echo echo ======================================== >> video-processor-simple.bat
echo. >> video-processor-simple.bat
echo :: Araçları kontrol et >> video-processor-simple.bat
echo if not exist "tools\ffmpeg.exe" ^( >> video-processor-simple.bat
echo     echo ❌ FFmpeg bulunamadı! >> video-processor-simple.bat
echo     echo 📥 Lütfen setup-video-tools.bat çalıştırın >> video-processor-simple.bat
echo     pause >> video-processor-simple.bat
echo     exit /b 1 >> video-processor-simple.bat
echo ^) >> video-processor-simple.bat
echo. >> video-processor-simple.bat
echo if not exist "tools\yt-dlp.exe" ^( >> video-processor-simple.bat
echo     echo ❌ yt-dlp bulunamadı! >> video-processor-simple.bat
echo     echo 📥 Lütfen setup-video-tools.bat çalıştırın >> video-processor-simple.bat
echo     pause >> video-processor-simple.bat
echo     exit /b 1 >> video-processor-simple.bat
echo ^) >> video-processor-simple.bat
echo. >> video-processor-simple.bat
echo echo ✅ Araçlar hazır! >> video-processor-simple.bat
echo. >> video-processor-simple.bat
echo :: URL al >> video-processor-simple.bat
echo set /p url="📺 YouTube URL'sini girin: " >> video-processor-simple.bat
echo. >> video-processor-simple.bat
echo if "%%url%%"=="" ^( >> video-processor-simple.bat
echo     echo ❌ URL gerekli! >> video-processor-simple.bat
echo     pause >> video-processor-simple.bat
echo     exit /b 1 >> video-processor-simple.bat
echo ^) >> video-processor-simple.bat
echo. >> video-processor-simple.bat
echo echo 📥 Video indiriliyor... >> video-processor-simple.bat
echo tools\yt-dlp.exe --format "best[height^<=720]" --output "downloads/%%(title)s.%%(ext)s" "%%url%%" >> video-processor-simple.bat
echo. >> video-processor-simple.bat
echo echo 🎬 Video işleniyor... >> video-processor-simple.bat
echo for %%f in ^(downloads\*.mp4 downloads\*.webm downloads\*.mkv^) do ^( >> video-processor-simple.bat
echo     set "video_file=%%f" >> video-processor-simple.bat
echo     goto :found >> video-processor-simple.bat
echo ^) >> video-processor-simple.bat
echo :found >> video-processor-simple.bat
echo for %%f in ^("%%video_file%%"^) do set "base_name=%%~nf" >> video-processor-simple.bat
echo set "output_file=processed\%%base_name%%_modified.mp4" >> video-processor-simple.bat
echo. >> video-processor-simple.bat
echo tools\ffmpeg.exe -i "%%video_file%%" -filter_complex "[0:a]atempo=1.3,asetrate=44100*1.15[a];[0:v]hue=h=45:sat=1.2[v]" -map "[a]" -map "[v]" -c:v libx264 -c:a aac -preset fast -crf 23 "%%output_file%%" -y >> video-processor-simple.bat
echo. >> video-processor-simple.bat
echo echo 🎉 İşlem tamamlandı! >> video-processor-simple.bat
echo echo 📁 İşlenmiş video: %%output_file%% >> video-processor-simple.bat
echo pause >> video-processor-simple.bat

echo ✅ Video processor güncellendi
echo.

echo 🎉 Kurulum tamamlandı!
echo.
echo 📋 Kullanım:
echo 1. video-processor-simple.bat dosyasını çift tıklayın
echo 2. YouTube URL'sini girin
echo 3. İşlemin tamamlanmasını bekleyin
echo.
echo 📁 Dosyalar:
echo - tools\: İndirilen araçlar
echo - downloads\: İndirilen videolar
echo - processed\: İşlenmiş videolar
echo.
pause 