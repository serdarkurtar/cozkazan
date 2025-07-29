const mongoose = require('mongoose');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, setDoc, doc } = require('firebase/firestore');

// Firebase config
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

// MongoDB connection
const mongoUrl = 'mongodb://localhost:27017/cozkazan';

// MongoDB Models
const SinifSchema = new mongoose.Schema({}, { strict: false });
const DersSchema = new mongoose.Schema({}, { strict: false });
const KonuSchema = new mongoose.Schema({}, { strict: false });
const TestSchema = new mongoose.Schema({}, { strict: false });
const SoruSchema = new mongoose.Schema({}, { strict: false });
const TestHavuzuSchema = new mongoose.Schema({}, { strict: false });
const HikayeSchema = new mongoose.Schema({}, { strict: false });

const Sinif = mongoose.model('Sinif', SinifSchema, 'sinifs');
const Ders = mongoose.model('Ders', DersSchema, 'ders');
const Konu = mongoose.model('Konu', KonuSchema, 'konus');
const Test = mongoose.model('Test', TestSchema, 'tests');
const Soru = mongoose.model('Soru', SoruSchema, 'sorus');
const TestHavuzu = mongoose.model('TestHavuzu', TestHavuzuSchema, 'testhavuzus');
const Hikaye = mongoose.model('Hikaye', HikayeSchema, 'hikayes');

// ObjectId'leri temizle
function cleanObjectIds(obj) {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'object') {
    if (obj._bsontype === 'ObjectID' || obj.constructor.name === 'ObjectId') {
      return obj.toString();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(cleanObjectIds);
    }
    
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_id') continue; // _id'yi atla
      cleaned[key] = cleanObjectIds(value);
    }
    return cleaned;
  }
  
  return obj;
}

async function migrateMongoToFirebase() {
  try {
    console.log('🔄 MongoDB bağlantısı kuruluyor...');
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB bağlantısı başarılı');

    console.log('🔥 Firebase\'e veri aktarımı başlıyor...');

    // Sınıfları aktar
    console.log('📚 Sınıflar aktarılıyor...');
    const siniflar = await Sinif.find({});
    for (const sinif of siniflar) {
      const cleanData = cleanObjectIds(sinif.toObject());
      await setDoc(doc(db, 'siniflar', sinif._id.toString()), {
        id: sinif._id.toString(),
        ad: sinif.ad || 'Sınıf',
        ...cleanData
      });
    }
    console.log(`✅ ${siniflar.length} sınıf aktarıldı`);

    // Dersleri aktar
    console.log('📖 Dersler aktarılıyor...');
    const dersler = await Ders.find({});
    for (const ders of dersler) {
      const cleanData = cleanObjectIds(ders.toObject());
      await setDoc(doc(db, 'dersler', ders._id.toString()), {
        id: ders._id.toString(),
        ad: ders.ad || 'Ders',
        ...cleanData
      });
    }
    console.log(`✅ ${dersler.length} ders aktarıldı`);

    // Konuları aktar
    console.log('📝 Konular aktarılıyor...');
    const konular = await Konu.find({});
    for (const konu of konular) {
      const cleanData = cleanObjectIds(konu.toObject());
      await addDoc(collection(db, 'konular'), {
        id: konu._id.toString(),
        ad: konu.ad || 'Konu',
        sinifAdi: konu.sinifAdi || '2. Sınıf',
        dersAdi: konu.dersAdi || 'Türkçe',
        ...cleanData
      });
    }
    console.log(`✅ ${konular.length} konu aktarıldı`);

    // Testleri aktar
    console.log('🧪 Testler aktarılıyor...');
    const testler = await Test.find({});
    for (const test of testler) {
      const cleanData = cleanObjectIds(test.toObject());
      await addDoc(collection(db, 'testler'), {
        id: test._id.toString(),
        ad: test.ad || test.testAdi || 'Test',
        sinifAdi: test.sinifAdi || '2. Sınıf',
        dersAdi: test.dersAdi || 'Türkçe',
        konuAdi: test.konuAdi || 'Konu',
        soru_sayisi: test.soru_sayisi || 10,
        zorluk: test.zorluk || 'orta',
        sure: test.sure || 15,
        ...cleanData
      });
    }
    console.log(`✅ ${testler.length} test aktarıldı`);

    // Soruları aktar
    console.log('❓ Sorular aktarılıyor...');
    const sorular = await Soru.find({});
    for (const soru of sorular) {
      const cleanData = cleanObjectIds(soru.toObject());
      await addDoc(collection(db, 'sorular'), {
        id: soru._id.toString(),
        soru: soru.soru || 'Soru',
        secenekler: soru.secenekler || [],
        dogruCevap: soru.dogruCevap || '',
        testId: soru.testId || '',
        ...cleanData
      });
    }
    console.log(`✅ ${sorular.length} soru aktarıldı`);

    // Test Havuzlarını aktar
    console.log('🏊 Test Havuzları aktarılıyor...');
    const testHavuzlari = await TestHavuzu.find({});
    for (const havuz of testHavuzlari) {
      const cleanData = cleanObjectIds(havuz.toObject());
      await addDoc(collection(db, 'test_havuzlari'), {
        id: havuz._id.toString(),
        ad: havuz.ad || 'Test Havuzu',
        sinifAdi: havuz.sinifAdi || '2. Sınıf',
        dersAdi: havuz.dersAdi || 'Türkçe',
        konuAdi: havuz.konuAdi || 'Konu',
        testler: havuz.testler || [],
        ...cleanData
      });
    }
    console.log(`✅ ${testHavuzlari.length} test havuzu aktarıldı`);

    // Hikayeleri aktar
    console.log('📚 Hikayeler aktarılıyor...');
    const hikayeler = await Hikaye.find({});
    for (const hikaye of hikayeler) {
      const cleanData = cleanObjectIds(hikaye.toObject());
      await addDoc(collection(db, 'hikayeler'), {
        id: hikaye._id.toString(),
        baslik: hikaye.baslik || 'Hikaye',
        icerik: hikaye.icerik || '',
        sinifAdi: hikaye.sinifAdi || '2. Sınıf',
        ...cleanData
      });
    }
    console.log(`✅ ${hikayeler.length} hikaye aktarıldı`);

    // Kullanıcıları ekle
    console.log('👥 Kullanıcılar ekleniyor...');
    const kullanicilar = [
      { id: 'parent_1', ad: 'Veli 1', tip: 'veli', email: 'veli1@example.com' },
      { id: 'child_1', ad: 'Çocuk 1', tip: 'cocuk', email: 'cocuk1@example.com' },
      { id: 'child_2', ad: 'Çocuk 2', tip: 'cocuk', email: 'cocuk2@example.com' }
    ];
    
    for (const kullanici of kullanicilar) {
      await setDoc(doc(db, 'kullanicilar', kullanici.id), kullanici);
    }
    console.log(`✅ ${kullanicilar.length} kullanıcı eklendi`);

    console.log('🎉 Tüm veriler başarıyla Firebase\'e aktarıldı!');
    console.log(`📊 Aktarılan veriler:`);
    console.log(`   - ${siniflar.length} sınıf`);
    console.log(`   - ${dersler.length} ders`);
    console.log(`   - ${konular.length} konu`);
    console.log(`   - ${testler.length} test`);
    console.log(`   - ${sorular.length} soru`);
    console.log(`   - ${testHavuzlari.length} test havuzu`);
    console.log(`   - ${hikayeler.length} hikaye`);
    console.log(`   - ${kullanicilar.length} kullanıcı`);

    await mongoose.disconnect();
    console.log('✅ MongoDB bağlantısı kapatıldı');

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

migrateMongoToFirebase(); 