// Firebase Console'da manuel olarak eklemek için test verileri
const testData = {
  dersler: [
    { ad: 'Türkçe', sinifAdi: '1. Sınıf' },
    { ad: 'Matematik', sinifAdi: '1. Sınıf' },
    { ad: 'Hayat Bilgisi', sinifAdi: '1. Sınıf' },
    { ad: 'Türkçe', sinifAdi: '2. Sınıf' },
    { ad: 'Matematik', sinifAdi: '2. Sınıf' },
    { ad: 'Hayat Bilgisi', sinifAdi: '2. Sınıf' },
    { ad: 'Türkçe', sinifAdi: '3. Sınıf' },
    { ad: 'Matematik', sinifAdi: '3. Sınıf' },
    { ad: 'Fen Bilimleri', sinifAdi: '3. Sınıf' },
    { ad: 'Türkçe', sinifAdi: '4. Sınıf' },
    { ad: 'Matematik', sinifAdi: '4. Sınıf' },
    { ad: 'Fen Bilimleri', sinifAdi: '4. Sınıf' },
  ],
  konular: [
    { ad: 'Atamızın İzinde', dersAdi: 'Türkçe', sinifAdi: '2. Sınıf' },
    { ad: 'Çevremizdeki Yaşam', dersAdi: 'Hayat Bilgisi', sinifAdi: '2. Sınıf' },
    { ad: 'Toplama İşlemi', dersAdi: 'Matematik', sinifAdi: '2. Sınıf' },
    { ad: 'Çıkarma İşlemi', dersAdi: 'Matematik', sinifAdi: '2. Sınıf' },
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
        }
      ]
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
      ]
    }
  ]
};

console.log('Firebase Console\'da eklemek için test verileri:');
console.log('\n=== DERSLER ===');
testData.dersler.forEach((ders, index) => {
  console.log(`${index + 1}. ${ders.sinifAdi} - ${ders.ad}`);
});

console.log('\n=== KONULAR ===');
testData.konular.forEach((konu, index) => {
  console.log(`${index + 1}. ${konu.sinifAdi} ${konu.dersAdi} - ${konu.ad}`);
});

console.log('\n=== TESTLER ===');
testData.testler.forEach((test, index) => {
  console.log(`${index + 1}. ${test.ad} (${test.soruSayisi} soru)`);
});

console.log('\nFirebase Console\'da bu verileri ekleyin:');
console.log('1. https://console.firebase.google.com/project/cozkazan-app/firestore');
console.log('2. "Start collection" tıklayın');
console.log('3. Collection ID: "dersler"');
console.log('4. Her ders için bir document ekleyin');
console.log('5. Aynı şekilde "konular" ve "testler" koleksiyonları oluşturun'); 