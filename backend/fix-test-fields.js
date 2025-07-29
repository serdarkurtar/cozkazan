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
    // sinifAdi veya dersAdi undefined olan testleri bul
    const testsToFix = await Test.find({
      $or: [
        { sinifAdi: undefined },
        { dersAdi: undefined },
        { sinifAdi: null },
        { dersAdi: null }
      ]
    });
    
    console.log(`🔧 Düzeltilecek test sayısı: ${testsToFix.length}`);
    
    // Her testi düzelt
    for (const test of testsToFix) {
      console.log(`\n🔧 Düzeltiliyor: ${test.testAdi}`);
      console.log(`  Önceki: sinifAdi=${test.sinifAdi}, dersAdi=${test.dersAdi}`);
      
      // sinifAdi ve dersAdi alanlarını doldur
      test.sinifAdi = test.sinif;
      test.dersAdi = test.ders;
      
      await test.save();
      
      console.log(`  Sonraki: sinifAdi=${test.sinifAdi}, dersAdi=${test.dersAdi}`);
    }
    
    console.log('\n✅ Tüm testler düzeltildi!');
    
    // Kontrol et
    const fixedTests = await Test.find({
      sinifAdi: '1. Sınıf',
      dersAdi: 'Türkçe',
      konuAdi: 'Güzel Davranışlarımız'
    });
    
    console.log(`\n🔍 "1. Sınıf Türkçe Güzel Davranışlarımız" testleri: ${fixedTests.length}`);
    
    if (fixedTests.length > 0) {
      console.log('📋 Bulunan testler:');
      fixedTests.forEach((test, index) => {
        console.log(`  ${index + 1}. ${test.testAdi}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB bağlantısı kapatıldı');
  }
}); 