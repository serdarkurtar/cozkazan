Write-Host "🚀 CozKazan Server'a bağlanılıyor..." -ForegroundColor Green
Write-Host "IP: 91.99.187.116" -ForegroundColor Yellow
Write-Host "Kullanıcı: root" -ForegroundColor Yellow
Write-Host ""

# SSH bağlantısı
ssh root@91.99.187.116

Write-Host ""
Write-Host "Bağlantı sonlandı." -ForegroundColor Red
Read-Host "Devam etmek için Enter'a basın" 