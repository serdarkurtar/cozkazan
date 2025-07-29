# COZKAZAN Sunucu Başlatma Scripti
Write-Host "🚀 COZKAZAN SUNUCUSU BAŞLATILIYOR..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Backend klasörüne geç
Set-Location $PSScriptRoot
Write-Host "📂 Backend klasörüne geçildi: $PWD" -ForegroundColor Yellow

# Sunucuyu başlat
Write-Host "📡 Sunucu başlatılıyor..." -ForegroundColor Cyan
Write-Host "🔄 Sunucu kapandığında otomatik yeniden başlatılacak" -ForegroundColor Yellow
Write-Host "🛑 Durdurmak için Ctrl+C" -ForegroundColor Red
Write-Host ""

do {
    try {
        Write-Host "🔄 Sunucu yeniden başlatılıyor..." -ForegroundColor Green
        node index.js
    }
    catch {
        Write-Host "❌ Hata: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host "⚠️ Sunucu kapandı. 3 saniye sonra yeniden başlatılıyor..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
} while ($true) 