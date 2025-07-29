// Firebase Console'da manuel olarak eklenecek basit test verileri
console.log('🔥 Firebase Console\'da eklenecek test verileri:');
console.log('');

console.log('1️⃣ DERSLER Collection oluşturun:');
console.log('Collection ID: dersler');
console.log('Document ID: Auto-ID');
console.log('');

const dersler = [
  {
    ad: 'Türkçe',
    sinifAdi: '1. Sınıf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    ad: 'Matematik',
    sinifAdi: '1. Sınıf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    ad: 'Hayat Bilgisi',
    sinifAdi: '1. Sınıf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    ad: 'Türkçe',
    sinifAdi: '2. Sınıf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    ad: 'Matematik',
    sinifAdi: '2. Sınıf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    ad: 'Hayat Bilgisi',
    sinifAdi: '2. Sınıf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

console.log('📋 DERSLER verileri:');
dersler.forEach((ders, index) => {
  console.log(`Ders ${index + 1}:`);
  console.log(JSON.stringify(ders, null, 2));
  console.log('');
});

console.log('2️⃣ KONULAR Collection oluşturun:');
console.log('Collection ID: konular');
console.log('Document ID: Auto-ID');
console.log('');

const konular = [
  {
    ad: 'Atamızın İzinde',
    dersAdi: 'Türkçe',
    sinifAdi: '2. Sınıf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    ad: 'Çevremizdeki Yaşam',
    dersAdi: 'Hayat Bilgisi',
    sinifAdi: '2. Sınıf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    ad: 'Toplama İşlemi',
    dersAdi: 'Matematik',
    sinifAdi: '2. Sınıf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

console.log('📋 KONULAR verileri:');
konular.forEach((konu, index) => {
  console.log(`Konu ${index + 1}:`);
  console.log(JSON.stringify(konu, null, 2));
  console.log('');
});

console.log('3️⃣ TESTLER Collection oluşturun:');
console.log('Collection ID: testler');
console.log('Document ID: Auto-ID');
console.log('');

const testler = [
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
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

console.log('📋 TESTLER verileri:');
testler.forEach((test, index) => {
  console.log(`Test ${index + 1}:`);
  console.log(JSON.stringify(test, null, 2));
  console.log('');
});

console.log('📋 EKLEME ADIMLARI:');
console.log('');
console.log('1. https://console.firebase.google.com/project/cozkazan-app/firestore/data');
console.log('2. "Start collection" tıklayın');
console.log('3. Collection ID: "dersler" yazın');
console.log('4. Document ID: Auto-ID seçin');
console.log('5. Yukarıdaki ders verilerini tek tek ekleyin');
console.log('6. Aynı şekilde "konular" ve "testler" collection\'larını oluşturun');
console.log('');
console.log('🔧 INDEX OLUŞTURMA:');
console.log('1. Firestore > Indexes sekmesine gidin');
console.log('2. "Create index" tıklayın');
console.log('3. Collection ID: "test_sonuclari"');
console.log('4. Fields: userId (Ascending), createdAt (Descending)');
console.log('5. "Create" tıklayın');
console.log('');
console.log('✅ Bu adımları tamamladıktan sonra Flutter uygulaması çalışacak!'); 