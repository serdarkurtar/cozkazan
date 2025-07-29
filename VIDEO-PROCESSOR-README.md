# 🎬 YouTube Video İşleme Aracı

Bu araç YouTube videolarını indirir ve telif hakkı sorunlarını çözmek için değiştirir.

## 📋 Özellikler

- ✅ YouTube videosunu otomatik indirme
- ✅ Ses hızlandırma (1.3x)
- ✅ Ses tonu değiştirme (pitch shift)
- ✅ Renk tonlarını değiştirme (hue)
- ✅ Görüntü kalitesini koruma
- ✅ Sorular ve cevaplar okunabilir kalır

## 🔧 Kurulum

### 1. FFmpeg Kurulumu

**Windows için:**
1. https://www.gyan.dev/ffmpeg/builds/ adresine gidin
2. "ffmpeg-git-full.7z" dosyasını indirin
3. Arşivi çıkartın
4. `bin` klasörünü Windows PATH'e ekleyin

**Alternatif (Chocolatey ile):**
```bash
choco install ffmpeg
```

### 2. yt-dlp Kurulumu

**Python ile:**
```bash
pip install yt-dlp
```

**Windows için:**
1. https://github.com/yt-dlp/yt-dlp/releases adresine gidin
2. `yt-dlp.exe` dosyasını indirin
3. C:\Windows\System32 klasörüne kopyalayın

## 🚀 Kullanım

### Yöntem 1: Batch Dosyası (Önerilen)

1. `video-processor.bat` dosyasını çift tıklayın
2. YouTube URL'sini girin
3. İşlemin tamamlanmasını bekleyin

### Yöntem 2: Komut Satırı

```bash
# Tek komutla işle
video-processor.bat

# Veya Python script ile
python video-processor.py "https://www.youtube.com/watch?v=X530Ugzx5iI"
```

## 📁 Çıktı Dosyaları

- **downloads/**: İndirilen orijinal videolar
- **processed/**: İşlenmiş videolar

## 🎯 İşlenen Video Özellikleri

### Ses Değişiklikleri:
- **Hız**: 1.3x hızlandırma
- **Ton**: %15 pitch shift
- **Sonuç**: Anlaşılmaz ses

### Görüntü Değişiklikleri:
- **Renk tonu**: 45° hue shift
- **Doygunluk**: %20 artış
- **Sonuç**: Farklı görünüm, okunabilir içerik

## 🔍 Örnek Kullanım

```bash
# Video işle
video-processor.bat

# URL girin: https://www.youtube.com/watch?v=X530Ugzx5iI

# Sonuç:
# ✅ Video indirildi: downloads/2.sınıf - Zaman Ölçme Problemleri.mp4
# ✅ Video işlendi: processed/2.sınıf - Zaman Ölçme Problemleri_modified.mp4
```

## ⚠️ Önemli Notlar

1. **Telif Hakkı**: Bu araç sadece eğitim amaçlı kullanım içindir
2. **Kalite**: Sorular ve cevaplar okunabilir kalır
3. **Boyut**: İşlenmiş video orijinalden biraz büyük olabilir
4. **Süre**: İşlem süresi video uzunluğuna bağlıdır

## 🛠️ Sorun Giderme

### FFmpeg bulunamadı hatası:
- FFmpeg'in PATH'e eklendiğinden emin olun
- Bilgisayarı yeniden başlatın

### yt-dlp bulunamadı hatası:
- yt-dlp'nin doğru kurulduğundan emin olun
- Komut satırında `yt-dlp --version` test edin

### Video indirilemedi:
- İnternet bağlantınızı kontrol edin
- URL'nin doğru olduğundan emin olun
- Video erişilebilir olduğundan emin olun

## 📞 Destek

Sorun yaşarsanız:
1. Hata mesajını kopyalayın
2. Video URL'sini not edin
3. Sistem bilgilerinizi paylaşın

---

**Not**: Bu araç eğitim amaçlı geliştirilmiştir. Telif haklarına saygı gösterin. 