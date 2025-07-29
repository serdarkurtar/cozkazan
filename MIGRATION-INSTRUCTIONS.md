# 🔄 MONGODB'DEN FIREBASE'E VERİ AKTARIMI

## 📊 Mevcut Durum
MongoDB'de şu veriler bulunuyor:
- ✅ 48 Konu
- ✅ 147 Test  
- ✅ 158 Soru
- ✅ 496 Test Havuzu
- ✅ 15 Hikaye
- ✅ 37 Koleksiyon

## 🔥 Firebase Service Account Key Gerekli

### Adım 1: Firebase Console'a Gidin
1. https://console.firebase.google.com/ adresine gidin
2. `cozkazan-app` projesini seçin

### Adım 2: Service Account Key İndirin
1. Sol menüden ⚙️ (Ayarlar) > "Proje ayarları" tıklayın
2. "Service accounts" sekmesine gidin
3. "Generate new private key" butonuna tıklayın
4. JSON dosyasını indirin

### Adım 3: Dosyayı Yerleştirin
1. İndirilen JSON dosyasının içeriğini kopyalayın
2. `backend/cozkazan-app-firebase-adminsdk.json` dosyasını açın
3. Tüm içeriği silin ve kopyaladığınız gerçek JSON içeriğini yapıştırın
4. Dosyayı kaydedin

### Adım 4: Veri Aktarımını Başlatın
```bash
cd backend
node migrate-mongo-to-firebase.cjs
```

## 📈 Beklenen Sonuç
Aktarım tamamlandıktan sonra Firebase'de şu koleksiyonlar oluşacak:
- `siniflar` - 4 sınıf
- `dersler` - 16 ders
- `konular` - 48 konu
- `testler` - 147 test
- `sorular` - 158 soru
- `test_havuzlari` - 496 test havuzu
- `hikayeler` - 15 hikaye
- `kullanicilar` - 3 kullanıcı (parent_1, child_1, child_2)

## 🔧 Firebase Console'da Index Oluşturma
Aktarım tamamlandıktan sonra şu indexleri oluşturun:

### testler koleksiyonu için:
- `sinifAdi` (Ascending)
- `dersAdi` (Ascending)  
- `konuAdi` (Ascending)

### test_sonuclari koleksiyonu için:
- `userId` (Ascending)
- `cocukId` (Ascending)
- `createdAt` (Descending)

## ✅ Tamamlandıktan Sonra
1. Flutter uygulaması tamamen Firebase kullanacak
2. MongoDB'ye ihtiyaç kalmayacak
3. Admin panel test havuzları görünecek
4. Test yükleme sayfası çalışacak

## ⚠️ ÖNEMLİ
- Firebase service account key'i gerçek değerler içermeli
- Dosya adı tam olarak `cozkazan-app-firebase-adminsdk.json` olmalı
- Aktarım sırasında internet bağlantısı kesilmemeli 