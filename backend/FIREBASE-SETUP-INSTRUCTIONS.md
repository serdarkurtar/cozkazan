# 🔥 Firebase Kurulum Talimatları

## 📋 Adım 1: Firebase Service Account Key İndirme

### 1. Firebase Console'a Gidin
- https://console.firebase.google.com/ adresine gidin
- Google hesabınızla giriş yapın

### 2. Projeyi Seçin
- `cozkazan-app` projesini seçin

### 3. Proje Ayarlarına Gidin
- Sol üst köşedeki ⚙️ (dişli) simgesine tıklayın
- "Proje ayarları" seçeneğini seçin

### 4. Service Accounts Sekmesine Gidin
- Üst menüden "Service accounts" sekmesine tıklayın

### 5. Yeni Private Key Oluşturun
- "Generate new private key" butonuna tıklayın
- Uyarı mesajını onaylayın
- JSON dosyası otomatik olarak indirilecek

### 6. Dosyayı Yerleştirin
- İndirilen JSON dosyasını `backend/cozkazan-app-firebase-adminsdk.json` olarak kaydedin
- **ÖNEMLİ**: Dosya adının tam olarak bu şekilde olması gerekiyor

## 🚀 Adım 2: Veri Aktarımını Başlatma

Service account dosyasını yerleştirdikten sonra:

```bash
cd backend
node migrate-mongo-to-firebase.cjs
```

## 📊 Adım 3: Firebase Console'da Index Oluşturma

Veri aktarımından sonra Firebase Console'da aşağıdaki indexleri oluşturun:

### testler Koleksiyonu İçin:
- `sinifAdi` (Ascending)
- `dersAdi` (Ascending) 
- `konuAdi` (Ascending)

### test_sonuclari Koleksiyonu İçin:
- `userId` (Ascending)
- `cocukId` (Ascending)
- `createdAt` (Descending)

### konular Koleksiyonu İçin:
- `sinifAdi` (Ascending)
- `dersAdi` (Ascending)

## 🧪 Adım 4: Flutter Uygulamasını Test Etme

Veri aktarımı tamamlandıktan sonra:

```bash
cd ..
flutter run -d windows
```

## ❌ Sorun Giderme

### "Service account dosyası bulunamadı" Hatası
- JSON dosyasının `backend/` klasöründe olduğundan emin olun
- Dosya adının `cozkazan-app-firebase-adminsdk.json` olduğunu kontrol edin

### "Permission denied" Hatası
- Firebase Console'da Authentication > Sign-in method > Service accounts bölümünden API'yi etkinleştirin

### "Index required" Hatası
- Firebase Console > Firestore Database > Indexes bölümünden gerekli indexleri oluşturun

## 📈 Beklenen Sonuç

Başarılı veri aktarımından sonra:
- ✅ 4 Sınıf
- ✅ 16 Ders  
- ✅ 48 Konu
- ✅ 147 Test
- ✅ 158 Soru
- ✅ 496 Test Havuzu
- ✅ 15 Hikaye
- ✅ 3 Kullanıcı
- ✅ Veli test ayarları

Tüm veriler Firebase'e aktarıldıktan sonra Flutter uygulaması tamamen Firebase kullanacak! 