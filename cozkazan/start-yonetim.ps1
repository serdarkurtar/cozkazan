Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    COZKAZAN YONETIM PANELI" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Sunucu baslatiliyor..." -ForegroundColor Green
Write-Host ""

Set-Location backend
node index.js

Read-Host "Devam etmek icin Enter'a basin" 