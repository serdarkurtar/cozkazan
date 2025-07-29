# Cozkazan Server - Otomatik Başlatıcı (PowerShell)
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   COZKAZAN SERVER - OTOMATIK BASLATICI" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Script dizinine geç
Set-Location $PSScriptRoot

while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] Sunucu baslatiliyor..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        # Sunucuyu başlat
        node index.js
    }
    catch {
        Write-Host "[$timestamp] Hata: $_" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "[$timestamp] Sunucu kapandi!" -ForegroundColor Red
    Write-Host "[$timestamp] 3 saniye sonra yeniden baslatiliyor..." -ForegroundColor Yellow
    Write-Host ""
    
    Start-Sleep -Seconds 3
} 