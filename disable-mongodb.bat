@echo off
echo 🔒 MongoDB'yi pasif hale getiriyorum...
echo.

echo 📁 Backend klasörüne geçiyorum...
cd backend

echo 🔄 MongoDB dosyalarını yedekliyorum...
if not exist "mongodb-backup" mkdir mongodb-backup
echo ✅ Backup klasörü oluşturuldu

echo 📋 MongoDB dosyalarını yedekliyorum...
if exist "models" xcopy /s /i models mongodb-backup\models
if exist "index.js" copy index.js mongodb-backup\
if exist "package.json" copy package.json mongodb-backup\
if exist "package-lock.json" copy package-lock.json mongodb-backup\
echo ✅ MongoDB dosyaları yedeklendi

echo 🔄 MongoDB dosyalarını yeniden adlandırıyorum...
if exist "models" ren models models.disabled
if exist "index.js" ren index.js index.js.disabled
if exist "package.json" ren package.json package.json.disabled
if exist "package-lock.json" ren package-lock.json package-lock.json.disabled
if exist "node_modules" ren node_modules node_modules.disabled
echo ✅ MongoDB dosyaları pasif hale getirildi

echo.
echo 🎉 MongoDB pasif hale getirildi!
echo.
echo 📋 Durum:
echo ✅ MongoDB dosyaları yedeklendi: backend/mongodb-backup/
echo ✅ MongoDB dosyaları pasif: .disabled uzantısı ile
echo ✅ Firebase aktif olarak çalışıyor
echo.
echo 🔄 Geri yüklemek için: enable-mongodb.bat çalıştırın
echo 🗑️ Tamamen silmek için: cleanup-mongodb.bat çalıştırın
echo.
pause 