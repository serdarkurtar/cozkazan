# CozKazan Server Manager
$SERVER_IP = "91.99.187.116"
$SERVER_USER = "root"

Write-Host "🚀 CozKazan Server Manager" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "1. Sunucu Durumu" -ForegroundColor White
Write-Host "2. Admin Panel Logları" -ForegroundColor White
Write-Host "3. Sunucuyu Yeniden Başlat" -ForegroundColor White
Write-Host "4. SSH Bağlantısı" -ForegroundColor White
Write-Host "5. Çıkış" -ForegroundColor White
Write-Host "================================" -ForegroundColor Cyan

$choice = Read-Host "`nSeçiminizi yapın (1-5)"

switch ($choice) {
    "1" { 
        Write-Host "`n📊 Sunucu Durumu Kontrol Ediliyor..." -ForegroundColor Yellow
        ssh $SERVER_USER@$SERVER_IP "pm2 status"
    }
    "2" { 
        Write-Host "`n📋 Admin Panel Logları..." -ForegroundColor Yellow
        ssh $SERVER_USER@$SERVER_IP "pm2 logs cozkazan-backend --lines 10"
    }
    "3" { 
        Write-Host "`n🔄 Sunucu Yeniden Başlatılıyor..." -ForegroundColor Yellow
        ssh $SERVER_USER@$SERVER_IP "pm2 restart cozkazan-backend"
    }
    "4" { 
        Write-Host "`n🔗 SSH Bağlantısı Açılıyor..." -ForegroundColor Yellow
        ssh $SERVER_USER@$SERVER_IP
    }
    "5" { 
        Write-Host "`n👋 Görüşürüz!" -ForegroundColor Green
        exit 
    }
    default { 
        Write-Host "❌ Geçersiz seçim!" -ForegroundColor Red 
    }
}

Read-Host "`nDevam etmek için Enter'a basın" 