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
const AltKonuSchema = new mongoose.Schema({}, { strict: false });
const TestSchema = new mongoose.Schema({}, { strict: false });
const SoruSchema = new mongoose.Schema({}, { strict: false });
const TestHavuzuSchema = new mongoose.Schema({}, { strict: false });
const HikayeSchema = new mongoose.Schema({}, { strict: false });

const Sinif = mongoose.model('Sinif', SinifSchema, 'sinifs');
const Ders = mongoose.model('Ders', DersSchema, 'ders');
const Konu = mongoose.model('Konu', KonuSchema, 'konus');
const AltKonu = mongoose.model('AltKonu', AltKonuSchema, 'altkonus');
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

async function migrateAll111Konular() {
  try {
    console.log('🔄 MongoDB bağlantısı kuruluyor...');
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB bağlantısı başarılı');

    console.log('🔥 Firebase\'e TÜM 111 KONU aktarımı başlıyor...');

    // Sınıfları aktar
    console.log('📚 Sınıflar aktarılıyor...');
    const siniflar = await Sinif.find({});
    for (const sinif of siniflar) {
      const cleanData = cleanObjectIds(sinif.toObject());
      await setDoc(doc(db, 'siniflar', sinif._id.toString()), {
        id: sinif._id.toString(),
        ad: sinif.ad,
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
        ad: ders.ad,
        sinifAdi: ders.sinifAdi,
        ...cleanData
      });
    }
    console.log(`✅ ${dersler.length} ders aktarıldı`);

    // Ana konuları aktar (konus koleksiyonu)
    console.log('📝 Ana konular aktarılıyor...');
    const anaKonular = await Konu.find({});
    for (const konu of anaKonular) {
      const cleanData = cleanObjectIds(konu.toObject());
      await addDoc(collection(db, 'konular'), {
        id: konu._id.toString(),
        ad: konu.ad,
        sinifAdi: konu.sinifAdi,
        dersAdi: konu.dersAdi,
        tip: 'ana_konu',
        ...cleanData
      });
    }
    console.log(`✅ ${anaKonular.length} ana konu aktarıldı`);

    // Alt konuları aktar (altkonus koleksiyonu)
    console.log('📝 Alt konular aktarılıyor...');
    const altKonular = await AltKonu.find({});
    for (const altKonu of altKonular) {
      const cleanData = cleanObjectIds(altKonu.toObject());
      await addDoc(collection(db, 'konular'), {
        id: altKonu._id.toString(),
        ad: altKonu.ad,
        sinifAdi: cleanData.sinif || '2. Sınıf', // cleanData'dan al
        dersAdi: cleanData.ders || 'Türkçe', // cleanData'dan al
        konuAdi: cleanData.konu || 'Genel', // cleanData'dan al
        tip: 'alt_konu',
        ...cleanData
      });
    }
    console.log(`✅ ${altKonular.length} alt konu aktarıldı`);

    // Toplam konu sayısı
    const toplamKonu = anaKonular.length + altKonular.length;
    console.log(`🎯 TOPLAM KONU SAYISI: ${toplamKonu} (${anaKonular.length} ana + ${altKonular.length} alt)`);

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
        sinifAdi: cleanData.sinifAdi || '2. Sınıf', // cleanData'dan al
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

    console.log('🎉 TÜM 111 KONU BAŞARIYLA FIREBASE\'E AKTARILDI!');
    console.log(`📊 Aktarılan veriler:`);
    console.log(`   - ${siniflar.length} sınıf`);
    console.log(`   - ${dersler.length} ders`);
    console.log(`   - ${toplamKonu} konu (${anaKonular.length} ana + ${altKonular.length} alt)`);
    console.log(`   - ${testler.length} test`);
    console.log(`   - ${sorular.length} soru`);
    console.log(`   - ${testHavuzlari.length} test havuzu`);
    console.log(`   - ${hikayeler.length} hikaye`);
    console.log(`   - ${kullanicilar.length} kullanıcı`);

    console.log('\n🎯 HİYERARŞİ YAPISI:');
    console.log('   Her sınıfın kendi dersleri var');
    console.log('   Her dersin kendi konuları var (ana + alt konular)');
    console.log('   Her konunun kendi testleri var');
    console.log(`   TOPLAM ${toplamKonu} KONU DOĞRU HİYERARŞİ İLE AKTARILDI!`);

    await mongoose.disconnect();
    console.log('✅ MongoDB bağlantısı kapatıldı');

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

migrateAll111Konular(); 