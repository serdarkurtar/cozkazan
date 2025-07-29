const mongoose = require('mongoose');

// MongoDB connection
const mongoUrl = 'mongodb://localhost:27017/cozkazan';

// MongoDB Models - Tüm koleksiyonları kontrol et
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

async function checkAllMongoData() {
  try {
    console.log('🔄 MongoDB bağlantısı kuruluyor...');
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB bağlantısı başarılı');

    console.log('\n📊 MONGODB TÜM VERİLER DETAYLI ANALİZ');
    console.log('========================================');

    // Tüm koleksiyonları listele
    console.log('\n📋 MEVCUT KOLEKSİYONLAR:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const collection of collections) {
      console.log(`  - ${collection.name}`);
    }

    // Sınıfları kontrol et
    console.log('\n📚 SINIFLAR:');
    const siniflar = await Sinif.find({});
    console.log(`Toplam ${siniflar.length} sınıf bulundu:`);
    for (const sinif of siniflar) {
      console.log(`  - ${sinif.ad} (ID: ${sinif._id})`);
    }

    // Dersleri kontrol et
    console.log('\n📖 DERSLER:');
    const dersler = await Ders.find({});
    console.log(`Toplam ${dersler.length} ders bulundu:`);
    for (const ders of dersler) {
      console.log(`  - ${ders.ad} (Sınıf: ${ders.sinifAdi || 'Belirtilmemiş'})`);
    }

    // Konuları kontrol et - TÜM KONULAR
    console.log('\n📝 KONULAR (TÜM 111 KONU):');
    const konular = await Konu.find({});
    console.log(`Toplam ${konular.length} konu bulundu (111 olması gerekiyor):`);
    
    // Konuları sınıf ve derse göre grupla
    const konuGruplari = {};
    for (const konu of konular) {
      const sinifAdi = konu.sinifAdi || 'Belirtilmemiş';
      const dersAdi = konu.dersAdi || 'Belirtilmemiş';
      
      if (!konuGruplari[sinifAdi]) {
        konuGruplari[sinifAdi] = {};
      }
      if (!konuGruplari[sinifAdi][dersAdi]) {
        konuGruplari[sinifAdi][dersAdi] = [];
      }
      konuGruplari[sinifAdi][dersAdi].push(konu.ad);
    }

    // Gruplandırılmış konuları yazdır
    let toplamKonu = 0;
    for (const [sinifAdi, dersler] of Object.entries(konuGruplari)) {
      console.log(`\n  ${sinifAdi}:`);
      for (const [dersAdi, konular] of Object.entries(dersler)) {
        console.log(`    ${dersAdi} (${konular.length} konu):`);
        toplamKonu += konular.length;
        for (const konu of konular) {
          console.log(`      - ${konu}`);
        }
      }
    }
    console.log(`\n📊 TOPLAM KONU SAYISI: ${toplamKonu}`);

    // Testleri kontrol et
    console.log('\n🧪 TESTLER:');
    const testler = await Test.find({});
    console.log(`Toplam ${testler.length} test bulundu`);

    // Soruları kontrol et
    console.log('\n❓ SORULAR:');
    const sorular = await Soru.find({});
    console.log(`Toplam ${sorular.length} soru bulundu`);

    // Test havuzlarını kontrol et
    console.log('\n🏊 TEST HAVUZLARI:');
    const testHavuzlari = await TestHavuzu.find({});
    console.log(`Toplam ${testHavuzlari.length} test havuzu bulundu`);

    // Hikayeleri kontrol et
    console.log('\n📚 HİKAYELER:');
    const hikayeler = await Hikaye.find({});
    console.log(`Toplam ${hikayeler.length} hikaye bulundu`);

    // Eksik konuları bul
    console.log('\n🔍 EKSİK KONU ANALİZİ:');
    if (toplamKonu < 111) {
      console.log(`❌ Eksik konu sayısı: ${111 - toplamKonu}`);
      console.log('MongoDB\'de eksik konular var veya farklı koleksiyonlarda olabilir');
    } else {
      console.log('✅ Tüm 111 konu mevcut');
    }

    // Farklı koleksiyon isimlerini kontrol et
    console.log('\n🔍 ALTERNATİF KOLEKSİYON İSİMLERİ:');
    const alternativeNames = ['konu', 'konular', 'topics', 'subject', 'subjects'];
    for (const name of alternativeNames) {
      try {
        const AltKonuSchema = new mongoose.Schema({}, { strict: false });
        const AltKonu = mongoose.model(`AltKonu_${name}`, AltKonuSchema, name);
        const altKonular = await AltKonu.find({}).limit(5);
        if (altKonular.length > 0) {
          console.log(`  - ${name} koleksiyonunda ${altKonular.length} kayıt bulundu`);
        }
      } catch (e) {
        // Koleksiyon yok
      }
    }

    console.log('\n✅ Detaylı analiz tamamlandı!');
    await mongoose.disconnect();

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

checkAllMongoData(); 