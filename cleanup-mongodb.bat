@echo off
echo 🗑️ MongoDB dosyalarını temizliyorum...
echo.

echo 📁 Backend klasörünü temizliyorum...
cd backend

echo ❌ MongoDB model dosyalarını siliyorum...
rmdir /s /q models
echo ✅ Models klasörü silindi

echo ❌ MongoDB script dosyalarını siliyorum...
del migrate-to-firebase.js
del simple-migrate.js
del check-tests.js
del fix-test-fields.js
del api-debug.js
del api-debug-detayli.js
del havuz*.js
del debug*.js
del temizle*.js
del test-kontrol.js
echo ✅ MongoDB script dosyaları silindi

echo ❌ Node modules siliyorum...
rmdir /s /q node_modules
del package-lock.json
echo ✅ Node modules silindi

echo ❌ MongoDB server dosyasını siliyorum...
del index.js
echo ✅ MongoDB server silindi

echo.
echo 🎉 MongoDB temizliği tamamlandı!
echo ✅ Artık sadece Firebase kullanılıyor
echo.
echo 📋 Kalan dosyalar:
echo - Firebase import scriptleri
echo - Test verileri
echo - Hikaye dosyaları
echo.
pause 