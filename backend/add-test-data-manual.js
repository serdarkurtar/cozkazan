// Firebase Console'da manuel olarak eklenebilecek test verileri
// Bu verileri Firebase Console > Firestore > Data > Start collection ile ekleyin

console.log('📋 Firebase Console\'da manuel olarak eklenecek veriler:');
console.log('');

console.log('1️⃣ DERSLER Collection:');
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

dersler.forEach((ders, index) => {
  console.log(`Ders ${index + 1}:`);
  console.log(JSON.stringify(ders, null, 2));
  console.log('');
});

console.log('2️⃣ KONULAR Collection:');
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
  },
  {
    ad: 'Çıkarma İşlemi',
    dersAdi: 'Matematik',
    sinifAdi: '2. Sınıf',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

konular.forEach((konu, index) => {
  console.log(`Konu ${index + 1}:`);
  console.log(JSON.stringify(konu, null, 2));
  console.log('');
});

console.log('3️⃣ TESTLER Collection:');
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
  }
];

testler.forEach((test, index) => {
  console.log(`Test ${index + 1}:`);
  console.log(JSON.stringify(test, null, 2));
  console.log('');
});

console.log('📋 EKLEME TALİMATLARI:');
console.log('');
console.log('1. https://console.firebase.google.com/project/cozkazan-app/firestore adresine gidin');
console.log('2. "Start collection" tıklayın');
console.log('3. Collection ID: "dersler" yazın');
console.log('4. Document ID: Auto-ID seçin');
console.log('5. Yukarıdaki ders verilerini tek tek ekleyin');
console.log('6. Aynı şekilde "konular" ve "testler" collection\'larını oluşturun');
console.log('');
console.log('🔧 INDEX OLUŞTURMA:');
console.log('1. Firestore > Indexes sekmesine gidin');
console.log('2. "Create index" tıklayın');
console.log('3. Collection ID: "testler"');
console.log('4. Fields: sinifAdi (Ascending), dersAdi (Ascending), konuAdi (Ascending)');
console.log('5. "Create" tıklayın'); 