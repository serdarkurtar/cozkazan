# 🔥 Firebase Console'da Manuel Index Oluşturma

## 📋 Adım 1: Firebase Console'a Gidin
1. https://console.firebase.google.com/ adresine gidin
2. `cozkazan-app` projesini seçin

## 📋 Adım 2: Firestore Database'e Gidin
1. Sol menüden "Firestore Database" tıklayın
2. "Indexes" sekmesine gidin

## 📋 Adım 3: Gerekli Index'leri Oluşturun

### 1. testler koleksiyonu için:
- **Collection ID:** `testler`
- **Fields:**
  - `sinifAdi` (Ascending)
  - `dersAdi` (Ascending)  
  - `konuAdi` (Ascending)
- **Query scope:** Collection

### 2. test_sonuclari koleksiyonu için:
- **Collection ID:** `test_sonuclari`
- **Fields:**
  - `userId` (Ascending)
  - `cocukId` (Ascending)
  - `createdAt` (Descending)
- **Query scope:** Collection

### 3. konular koleksiyonu için:
- **Collection ID:** `konular`
- **Fields:**
  - `sinifAdi` (Ascending)
  - `dersAdi` (Ascending)
- **Query scope:** Collection

### 4. dersler koleksiyonu için:
- **Collection ID:** `dersler`
- **Fields:**
  - `sinifAdi` (Ascending)
- **Query scope:** Collection

## 📋 Adım 4: Index'leri Oluşturma
1. "Create Index" butonuna tıklayın
2. Yukarıdaki ayarları girin
3. "Create" butonuna tıklayın
4. Her index için tekrarlayın

## ⏱️ Bekleme Süresi
- Index'ler oluşturulurken "Building" durumunda olacak
- Bu işlem 1-5 dakika sürebilir
- Index'ler hazır olduğunda "Enabled" durumuna geçecek

## ✅ Kontrol
Index'ler hazır olduktan sonra Flutter uygulaması Firebase'den veri çekebilecek.

## 🔍 Test Etme
Index'ler hazır olduktan sonra:
1. Flutter uygulamasını açın
2. Veli panelinde test seçimi yapın
3. Çocuk panelinde testlerin görünüp görünmediğini kontrol edin

## 🚨 ÖNEMLİ
Eğer hala index hatası alıyorsanız, Firebase Console'da:
1. "Indexes" sekmesinde tüm index'lerin "Enabled" durumunda olduğunu kontrol edin
2. Hata mesajındaki linke tıklayarak eksik index'i otomatik oluşturun 