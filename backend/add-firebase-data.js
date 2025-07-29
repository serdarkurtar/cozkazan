const admin = require('firebase-admin');

// Firebase Admin SDK başlatma (Application Default Credentials kullan)
admin.initializeApp({
  projectId: 'cozkazan-app'
});

const db = admin.firestore();

async function addTestData() {
  try {
    console.log('🔥 Firebase\'e test verileri ekleniyor...');

    // Test dersleri
    const dersler = [
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
    ];

    console.log('📚 Dersler ekleniyor...');
    for (const ders of dersler) {
      await db.collection('dersler').add({
        ...ders,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${dersler.length} ders eklendi`);

    // Test konuları
    const konular = [
      { ad: 'Atamızın İzinde', dersAdi: 'Türkçe', sinifAdi: '2. Sınıf' },
      { ad: 'Çevremizdeki Yaşam', dersAdi: 'Hayat Bilgisi', sinifAdi: '2. Sınıf' },
      { ad: 'Toplama İşlemi', dersAdi: 'Matematik', sinifAdi: '2. Sınıf' },
      { ad: 'Çıkarma İşlemi', dersAdi: 'Matematik', sinifAdi: '2. Sınıf' },
      { ad: 'Güzel Davranışlarımız', dersAdi: 'Türkçe', sinifAdi: '1. Sınıf' },
      { ad: 'Sayılar ve Nicelikler', dersAdi: 'Matematik', sinifAdi: '1. Sınıf' },
      { ad: 'Ben ve Okulum', dersAdi: 'Hayat Bilgisi', sinifAdi: '1. Sınıf' },
    ];

    console.log('📖 Konular ekleniyor...');
    for (const konu of konular) {
      await db.collection('konular').add({
        ...konu,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${konular.length} konu eklendi`);

    // Test testleri
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
          },
          {
            soru: 'Bitkiler hangi işlemi yapar?',
            secenekler: ['Fotosentez', 'Solunum', 'Büyüme', 'Hepsi'],
            dogruCevap: 3
          }
        ]
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
        ]
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
        ]
      }
    ];

    console.log('📝 Testler ekleniyor...');
    for (const test of testler) {
      await db.collection('testler').add({
        ...test,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${testler.length} test eklendi`);

    // Test hikayeleri
    const hikayeler = [
      {
        baslik: 'Küçük Kaşif',
        icerik: 'Bir zamanlar küçük bir çocuk vardı. Her gün yeni şeyler keşfetmeyi çok severdi...',
        yasGrubu: '7-8',
        kategori: 'Macera',
        resimUrl: 'https://example.com/hikaye1.jpg'
      },
      {
        baslik: 'Matematik Ormanı',
        icerik: 'Ormanın derinliklerinde sayılar yaşardı. Her sayının kendine özgü bir kişiliği vardı...',
        yasGrubu: '7-8',
        kategori: 'Eğitici',
        resimUrl: 'https://example.com/hikaye2.jpg'
      }
    ];

    console.log('📚 Hikayeler ekleniyor...');
    for (const hikaye of hikayeler) {
      await db.collection('hikayeler').add({
        ...hikaye,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${hikayeler.length} hikaye eklendi`);

    // Test ödülleri
    const oduller = [
      {
        ad: 'Altın Rozet',
        aciklama: 'Mükemmel performans için',
        puan: 100,
        resimUrl: 'https://example.com/rozet1.jpg'
      },
      {
        ad: 'Gümüş Rozet',
        aciklama: 'İyi performans için',
        puan: 50,
        resimUrl: 'https://example.com/rozet2.jpg'
      },
      {
        ad: 'Bronz Rozet',
        aciklama: 'Başarılı performans için',
        puan: 25,
        resimUrl: 'https://example.com/rozet3.jpg'
      }
    ];

    console.log('🏆 Ödüller ekleniyor...');
    for (const odul of oduller) {
      await db.collection('oduller').add({
        ...odul,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${oduller.length} ödül eklendi`);

    console.log('\n🎉 Tüm test verileri başarıyla eklendi!');
    console.log('\n📊 Özet:');
    console.log(`- ${dersler.length} ders`);
    console.log(`- ${konular.length} konu`);
    console.log(`- ${testler.length} test`);
    console.log(`- ${hikayeler.length} hikaye`);
    console.log(`- ${oduller.length} ödül`);
    
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    process.exit(0);
  }
}

addTestData(); 