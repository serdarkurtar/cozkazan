const fs = require('fs');

// Firebase Console'da import edilebilecek veriler
const firebaseData = {
  dersler: [
    { ad: 'Türkçe', sinifAdi: '1. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Matematik', sinifAdi: '1. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Hayat Bilgisi', sinifAdi: '1. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Türkçe', sinifAdi: '2. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Matematik', sinifAdi: '2. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Hayat Bilgisi', sinifAdi: '2. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Türkçe', sinifAdi: '3. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Matematik', sinifAdi: '3. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Fen Bilimleri', sinifAdi: '3. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Türkçe', sinifAdi: '4. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Matematik', sinifAdi: '4. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Fen Bilimleri', sinifAdi: '4. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  konular: [
    { ad: 'Atamızın İzinde', dersAdi: 'Türkçe', sinifAdi: '2. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Çevremizdeki Yaşam', dersAdi: 'Hayat Bilgisi', sinifAdi: '2. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Toplama İşlemi', dersAdi: 'Matematik', sinifAdi: '2. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Çıkarma İşlemi', dersAdi: 'Matematik', sinifAdi: '2. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Güzel Davranışlarımız', dersAdi: 'Türkçe', sinifAdi: '1. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Sayılar ve Nicelikler', dersAdi: 'Matematik', sinifAdi: '1. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    { ad: 'Ben ve Okulum', dersAdi: 'Hayat Bilgisi', sinifAdi: '1. Sınıf', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  ],
  testler: [
    {
      ad: 'Atamızın İzinde Test 1',
      dersAdi: 'Türkçe',
      sinifAdi: '2. Sınıf',
      konuAdi: 'Atamızın İzinde',
      sorular: [
        {
          soru: 'Atatürk hangi yılda doğmuştur?',
          secenekler: ['1881', '1882', '1883', '1884'],
          dogruCevap: 0
        },
        {
          soru: 'Atatürk\'ün doğduğu şehir hangisidir?',
          secenekler: ['İstanbul', 'Ankara', 'Selanik', 'İzmir'],
          dogruCevap: 2
        },
        {
          soru: 'Atatürk hangi tarihte vefat etmiştir?',
          secenekler: ['10 Kasım 1938', '10 Kasım 1939', '10 Kasım 1940', '10 Kasım 1941'],
          dogruCevap: 0
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      ad: 'Çevremizdeki Yaşam Test 1',
      dersAdi: 'Hayat Bilgisi',
      sinifAdi: '2. Sınıf',
      konuAdi: 'Çevremizdeki Yaşam',
      sorular: [
        {
          soru: 'Aşağıdakilerden hangisi canlı bir varlıktır?',
          secenekler: ['Taş', 'Su', 'Ağaç', 'Toprak'],
          dogruCevap: 2
        },
        {
          soru: 'Hangi hayvan evcil hayvandır?',
          secenekler: ['Aslan', 'Kedi', 'Kaplan', 'Kurt'],
          dogruCevap: 1
        },
        {
          soru: 'Bitkiler hangi işlemi yapar?',
          secenekler: ['Fotosentez', 'Solunum', 'Büyüme', 'Hepsi'],
          dogruCevap: 3
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      ad: 'Toplama İşlemi Test 1',
      dersAdi: 'Matematik',
      sinifAdi: '2. Sınıf',
      konuAdi: 'Toplama İşlemi',
      sorular: [
        {
          soru: '5 + 3 = ?',
          secenekler: ['6', '7', '8', '9'],
          dogruCevap: 2
        },
        {
          soru: '12 + 8 = ?',
          secenekler: ['18', '19', '20', '21'],
          dogruCevap: 2
        },
        {
          soru: '25 + 15 = ?',
          secenekler: ['35', '40', '45', '50'],
          dogruCevap: 1
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      ad: 'Çıkarma İşlemi Test 1',
      dersAdi: 'Matematik',
      sinifAdi: '2. Sınıf',
      konuAdi: 'Çıkarma İşlemi',
      sorular: [
        {
          soru: '10 - 4 = ?',
          secenekler: ['4', '5', '6', '7'],
          dogruCevap: 2
        },
        {
          soru: '20 - 8 = ?',
          secenekler: ['10', '11', '12', '13'],
          dogruCevap: 2
        },
        {
          soru: '30 - 15 = ?',
          secenekler: ['10', '15', '20', '25'],
          dogruCevap: 1
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};

// JSON dosyalarına kaydet
fs.writeFileSync('firebase-dersler.json', JSON.stringify(firebaseData.dersler, null, 2));
fs.writeFileSync('firebase-konular.json', JSON.stringify(firebaseData.konular, null, 2));
fs.writeFileSync('firebase-testler.json', JSON.stringify(firebaseData.testler, null, 2));

console.log('✅ Firebase import dosyaları oluşturuldu:');
console.log('- firebase-dersler.json');
console.log('- firebase-konular.json');
console.log('- firebase-testler.json');
console.log('\n📋 Firebase Console\'da import etmek için:');
console.log('1. https://console.firebase.google.com/project/cozkazan-app/firestore');
console.log('2. "Import JSON" tıklayın');
console.log('3. Oluşturulan JSON dosyalarını seçin');
console.log('4. Collection ID\'leri belirtin: dersler, konular, testler'); 