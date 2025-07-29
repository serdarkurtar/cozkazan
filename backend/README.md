# ÇözKazan Backend

Çocuk eğitim uygulaması için Node.js backend sistemi.

## 🚀 Başlatma

```bash
cd backend
node index.js
```

Sunucu http://localhost:3000 adresinde çalışacak.

## 📁 Dosya Yapısı

```
backend/
├── index.js              # Ana sunucu dosyası
├── models/               # MongoDB modelleri
├── routes/               # API route'ları
├── public/               # HTML dosyaları
│   ├── yonetim.html      # Ana yönetim paneli
│   ├── test-yonetim.html # Test yönetimi
│   ├── toplu-test-yukle.html # Excel yükleme
│   └── test-duzenle.html # Test düzenleme
├── data/                 # Veri yükleme scriptleri
└── utils/                # Yardımcı fonksiyonlar
```

## 🔗 Ana Linkler

- **Yönetim Paneli**: http://localhost:3000/yonetim
- **Admin Panel**: http://localhost:3000/admin

## 📊 API Endpoints

- `GET /api/siniflar` - Tüm sınıfları getir
- `GET /api/dersler?sinifId=...` - Sınıfa ait dersleri getir
- `GET /api/konular?dersId=...` - Derse ait konuları getir
- `GET /api/testler/:konuId` - Konuya ait testleri getir
- `POST /api/toplu-test-yukle` - Excel'den toplu test yükle
- `DELETE /api/testler/:testId` - Test sil

## 🎯 Özellikler

- ✅ Hiyerarşik yönetim paneli (Sınıf → Ders → Konu → Test)
- ✅ Excel'den toplu test yükleme
- ✅ Test düzenleme ve silme
- ✅ Modern ve kullanıcı dostu arayüz
- ✅ MongoDB veritabanı entegrasyonu 