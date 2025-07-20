import mongoose from 'mongoose';
import Test from '../models/Test.js';
import { MONGO_URL } from '../env.js';

// Veritabanı bağlantısı
await mongoose.connect(MONGO_URL);
console.log('✅ Veritabanı bağlantısı başarılı.');

try {
  // Sorusuz testleri bul
  const sorusuzTestler = await Test.find({
    $or: [
      { sorular: { $exists: false } },
      { sorular: { $size: 0 } },
      { sorular: null }
    ]
  });

  console.log(`📊 Toplam ${sorusuzTestler.length} sorusuz test bulundu.`);

  if (sorusuzTestler.length === 0) {
    console.log('✅ Sorusuz test bulunamadı.');
    process.exit(0);
  }

  // Testleri sil
  console.log('\n🗑️ Testler siliniyor...');
  let silinenSayi = 0;

  for (const test of sorusuzTestler) {
    try {
      await Test.findByIdAndDelete(test._id);
      console.log(`✅ Silindi: ${test.aciklama || test.testAdi || 'İsimsiz Test'}`);
      silinenSayi++;
    } catch (error) {
      console.log(`❌ Hata: ${test.aciklama || test.testAdi} silinemedi - ${error.message}`);
    }
  }

  console.log(`\n🎉 İşlem tamamlandı! ${silinenSayi} test silindi.`);

} catch (error) {
  console.error('❌ Hata:', error.message);
} finally {
  await mongoose.disconnect();
  console.log('🔌 Veritabanı bağlantısı kapatıldı.');
  process.exit(0);
} 