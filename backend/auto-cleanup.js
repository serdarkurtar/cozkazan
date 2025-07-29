import mongoose from 'mongoose';
import TestHavuzu from './models/TestHavuzu.js';
import Test from './models/Test.js';

// MongoDB bağlantısı
const mongoUrl = 'mongodb://localhost:27017/cozkazan';

async function autoCleanup() {
  try {
    await mongoose.connect(mongoUrl);
    console.log('🧹 Otomatik temizlik başlıyor...');
    
    // Tüm havuzları al
    const havuzlar = await TestHavuzu.find({});
    console.log(`📊 ${havuzlar.length} havuz kontrol ediliyor...`);
    
    let toplamTemizlik = 0;
    
    for (const havuz of havuzlar) {
      if (havuz.testler.length === 0) continue;
      
      // Havuzdaki testleri kontrol et
      const tests = await Test.find({ 
        _id: { $in: havuz.testler },
        sinif: havuz.sinif,
        ders: havuz.ders,
        konu: havuz.konu
      });
      
      // Yanlış testleri bul
      const yanlisTestIds = havuz.testler.filter(id => 
        !tests.some(test => test._id.toString() === id.toString())
      );
      
      if (yanlisTestIds.length > 0) {
        // Yanlış testleri havuzdan çıkar
        havuz.testler = havuz.testler.filter(id => 
          !yanlisTestIds.includes(id)
        );
        
        await havuz.save();
        toplamTemizlik += yanlisTestIds.length;
        
        console.log(`🧹 ${havuz.sinif} ${havuz.ders} ${havuz.konu}: ${yanlisTestIds.length} yanlış test çıkarıldı`);
      }
    }
    
    if (toplamTemizlik > 0) {
      console.log(`✅ Toplam ${toplamTemizlik} yanlış test temizlendi`);
    } else {
      console.log('✅ Tüm havuzlar zaten temiz');
    }
    
  } catch (error) {
    console.error('❌ Temizlik hatası:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Her 30 dakikada bir çalıştır
setInterval(autoCleanup, 30 * 60 * 1000);

// İlk çalıştırma
autoCleanup();

export default autoCleanup; 