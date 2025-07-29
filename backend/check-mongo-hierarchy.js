const mongoose = require('mongoose');

// MongoDB connection
const mongoUrl = 'mongodb://localhost:27017/cozkazan';

// MongoDB Models
const SinifSchema = new mongoose.Schema({}, { strict: false });
const DersSchema = new mongoose.Schema({}, { strict: false });
const KonuSchema = new mongoose.Schema({}, { strict: false });

const Sinif = mongoose.model('Sinif', SinifSchema, 'sinifs');
const Ders = mongoose.model('Ders', DersSchema, 'ders');
const Konu = mongoose.model('Konu', KonuSchema, 'konus');

async function checkMongoHierarchy() {
  try {
    console.log('🔄 MongoDB bağlantısı kuruluyor...');
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB bağlantısı başarılı');

    console.log('\n📊 MONGODB SINIF-DERS-KONU HİYERARŞİSİ ANALİZİ');
    console.log('================================================');

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

    // Konuları kontrol et
    console.log('\n📝 KONULAR:');
    const konular = await Konu.find({});
    console.log(`Toplam ${konular.length} konu bulundu:`);
    
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
    for (const [sinifAdi, dersler] of Object.entries(konuGruplari)) {
      console.log(`\n  ${sinifAdi}:`);
      for (const [dersAdi, konular] of Object.entries(dersler)) {
        console.log(`    ${dersAdi} (${konular.length} konu):`);
        for (const konu of konular) {
          console.log(`      - ${konu}`);
        }
      }
    }

    // Test havuzlarını kontrol et
    console.log('\n🏊 TEST HAVUZLARI:');
    const TestHavuzuSchema = new mongoose.Schema({}, { strict: false });
    const TestHavuzu = mongoose.model('TestHavuzu', TestHavuzuSchema, 'testhavuzus');
    const testHavuzlari = await TestHavuzu.find({});
    console.log(`Toplam ${testHavuzlari.length} test havuzu bulundu`);

    // Test havuzlarını sınıf ve derse göre grupla
    const havuzGruplari = {};
    for (const havuz of testHavuzlari) {
      const sinifAdi = havuz.sinifAdi || 'Belirtilmemiş';
      const dersAdi = havuz.dersAdi || 'Belirtilmemiş';
      const konuAdi = havuz.konuAdi || 'Belirtilmemiş';
      
      if (!havuzGruplari[sinifAdi]) {
        havuzGruplari[sinifAdi] = {};
      }
      if (!havuzGruplari[sinifAdi][dersAdi]) {
        havuzGruplari[sinifAdi][dersAdi] = {};
      }
      if (!havuzGruplari[sinifAdi][dersAdi][konuAdi]) {
        havuzGruplari[sinifAdi][dersAdi][konuAdi] = [];
      }
      havuzGruplari[sinifAdi][dersAdi][konuAdi].push(havuz.ad);
    }

    console.log('\nTest Havuzları Hiyerarşisi:');
    for (const [sinifAdi, dersler] of Object.entries(havuzGruplari)) {
      console.log(`\n  ${sinifAdi}:`);
      for (const [dersAdi, konular] of Object.entries(dersler)) {
        console.log(`    ${dersAdi}:`);
        for (const [konuAdi, havuzlar] of Object.entries(konular)) {
          console.log(`      ${konuAdi} (${havuzlar.length} havuz):`);
          for (const havuz of havuzlar) {
            console.log(`        - ${havuz}`);
          }
        }
      }
    }

    console.log('\n✅ Analiz tamamlandı!');
    await mongoose.disconnect();

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

checkMongoHierarchy(); 