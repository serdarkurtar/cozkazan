@echo off
echo 🔄 MongoDB'yi geri aktif hale getiriyorum...
echo.

echo 📁 Backend klasörüne geçiyorum...
cd backend

echo 🔄 MongoDB dosyalarını geri yüklüyorum...
if exist "models.disabled" ren models.disabled models
if exist "index.js.disabled" ren index.js.disabled index.js
if exist "package.json.disabled" ren package.json.disabled package.json
if exist "package-lock.json.disabled" ren package-lock.json.disabled package-lock.json
if exist "node_modules.disabled" ren node_modules.disabled node_modules
echo ✅ MongoDB dosyaları geri yüklendi

echo.
echo 🎉 MongoDB geri aktif hale getirildi!
echo.
echo 📋 Durum:
echo ✅ MongoDB dosyaları aktif
echo ✅ Backup dosyaları korundu: backend/mongodb-backup/
echo ⚠️ Firebase ile çakışma olabilir
echo.
echo 🔒 Tekrar pasif yapmak için: disable-mongodb.bat çalıştırın
echo.
pause 