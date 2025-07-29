const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, setDoc, doc } = require('firebase/firestore');

// Firebase config (web config)
const firebaseConfig = {
  apiKey: "AIzaSyC4lhsmEH8OQWlkUfSR0a3jvY0_EHiXEiA",
  authDomain: "cozkazan-app.firebaseapp.com",
  projectId: "cozkazan-app",
  storageBucket: "cozkazan-app.firebasestorage.app",
  messagingSenderId: "846053857270",
  appId: "1:846053857270:web:d2ba3637824325d5e519d7",
  measurementId: "G-DZ0NNZHW7S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sınıflar
const siniflar = [
  { id: '1', ad: '1. Sınıf' },
  { id: '2', ad: '2. Sınıf' },
  { id: '3', ad: '3. Sınıf' },
  { id: '4', ad: '4. Sınıf' }
];

// Dersler
const dersler = [
  { id: 'turkce', ad: 'Türkçe' },
  { id: 'matematik', ad: 'Matematik' },
  { id: 'hayat-bilgisi', ad: 'Hayat Bilgisi' },
  { id: 'fen-bilimleri', ad: 'Fen Bilimleri' },
  { id: 'sosyal-bilgiler', ad: 'Sosyal Bilgiler' },
  { id: 'din-kulturu', ad: 'Din Kültürü' },
  { id: 'insan-haklari', ad: 'İnsan Hakları' }
];

// Sınıf-Ders ilişkileri
const sinifDersListesi = {
  '1. Sınıf': ['Türkçe', 'Matematik', 'Hayat Bilgisi'],
  '2. Sınıf': ['Türkçe', 'Matematik', 'Hayat Bilgisi'],
  '3. Sınıf': ['Türkçe', 'Matematik', 'Hayat Bilgisi', 'Fen Bilimleri'],
  '4. Sınıf': ['Türkçe', 'Matematik', 'Hayat Bilgisi', 'Fen Bilimleri', 'Sosyal Bilgiler']
};

// Konular (her sınıf için)
const konular = {
  '1. Sınıf': {
    'Türkçe': ['Okuma', 'Yazma', 'Dinleme', 'Konuşma'],
    'Matematik': ['Sayılar', 'Geometri', 'Ölçme', 'Veri İşleme'],
    'Hayat Bilgisi': ['Okul Heyecanım', 'Benim Eşsiz Yuvam', 'Dün, Bugün, Yarın']
  },
  '2. Sınıf': {
    'Türkçe': ['Okuma', 'Yazma', 'Dinleme', 'Konuşma'],
    'Matematik': ['Sayılar', 'Geometri', 'Ölçme', 'Veri İşleme'],
    'Hayat Bilgisi': ['Okul Heyecanım', 'Benim Eşsiz Yuvam', 'Dün, Bugün, Yarın']
  },
  '3. Sınıf': {
    'Türkçe': ['Okuma', 'Yazma', 'Dinleme', 'Konuşma'],
    'Matematik': ['Sayılar', 'Geometri', 'Ölçme', 'Veri İşleme'],
    'Hayat Bilgisi': ['Okul Heyecanım', 'Benim Eşsiz Yuvam', 'Dün, Bugün, Yarın'],
    'Fen Bilimleri': ['Madde ve Doğası', 'Canlılar ve Hayat', 'Fiziksel Olaylar']
  },
  '4. Sınıf': {
    'Türkçe': ['Okuma', 'Yazma', 'Dinleme', 'Konuşma'],
    'Matematik': ['Sayılar', 'Geometri', 'Ölçme', 'Veri İşleme'],
    'Hayat Bilgisi': ['Okul Heyecanım', 'Benim Eşsiz Yuvam', 'Dün, Bugün, Yarın'],
    'Fen Bilimleri': ['Madde ve Doğası', 'Canlılar ve Hayat', 'Fiziksel Olaylar'],
    'Sosyal Bilgiler': ['Birey ve Toplum', 'Kültür ve Miras', 'İnsanlar, Yerler ve Çevreler']
  }
};

// Testler (her konu için)
const testler = {
  'Okuma': ['Okuma Test 1', 'Okuma Test 2', 'Okuma Test 3'],
  'Yazma': ['Yazma Test 1', 'Yazma Test 2', 'Yazma Test 3'],
  'Dinleme': ['Dinleme Test 1', 'Dinleme Test 2', 'Dinleme Test 3'],
  'Konuşma': ['Konuşma Test 1', 'Konuşma Test 2', 'Konuşma Test 3'],
  'Sayılar': ['Sayılar Test 1', 'Sayılar Test 2', 'Sayılar Test 3'],
  'Geometri': ['Geometri Test 1', 'Geometri Test 2', 'Geometri Test 3'],
  'Ölçme': ['Ölçme Test 1', 'Ölçme Test 2', 'Ölçme Test 3'],
  'Veri İşleme': ['Veri İşleme Test 1', 'Veri İşleme Test 2', 'Veri İşleme Test 3'],
  'Okul Heyecanım': ['Okul Heyecanım Test 1', 'Okul Heyecanım Test 2', 'Okul Heyecanım Test 3'],
  'Benim Eşsiz Yuvam': ['Benim Eşsiz Yuvam Test 1', 'Benim Eşsiz Yuvam Test 2', 'Benim Eşsiz Yuvam Test 3'],
  'Dün, Bugün, Yarın': ['Dün, Bugün, Yarın Test 1', 'Dün, Bugün, Yarın Test 2', 'Dün, Bugün, Yarın Test 3'],
  'Madde ve Doğası': ['Madde ve Doğası Test 1', 'Madde ve Doğası Test 2', 'Madde ve Doğası Test 3'],
  'Canlılar ve Hayat': ['Canlılar ve Hayat Test 1', 'Canlılar ve Hayat Test 2', 'Canlılar ve Hayat Test 3'],
  'Fiziksel Olaylar': ['Fiziksel Olaylar Test 1', 'Fiziksel Olaylar Test 2', 'Fiziksel Olaylar Test 3'],
  'Birey ve Toplum': ['Birey ve Toplum Test 1', 'Birey ve Toplum Test 2', 'Birey ve Toplum Test 3'],
  'Kültür ve Miras': ['Kültür ve Miras Test 1', 'Kültür ve Miras Test 2', 'Kültür ve Miras Test 3'],
  'İnsanlar, Yerler ve Çevreler': ['İnsanlar, Yerler ve Çevreler Test 1', 'İnsanlar, Yerler ve Çevreler Test 2', 'İnsanlar, Yerler ve Çevreler Test 3']
};

// Kullanıcılar
const kullanicilar = [
  { id: 'parent_1', ad: 'Veli 1', tip: 'veli', email: 'veli1@example.com' },
  { id: 'child_1', ad: 'Çocuk 1', tip: 'cocuk', email: 'cocuk1@example.com' },
  { id: 'child_2', ad: 'Çocuk 2', tip: 'cocuk', email: 'cocuk2@example.com' }
];

async function addDataToFirebase() {
  try {
    console.log('🔥 Firebase\'e veri ekleniyor...');

    // Sınıfları ekle
    console.log('📚 Sınıflar ekleniyor...');
    for (const sinif of siniflar) {
      await setDoc(doc(db, 'siniflar', sinif.id), sinif);
    }

    // Dersleri ekle
    console.log('📖 Dersler ekleniyor...');
    for (const ders of dersler) {
      await setDoc(doc(db, 'dersler', ders.id), ders);
    }

    // Sınıf-Ders listesini ekle
    console.log('📋 Sınıf-Ders listesi ekleniyor...');
    await setDoc(doc(db, 'sinif_ders_listesi', 'main'), { liste: sinifDersListesi });

    // Konuları ekle
    console.log('📝 Konular ekleniyor...');
    for (const [sinifAdi, dersler] of Object.entries(konular)) {
      for (const [dersAdi, konuListesi] of Object.entries(dersler)) {
        for (const konuAdi of konuListesi) {
          await addDoc(collection(db, 'konular'), {
            ad: konuAdi,
            sinifAdi: sinifAdi,
            dersAdi: dersAdi,
            createdAt: new Date()
          });
        }
      }
    }

    // Testleri ekle
    console.log('🧪 Testler ekleniyor...');
    for (const [konuAdi, testListesi] of Object.entries(testler)) {
      for (const testAdi of testListesi) {
        await addDoc(collection(db, 'testler'), {
          ad: testAdi,
          konuAdi: konuAdi,
          sinifAdi: '2. Sınıf', // Varsayılan
          dersAdi: 'Türkçe', // Varsayılan
          soru_sayisi: 10,
          zorluk: 'orta',
          sure: 15,
          createdAt: new Date()
        });
      }
    }

    // Kullanıcıları ekle
    console.log('👥 Kullanıcılar ekleniyor...');
    for (const kullanici of kullanicilar) {
      await setDoc(doc(db, 'kullanicilar', kullanici.id), kullanici);
    }

    console.log('✅ Tüm veriler Firebase\'e başarıyla eklendi!');
    console.log(`📊 Eklenen veriler:`);
    console.log(`   - ${siniflar.length} sınıf`);
    console.log(`   - ${dersler.length} ders`);
    console.log(`   - ${Object.values(konular).flatMap(d => Object.values(d)).flat().length} konu`);
    console.log(`   - ${Object.values(testler).flat().length} test`);
    console.log(`   - ${kullanicilar.length} kullanıcı`);

  } catch (error) {
    console.error('❌ Hata:', error);
  }
}

addDataToFirebase(); 