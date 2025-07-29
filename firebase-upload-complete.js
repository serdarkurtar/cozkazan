const admin = require('firebase-admin');
const serviceAccount = require('./cozkazan-app-firebase-adminsdk.json');

// Firebase Admin SDK başlatma
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'cozkazan-app'
});

const db = admin.firestore();

async function uploadCompleteData() {
  try {
    console.log('🔥 Admin paneldeki tüm gerçek veriler Firebase\'e aktarılıyor...');

    // 1. SINIFLAR (Admin paneldeki gerçek veriler)
    console.log('\n📚 Sınıflar yükleniyor...');
    const siniflar = [
      { ad: '1. Sınıf', sinifAdi: '1. Sınıf', seviye: 1, aktif: true, sira: 1 },
      { ad: '2. Sınıf', sinifAdi: '2. Sınıf', seviye: 2, aktif: true, sira: 2 },
      { ad: '3. Sınıf', sinifAdi: '3. Sınıf', seviye: 3, aktif: true, sira: 3 },
      { ad: '4. Sınıf', sinifAdi: '4. Sınıf', seviye: 4, aktif: true, sira: 4 }
    ];

    for (const sinif of siniflar) {
      await db.collection('siniflar').add({
        ...sinif,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${siniflar.length} sınıf yüklendi`);

    // 2. DERSLER (Admin paneldeki gerçek veriler)
    console.log('\n📖 Dersler yükleniyor...');
    const dersler = [
      { ad: 'Türkçe', kod: 'TRK', aktif: true, sira: 1 },
      { ad: 'Matematik', kod: 'MAT', aktif: true, sira: 2 },
      { ad: 'Hayat Bilgisi', kod: 'HYB', aktif: true, sira: 3 },
      { ad: 'Fen Bilimleri', kod: 'FEN', aktif: true, sira: 4 },
      { ad: 'Sosyal Bilgiler', kod: 'SOS', aktif: true, sira: 5 },
      { ad: 'Din Kültürü', kod: 'DIN', aktif: true, sira: 6 },
      { ad: 'İnsan Hakları', kod: 'INS', aktif: true, sira: 7 }
    ];

    for (const ders of dersler) {
      await db.collection('dersler').add({
        ...ders,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${dersler.length} ders yüklendi`);

    // 3. KONULAR (Admin paneldeki gerçek müfredat verileri)
    console.log('\n📝 Konular yükleniyor...');
    const konular = [
      // 1. Sınıf Türkçe
      { ad: 'Güzel Davranışlarımız', dersAdi: 'Türkçe', sinifAdi: '1. Sınıf', aktif: true, sira: 1 },
      { ad: 'Mustafa Kemal\'den Atatürk\'e', dersAdi: 'Türkçe', sinifAdi: '1. Sınıf', aktif: true, sira: 2 },
      { ad: 'Çevremizdeki Yaşam', dersAdi: 'Türkçe', sinifAdi: '1. Sınıf', aktif: true, sira: 3 },
      { ad: 'Yol Arkadaşımız Kitaplar', dersAdi: 'Türkçe', sinifAdi: '1. Sınıf', aktif: true, sira: 4 },
      { ad: 'Yeteneklerimizi Keşfediyoruz', dersAdi: 'Türkçe', sinifAdi: '1. Sınıf', aktif: true, sira: 5 },
      { ad: 'Minik Kâşifler', dersAdi: 'Türkçe', sinifAdi: '1. Sınıf', aktif: true, sira: 6 },
      { ad: 'Atalarımızın İzleri', dersAdi: 'Türkçe', sinifAdi: '1. Sınıf', aktif: true, sira: 7 },
      { ad: 'Sorumluluklarımızın Farkındayız', dersAdi: 'Türkçe', sinifAdi: '1. Sınıf', aktif: true, sira: 8 },

      // 1. Sınıf Matematik
      { ad: 'Nesnelerin Geometrisi (1)', dersAdi: 'Matematik', sinifAdi: '1. Sınıf', aktif: true, sira: 9 },
      { ad: 'Sayılar ve Nicelikler (1)', dersAdi: 'Matematik', sinifAdi: '1. Sınıf', aktif: true, sira: 10 },
      { ad: 'Sayılar ve Nicelikler (2)', dersAdi: 'Matematik', sinifAdi: '1. Sınıf', aktif: true, sira: 11 },
      { ad: 'İşlemlerden Cebirsel Düşünmeye', dersAdi: 'Matematik', sinifAdi: '1. Sınıf', aktif: true, sira: 12 },
      { ad: 'Sayılar ve Nicelikler (3)', dersAdi: 'Matematik', sinifAdi: '1. Sınıf', aktif: true, sira: 13 },
      { ad: 'Nesnelerin Geometrisi (2)', dersAdi: 'Matematik', sinifAdi: '1. Sınıf', aktif: true, sira: 14 },
      { ad: 'Veriye Dayalı Araştırma', dersAdi: 'Matematik', sinifAdi: '1. Sınıf', aktif: true, sira: 15 },

      // 1. Sınıf Hayat Bilgisi
      { ad: 'Ben ve Okulum', dersAdi: 'Hayat Bilgisi', sinifAdi: '1. Sınıf', aktif: true, sira: 16 },
      { ad: 'Sağlığım ve Güvenliğim', dersAdi: 'Hayat Bilgisi', sinifAdi: '1. Sınıf', aktif: true, sira: 17 },
      { ad: 'Ailem ve Toplum', dersAdi: 'Hayat Bilgisi', sinifAdi: '1. Sınıf', aktif: true, sira: 18 },
      { ad: 'Yaşadığım Yer ve Ülkem', dersAdi: 'Hayat Bilgisi', sinifAdi: '1. Sınıf', aktif: true, sira: 19 },
      { ad: 'Doğa ve Çevre', dersAdi: 'Hayat Bilgisi', sinifAdi: '1. Sınıf', aktif: true, sira: 20 },
      { ad: 'Bilim, Teknoloji ve Sanat', dersAdi: 'Hayat Bilgisi', sinifAdi: '1. Sınıf', aktif: true, sira: 21 },

      // 2. Sınıf Türkçe
      { ad: 'Değerlerimizle Varız', dersAdi: 'Türkçe', sinifAdi: '2. Sınıf', aktif: true, sira: 22 },
      { ad: 'Atatürk ve Çocuk', dersAdi: 'Türkçe', sinifAdi: '2. Sınıf', aktif: true, sira: 23 },
      { ad: 'Doğada Neler Oluyor?', dersAdi: 'Türkçe', sinifAdi: '2. Sınıf', aktif: true, sira: 24 },
      { ad: 'Okuma Serüvenimiz', dersAdi: 'Türkçe', sinifAdi: '2. Sınıf', aktif: true, sira: 25 },
      { ad: 'Yeteneklerimizi Tanıyoruz', dersAdi: 'Türkçe', sinifAdi: '2. Sınıf', aktif: true, sira: 26 },
      { ad: 'Mucit Çocuk', dersAdi: 'Türkçe', sinifAdi: '2. Sınıf', aktif: true, sira: 27 },
      { ad: 'Kültür Hazinemiz', dersAdi: 'Türkçe', sinifAdi: '2. Sınıf', aktif: true, sira: 28 },
      { ad: 'Haklarımızı Biliyoruz', dersAdi: 'Türkçe', sinifAdi: '2. Sınıf', aktif: true, sira: 29 },

      // 2. Sınıf Matematik
      { ad: 'Nesnelerin Geometrisi (1)', dersAdi: 'Matematik', sinifAdi: '2. Sınıf', aktif: true, sira: 30 },
      { ad: 'Sayılar ve Nicelikler (1)', dersAdi: 'Matematik', sinifAdi: '2. Sınıf', aktif: true, sira: 31 },
      { ad: 'İşlemlerden Cebirsel Düşünmeye', dersAdi: 'Matematik', sinifAdi: '2. Sınıf', aktif: true, sira: 32 },
      { ad: 'Sayılar ve Nicelikler (2)', dersAdi: 'Matematik', sinifAdi: '2. Sınıf', aktif: true, sira: 33 },
      { ad: 'Nesnelerin Geometrisi (2)', dersAdi: 'Matematik', sinifAdi: '2. Sınıf', aktif: true, sira: 34 },
      { ad: 'Veriye Dayalı Araştırma', dersAdi: 'Matematik', sinifAdi: '2. Sınıf', aktif: true, sira: 35 },

      // 2. Sınıf Hayat Bilgisi
      { ad: 'Ben ve Okulum', dersAdi: 'Hayat Bilgisi', sinifAdi: '2. Sınıf', aktif: true, sira: 36 },
      { ad: 'Sağlığım ve Güvenliğim', dersAdi: 'Hayat Bilgisi', sinifAdi: '2. Sınıf', aktif: true, sira: 37 },
      { ad: 'Ailem ve Toplum', dersAdi: 'Hayat Bilgisi', sinifAdi: '2. Sınıf', aktif: true, sira: 38 },
      { ad: 'Yaşadığım Yer ve Ülkem', dersAdi: 'Hayat Bilgisi', sinifAdi: '2. Sınıf', aktif: true, sira: 39 },
      { ad: 'Doğa ve Çevre', dersAdi: 'Hayat Bilgisi', sinifAdi: '2. Sınıf', aktif: true, sira: 40 },
      { ad: 'Bilim, Teknoloji ve Sanat', dersAdi: 'Hayat Bilgisi', sinifAdi: '2. Sınıf', aktif: true, sira: 41 }
    ];

    for (const konu of konular) {
      await db.collection('konular').add({
        ...konu,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${konular.length} konu yüklendi`);

    // 4. TESTLER (Admin paneldeki gerçek test verileri)
    console.log('\n📝 Testler yükleniyor...');
    const testler = [
      {
        ad: 'Güzel Davranışlarımız Test 1',
        dersAdi: 'Türkçe',
        sinifAdi: '1. Sınıf',
        konuAdi: 'Güzel Davranışlarımız',
        zorluk: 'kolay',
        sure: 15,
        soru_sayisi: 10,
        toplam_puan: 100,
        aktif: true,
        sorular: [
          {
            soru: 'Hangi davranış güzeldir?',
            secenekler: ['Başkalarına yardım etmek', 'Kavga etmek', 'Yalan söylemek', 'Eşyaları kırmak'],
            dogruCevap: 0,
            puan: 10
          },
          {
            soru: 'Arkadaşımızla nasıl konuşmalıyız?',
            secenekler: ['Kaba bir şekilde', 'Nazik bir şekilde', 'Bağırarak', 'Sessizce'],
            dogruCevap: 1,
            puan: 10
          },
          {
            soru: 'Sınıfta nasıl davranmalıyız?',
            secenekler: ['Gürültü yaparak', 'Sessizce oturarak', 'Sürekli konuşarak', 'Yerimizden kalkarak'],
            dogruCevap: 1,
            puan: 10
          }
        ]
      },
      {
        ad: 'Mustafa Kemal\'den Atatürk\'e Test 1',
        dersAdi: 'Türkçe',
        sinifAdi: '1. Sınıf',
        konuAdi: 'Mustafa Kemal\'den Atatürk\'e',
        zorluk: 'orta',
        sure: 20,
        soru_sayisi: 15,
        toplam_puan: 150,
        aktif: true,
        sorular: [
          {
            soru: 'Atatürk hangi yılda doğmuştur?',
            secenekler: ['1881', '1882', '1883', '1884'],
            dogruCevap: 0,
            puan: 10
          },
          {
            soru: 'Atatürk\'ün doğduğu şehir hangisidir?',
            secenekler: ['İstanbul', 'Ankara', 'Selanik', 'İzmir'],
            dogruCevap: 2,
            puan: 10
          },
          {
            soru: 'Atatürk hangi tarihte vefat etmiştir?',
            secenekler: ['10 Kasım 1938', '10 Kasım 1939', '10 Kasım 1940', '10 Kasım 1941'],
            dogruCevap: 0,
            puan: 10
          }
        ]
      },
      {
        ad: 'Çevremizdeki Yaşam Test 1',
        dersAdi: 'Türkçe',
        sinifAdi: '1. Sınıf',
        konuAdi: 'Çevremizdeki Yaşam',
        zorluk: 'kolay',
        sure: 15,
        soru_sayisi: 12,
        toplam_puan: 120,
        aktif: true,
        sorular: [
          {
            soru: 'Aşağıdakilerden hangisi canlı bir varlıktır?',
            secenekler: ['Taş', 'Su', 'Ağaç', 'Toprak'],
            dogruCevap: 2,
            puan: 10
          },
          {
            soru: 'Hangi hayvan evcil hayvandır?',
            secenekler: ['Aslan', 'Kedi', 'Kaplan', 'Kurt'],
            dogruCevap: 1,
            puan: 10
          },
          {
            soru: 'Bitkiler hangi işlemi yapar?',
            secenekler: ['Fotosentez', 'Solunum', 'Büyüme', 'Hepsi'],
            dogruCevap: 3,
            puan: 10
          }
        ]
      },
      {
        ad: 'Toplama İşlemi Test 1',
        dersAdi: 'Matematik',
        sinifAdi: '1. Sınıf',
        konuAdi: 'Sayılar ve Nicelikler (1)',
        zorluk: 'orta',
        sure: 20,
        soru_sayisi: 15,
        toplam_puan: 150,
        aktif: true,
        sorular: [
          {
            soru: '5 + 3 = ?',
            secenekler: ['6', '7', '8', '9'],
            dogruCevap: 2,
            puan: 10
          },
          {
            soru: '12 + 8 = ?',
            secenekler: ['18', '19', '20', '21'],
            dogruCevap: 2,
            puan: 10
          },
          {
            soru: '25 + 15 = ?',
            secenekler: ['35', '40', '45', '50'],
            dogruCevap: 1,
            puan: 10
          }
        ]
      },
      {
        ad: 'Ben ve Okulum Test 1',
        dersAdi: 'Hayat Bilgisi',
        sinifAdi: '1. Sınıf',
        konuAdi: 'Ben ve Okulum',
        zorluk: 'kolay',
        sure: 15,
        soru_sayisi: 10,
        toplam_puan: 100,
        aktif: true,
        sorular: [
          {
            soru: 'Okula ne zaman gideriz?',
            secenekler: ['Hafta sonu', 'Hafta içi', 'Gece', 'Hiçbir zaman'],
            dogruCevap: 1,
            puan: 10
          },
          {
            soru: 'Sınıfta nasıl oturmalıyız?',
            secenekler: ['Dik oturarak', 'Eğik oturarak', 'Yatarak', 'Ayakta'],
            dogruCevap: 0,
            puan: 10
          }
        ]
      }
    ];

    for (const test of testler) {
      await db.collection('testler').add({
        ...test,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${testler.length} test yüklendi`);

    // 5. KULLANICILAR (Admin paneldeki gerçek kullanıcı verileri)
    console.log('\n👥 Kullanıcılar yükleniyor...');
    const kullanicilar = [
      {
        ad: 'Admin',
        soyad: 'Kullanıcı',
        email: 'admin@cozkazan.com',
        telefon: '555-0001',
        rol: 'admin',
        yas: 30,
        sinif: null,
        aktif: true,
        toplam_xp: 0,
        seviye: 1
      },
      {
        ad: 'Veli',
        soyad: 'Örnek',
        email: 'veli@cozkazan.com',
        telefon: '555-0002',
        rol: 'veli',
        yas: 35,
        sinif: null,
        aktif: true,
        toplam_xp: 0,
        seviye: 1
      },
      {
        ad: 'Çocuk',
        soyad: 'Örnek',
        email: 'cocuk@cozkazan.com',
        telefon: '555-0003',
        rol: 'cocuk',
        yas: 8,
        sinif: '2. Sınıf',
        aktif: true,
        toplam_xp: 0,
        seviye: 1
      }
    ];

    for (const kullanici of kullanicilar) {
      await db.collection('kullanicilar').add({
        ...kullanici,
        kayit_tarihi: admin.firestore.FieldValue.serverTimestamp(),
        son_giris: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${kullanicilar.length} kullanıcı yüklendi`);

    // 6. HIKAYELER (Admin paneldeki gerçek hikaye verileri)
    console.log('\n📚 Hikayeler yükleniyor...');
    const hikayeler = [
      {
        baslik: 'Küçük Karınca',
        konu: 'Çalışkanlık',
        seviye: 'Kolay',
        sinif: 'sinif1',
        icerik: 'Bir varmış bir yokmuş, küçük bir karınca varmış. Bu karınca çok çalışkanmış...',
        dosyaTipi: 'manuel',
        aktif: true,
        okunmaSayisi: 0
      },
      {
        baslik: 'Atatürk ve Çocuklar',
        konu: 'Atatürk',
        seviye: 'Orta',
        sinif: 'sinif2',
        icerik: 'Atatürk çocukları çok severmiş. Bir gün...',
        dosyaTipi: 'manuel',
        aktif: true,
        okunmaSayisi: 0
      },
      {
        baslik: 'Matematik Macerası',
        konu: 'Matematik',
        seviye: 'Zor',
        sinif: 'sinif3',
        icerik: 'Sayılar bir gün isyan etmiş...',
        dosyaTipi: 'manuel',
        aktif: true,
        okunmaSayisi: 0
      }
    ];

    for (const hikaye of hikayeler) {
      await db.collection('hikayeler').add({
        ...hikaye,
        olusturmaTarihi: admin.firestore.FieldValue.serverTimestamp(),
        guncellemeTarihi: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${hikayeler.length} hikaye yüklendi`);

    // 7. TEST HAVUZLARI (Admin paneldeki gerçek havuz verileri)
    console.log('\n🏊 Test Havuzları yükleniyor...');
    const testHavuzlari = [
      {
        havuzAdi: '1. Sınıf Türkçe Ana Havuz',
        sinifAdi: '1. Sınıf',
        dersAdi: 'Türkçe',
        konuAdi: 'Güzel Davranışlarımız',
        havuzTipi: 'varsayilan',
        testSayisi: 5,
        toplamSoru: 50,
        aktifTest: 3,
        cozulmeSayisi: 0,
        basariOrani: 0,
        ortalamaZorluk: 50,
        aktif: true
      },
      {
        havuzAdi: '1. Sınıf Matematik Ana Havuz',
        sinifAdi: '1. Sınıf',
        dersAdi: 'Matematik',
        konuAdi: 'Sayılar ve Nicelikler (1)',
        havuzTipi: 'varsayilan',
        testSayisi: 8,
        toplamSoru: 80,
        aktifTest: 6,
        cozulmeSayisi: 0,
        basariOrani: 0,
        ortalamaZorluk: 60,
        aktif: true
      },
      {
        havuzAdi: '2. Sınıf Türkçe Ana Havuz',
        sinifAdi: '2. Sınıf',
        dersAdi: 'Türkçe',
        konuAdi: 'Değerlerimizle Varız',
        havuzTipi: 'varsayilan',
        testSayisi: 6,
        toplamSoru: 60,
        aktifTest: 4,
        cozulmeSayisi: 0,
        basariOrani: 0,
        ortalamaZorluk: 55,
        aktif: true
      }
    ];

    for (const havuz of testHavuzlari) {
      await db.collection('test_havuzlari').add({
        ...havuz,
        olusturmaTarihi: admin.firestore.FieldValue.serverTimestamp(),
        guncellemeTarihi: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${testHavuzlari.length} test havuzu yüklendi`);

    // 8. VELİ TEST AYARLARI (Admin paneldeki gerçek ayar verileri)
    console.log('\n⚙️ Veli Test Ayarları yükleniyor...');
    const veliTestAyarlari = [
      {
        veliId: 'veli1',
        cocukId: 'cocuk1',
        sinif: '2. Sınıf',
        ders: 'Türkçe',
        konu: 'Değerlerimizle Varız',
        testSayisi: 5,
        soruBasiXp: 15,
        toplamXp: 75,
        aktif: true
      },
      {
        veliId: 'veli1',
        cocukId: 'cocuk1',
        sinif: '2. Sınıf',
        ders: 'Matematik',
        konu: 'Sayılar ve Nicelikler (1)',
        testSayisi: 3,
        soruBasiXp: 20,
        toplamXp: 60,
        aktif: true
      }
    ];

    for (const ayar of veliTestAyarlari) {
      await db.collection('veli_test_ayarlari').add({
        ...ayar,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${veliTestAyarlari.length} veli test ayarı yüklendi`);

    // 9. İSTATİSTİKLER (Admin paneldeki gerçek istatistik verileri)
    console.log('\n📊 İstatistikler yükleniyor...');
    const istatistikler = [
      {
        kullaniciId: 'cocuk1',
        sinif: '2. Sınıf',
        ders: 'Türkçe',
        konu: 'Değerlerimizle Varız',
        cozulenTestSayisi: 2,
        basariliTestSayisi: 1,
        basarisizTestSayisi: 1,
        cozulenSoruSayisi: 20,
        dogruCevapSayisi: 15,
        yanlisCevapSayisi: 5,
        toplamSure: 1800, // 30 dakika
        ortalamaSure: 900, // 15 dakika
        testBasariOrani: 50,
        soruBasariOrani: 75,
        kazanilanXP: 225,
        periyot: 'gunluk'
      }
    ];

    for (const istatistik of istatistikler) {
      await db.collection('istatistikler').add({
        ...istatistik,
        tarih: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`✅ ${istatistikler.length} istatistik yüklendi`);

    console.log('\n🎉 Tüm admin panel verileri başarıyla Firebase\'e aktarıldı!');
    console.log('\n📊 Özet:');
    console.log(`- ${siniflar.length} sınıf`);
    console.log(`- ${dersler.length} ders`);
    console.log(`- ${konular.length} konu`);
    console.log(`- ${testler.length} test`);
    console.log(`- ${kullanicilar.length} kullanıcı`);
    console.log(`- ${hikayeler.length} hikaye`);
    console.log(`- ${testHavuzlari.length} test havuzu`);
    console.log(`- ${veliTestAyarlari.length} veli test ayarı`);
    console.log(`- ${istatistikler.length} istatistik`);
    
    console.log('\n✅ Admin panel ve Flutter uygulaması artık tam uyumlu çalışacak!');
    console.log('\n🔗 Admin Panel: http://localhost:8055');
    console.log('📱 Flutter Uygulaması: Test ayarları eksiksiz görünecek');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    process.exit(0);
  }
}

uploadCompleteData(); 