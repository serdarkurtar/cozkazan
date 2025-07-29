import mongoose from 'mongoose';
import Test from './models/Test.js';
import PERMANENT_SETTINGS from './config/permanent-settings.js';

// MongoDB bağlantısı
mongoose.connect(PERMANENT_SETTINGS.DATABASE.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB bağlantı hatası:'));
db.once('open', async () => {
  console.log('✅ MongoDB bağlantısı başarılı');
  
  try {
    // Tüm testleri getir
    const allTests = await Test.find({});
    console.log(`📊 Toplam test sayısı: ${allTests.length}`);
    
    // Test alanlarını kontrol et
    console.log('\n🔍 Test alanları analizi:');
    allTests.forEach((test, index) => {
      console.log(`\nTest ${index + 1}:`);
      console.log(`  testAdi: ${test.testAdi}`);
      console.log(`  ad: ${test.ad}`);
      console.log(`  sinif: ${test.sinif}`);
      console.log(`  ders: ${test.ders}`);
      console.log(`  konu: ${test.konu}`);
      console.log(`  sinifAdi: ${test.sinifAdi}`);
      console.log(`  dersAdi: ${test.dersAdi}`);
      console.log(`  konuAdi: ${test.konuAdi}`);
    });
    
    // "Güzel Davranışlarımız" konusundaki testleri ara
    console.log('\n🔍 "Güzel Davranışlarımız" konusundaki testler:');
    const guzelDavranislarTests = await Test.find({
      $or: [
        { konu: 'Güzel Davranışlarımız' },
        { konuAdi: 'Güzel Davranışlarımız' }
      ]
    });
    console.log(`Bulunan test sayısı: ${guzelDavranislarTests.length}`);
    
    // "1. Sınıf Türkçe" testlerini ara
    console.log('\n🔍 "1. Sınıf Türkçe" testleri:');
    const birinciSinifTurkceTests = await Test.find({
      $or: [
        { sinif: '1. Sınıf', ders: 'Türkçe' },
        { sinifAdi: '1. Sınıf', dersAdi: 'Türkçe' }
      ]
    });
    console.log(`Bulunan test sayısı: ${birinciSinifTurkceTests.length}`);
    
    // "1. Sınıf Türkçe Güzel Davranışlarımız" testlerini ara
    console.log('\n🔍 "1. Sınıf Türkçe Güzel Davranışlarımız" testleri:');
    const targetTests = await Test.find({
      $or: [
        { sinif: '1. Sınıf', ders: 'Türkçe', konu: 'Güzel Davranışlarımız' },
        { sinifAdi: '1. Sınıf', dersAdi: 'Türkçe', konuAdi: 'Güzel Davranışlarımız' }
      ]
    });
    console.log(`Bulunan test sayısı: ${targetTests.length}`);
    
    if (targetTests.length > 0) {
      console.log('\n📋 Bulunan testler:');
      targetTests.forEach((test, index) => {
        console.log(`  ${index + 1}. ${test.testAdi || test.ad}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB bağlantısı kapatıldı');
  }
}); 