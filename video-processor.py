#!/usr/bin/env python3
"""
YouTube Video İşleme Script'i
Videoyu indirir ve telif hakkı sorunlarını çözmek için değiştirir
"""

import os
import sys
import subprocess
from urllib.parse import urlparse, parse_qs

def check_dependencies():
    """Gerekli araçların kurulu olup olmadığını kontrol et"""
    tools = ['yt-dlp', 'ffmpeg']
    missing = []
    
    for tool in tools:
        try:
            subprocess.run([tool, '--version'], capture_output=True, check=True)
            print(f"✅ {tool} kurulu")
        except (subprocess.CalledProcessError, FileNotFoundError):
            missing.append(tool)
            print(f"❌ {tool} kurulu değil")
    
    if missing:
        print(f"\n🔧 Kurulması gereken araçlar: {', '.join(missing)}")
        print("📥 yt-dlp: pip install yt-dlp")
        print("📥 ffmpeg: https://ffmpeg.org/download.html")
        return False
    
    return True

def download_video(url, output_dir="downloads"):
    """YouTube videosunu indir"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    print(f"📥 Video indiriliyor: {url}")
    
    try:
        # Video ID'sini çıkar
        parsed_url = urlparse(url)
        if 'youtube.com' in parsed_url.netloc:
            video_id = parse_qs(parsed_url.query).get('v', [None])[0]
        elif 'youtu.be' in parsed_url.netloc:
            video_id = parsed_url.path[1:]
        else:
            print("❌ Geçersiz YouTube URL'si")
            return None
        
        # Video indir
        cmd = [
            'yt-dlp',
            '--format', 'best[height<=720]',  # 720p veya daha düşük
            '--output', f'{output_dir}/%(title)s.%(ext)s',
            url
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            # İndirilen dosyayı bul
            files = os.listdir(output_dir)
            video_files = [f for f in files if f.endswith(('.mp4', '.webm', '.mkv'))]
            
            if video_files:
                video_path = os.path.join(output_dir, video_files[0])
                print(f"✅ Video indirildi: {video_path}")
                return video_path
            else:
                print("❌ Video dosyası bulunamadı")
                return None
        else:
            print(f"❌ İndirme hatası: {result.stderr}")
            return None
            
    except Exception as e:
        print(f"❌ Hata: {e}")
        return None

def process_video(input_path, output_dir="processed"):
    """Videoyu işle ve değiştir"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Çıktı dosya adı
    base_name = os.path.splitext(os.path.basename(input_path))[0]
    output_path = os.path.join(output_dir, f"{base_name}_modified.mp4")
    
    print(f"🎬 Video işleniyor: {input_path}")
    
    # FFmpeg komutu - Ses ve görüntü değiştirme
    cmd = [
        'ffmpeg',
        '-i', input_path,
        '-filter_complex', 
        '[0:a]atempo=1.3,asetrate=44100*1.15[a];[0:v]hue=h=45:sat=1.2[v]',
        '-map', '[a]',
        '-map', '[v]',
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-preset', 'fast',
        '-crf', '23',
        output_path,
        '-y'  # Dosyayı üzerine yaz
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ Video işlendi: {output_path}")
            return output_path
        else:
            print(f"❌ İşleme hatası: {result.stderr}")
            return None
            
    except Exception as e:
        print(f"❌ Hata: {e}")
        return None

def main():
    """Ana fonksiyon"""
    print("🎬 YouTube Video İşleme Aracı")
    print("=" * 40)
    
    # Bağımlılıkları kontrol et
    if not check_dependencies():
        print("\n❌ Gerekli araçlar eksik. Lütfen önce bunları kurun.")
        return
    
    # URL al
    if len(sys.argv) > 1:
        url = sys.argv[1]
    else:
        url = input("📺 YouTube URL'sini girin: ").strip()
    
    if not url:
        print("❌ URL gerekli!")
        return
    
    print(f"\n🎯 İşlenecek video: {url}")
    
    # 1. Video indir
    video_path = download_video(url)
    if not video_path:
        print("❌ Video indirilemedi!")
        return
    
    # 2. Video işle
    processed_path = process_video(video_path)
    if not processed_path:
        print("❌ Video işlenemedi!")
        return
    
    print(f"\n🎉 İşlem tamamlandı!")
    print(f"📁 Orijinal: {video_path}")
    print(f"📁 İşlenmiş: {processed_path}")
    print(f"📊 Boyut: {os.path.getsize(processed_path) / (1024*1024):.1f} MB")

if __name__ == "__main__":
    main() 