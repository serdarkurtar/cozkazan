const mongoose = require('mongoose');
const fs = require('fs');

// MongoDB modellerini yükle
const Test = require('./models/Test');
const Ders = require('./models/Ders');
const Konu = require('./models/Konu');
const TestHavuzu = require('./models/TestHavuzu');
const Hikaye = require('./models/Hikaye');

async function checkMongoDBData() {
  try {
    console.log('🔍 MongoDB verilerini kontrol ediyorum...');
    
    // MongoDB'ye bağlan
    await mongoose.connect('mongodb://localhost:27017/cozkazan');
    console.log('✅ MongoDB bağlandı');

    // Verileri say
    const testCount = await Test.countDocuments();
    const dersCount = await Ders.countDocuments();
    const konuCount = await Konu.countDocuments();
    const havuzCount = await TestHavuzu.countDocuments();
    const hikayeCount = await Hikaye.countDocuments();

    console.log('\n📊 MongoDB Veri Durumu:');
    console.log(`- Testler: ${testCount}`);
    console.log(`- Dersler: ${dersCount}`);
    console.log(`- Konular: ${konuCount}`);
    console.log(`- Test Havuzları: ${havuzCount}`);
    console.log(`- Hikayeler: ${hikayeCount}`);

    // Örnek verileri göster
    console.log('\n📋 Örnek Veriler:');

    if (testCount > 0) {
      const sampleTest = await Test.findOne();
      console.log('\n🔍 Örnek Test:');
      console.log(JSON.stringify(sampleTest, null, 2));
    }

    if (dersCount > 0) {
      const sampleDers = await Ders.findOne();
      console.log('\n📚 Örnek Ders:');
      console.log(JSON.stringify(sampleDers, null, 2));
    }

    if (konuCount > 0) {
      const sampleKonu = await Konu.findOne();
      console.log('\n📖 Örnek Konu:');
      console.log(JSON.stringify(sampleKonu, null, 2));
    }

    if (havuzCount > 0) {
      const sampleHavuz = await TestHavuzu.findOne();
      console.log('\n🏊 Örnek Test Havuzu:');
      console.log(JSON.stringify(sampleHavuz, null, 2));
    }

    if (hikayeCount > 0) {
      const sampleHikaye = await Hikaye.findOne();
      console.log('\n📚 Örnek Hikaye:');
      console.log(JSON.stringify(sampleHikaye, null, 2));
    }

    // Veri özetini dosyaya kaydet
    const summary = {
      timestamp: new Date().toISOString(),
      testCount,
      dersCount,
      konuCount,
      havuzCount,
      hikayeCount,
      totalRecords: testCount + dersCount + konuCount + havuzCount + hikayeCount
    };

    fs.writeFileSync('mongodb-data-summary.json', JSON.stringify(summary, null, 2));
    console.log('\n💾 Veri özeti mongodb-data-summary.json dosyasına kaydedildi');

    // Öneriler
    console.log('\n💡 Öneriler:');
    if (testCount > 0) {
      console.log('✅ Testler mevcut - Firebase\'e taşınabilir');
    } else {
      console.log('⚠️ Test bulunamadı - Firebase\'de test verileri eklenmeli');
    }

    if (dersCount > 0) {
      console.log('✅ Dersler mevcut - Firebase\'e taşınabilir');
    } else {
      console.log('⚠️ Ders bulunamadı - Firebase\'de ders verileri eklenmeli');
    }

    if (konuCount > 0) {
      console.log('✅ Konular mevcut - Firebase\'e taşınabilir');
    } else {
      console.log('⚠️ Konu bulunamadı - Firebase\'de konu verileri eklenmeli');
    }

    if (havuzCount > 0) {
      console.log('✅ Test havuzları mevcut - Firebase\'e taşınabilir');
    } else {
      console.log('⚠️ Test havuzu bulunamadı');
    }

    if (hikayeCount > 0) {
      console.log('✅ Hikayeler mevcut - Firebase\'e taşınabilir');
    } else {
      console.log('⚠️ Hikaye bulunamadı - Firebase\'de hikaye verileri eklenmeli');
    }

  } catch (error) {
    console.error('❌ Hata:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 MongoDB çalışmıyor. Şu seçenekleriniz var:');
      console.log('1. MongoDB\'yi başlatın');
      console.log('2. MongoDB\'yi pasif hale getirin: disable-mongodb.bat');
      console.log('3. Sadece Firebase kullanmaya devam edin');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 MongoDB bağlantısı kapatıldı');
  }
}

checkMongoDBData(); 