import mongoose from 'mongoose';
import VeliTestAyarlari from './models/VeliTestAyarlari.js';
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
    // parent_1 için veli ayarlarını kontrol et
    console.log('\n🔍 parent_1 için veli ayarları:');
    const veliAyarlari = await VeliTestAyarlari.findOne({ parentId: 'parent_1' });
    
    if (veliAyarlari) {
      console.log('✅ Veli ayarları bulundu');
      console.log(`  ParentId: ${veliAyarlari.parentId}`);
      console.log(`  Test sayısı: ${veliAyarlari.testler?.length || 0}`);
      
      if (veliAyarlari.testler && veliAyarlari.testler.length > 0) {
        console.log('\n📋 Testler:');
        veliAyarlari.testler.forEach((test, index) => {
          console.log(`  ${index + 1}. ${test.testAdi} (${test.sinif} - ${test.ders} - ${test.konu})`);
        });
      }
    } else {
      console.log('❌ Veli ayarları bulunamadı');
      
      // Örnek test ayarları oluştur
      console.log('\n🔧 Örnek test ayarları oluşturuluyor...');
      const ornekTestAyarlari = new VeliTestAyarlari({
        parentId: 'parent_1',
        testler: [
          {
            _id: 'test_1',
            testAdi: 'Test - Güzel Davranışlarımız',
            sinif: '1. Sınıf',
            ders: 'Türkçe',
            konu: 'Güzel Davranışlarımız',
            xpPuan: 15,
            sorular: []
          }
        ]
      });
      
      await ornekTestAyarlari.save();
      console.log('✅ Örnek test ayarları oluşturuldu');
    }
    
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB bağlantısı kapatıldı');
  }
}); 