# 🔥 FIREBASE SERVICE ACCOUNT KEY GEREKLİ

## 📋 Adım 1: Firebase Console'a Gidin
1. https://console.firebase.google.com/ adresine gidin
2. `cozkazan-app` projesini seçin

## 📋 Adım 2: Service Account Key İndirin
1. Sol menüden ⚙️ (Ayarlar) > "Proje ayarları" tıklayın
2. "Service accounts" sekmesine gidin
3. "Generate new private key" butonuna tıklayın
4. JSON dosyasını indirin

## 📋 Adım 3: Dosyayı Yerleştirin
1. İndirilen JSON dosyasının içeriğini kopyalayın
2. `backend/cozkazan-app-firebase-adminsdk.json` dosyasını açın
3. Tüm içeriği silin ve kopyaladığınız gerçek JSON içeriğini yapıştırın
4. Dosyayı kaydedin

## 📋 Adım 4: Veri Aktarımını Başlatın
```bash
cd backend
node migrate-mongo-to-firebase.cjs
```

## ⚠️ ÖNEMLİ
- Dosya adı tam olarak `cozkazan-app-firebase-adminsdk.json` olmalı
- JSON içeriği geçerli Firebase service account bilgilerini içermeli
- Private key ve diğer tüm alanlar gerçek değerler olmalı

## 🔍 Kontrol
Dosya doğru yerleştirildikten sonra şu komutla test edin:
```bash
node -e "console.log(require('./cozkazan-app-firebase-adminsdk.json').project_id)"
```

Eğer `cozkazan-app` yazdırırsa, dosya doğru yerleştirilmiş demektir. 