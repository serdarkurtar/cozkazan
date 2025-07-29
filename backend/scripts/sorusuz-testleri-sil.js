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

  // Testleri listele
  console.log('\n🗑️ Silinecek testler:');
  sorusuzTestler.forEach((test, index) => {
    console.log(`${index + 1}. ${test.aciklama || test.testAdi || 'İsimsiz Test'} (ID: ${test._id})`);
  });

  // Onay al
  console.log('\n⚠️ Bu testler kalıcı olarak silinecek!');
  console.log('Devam etmek için "EVET" yazın:');
  
  // Basit onay sistemi (5 saniye bekle)
  const onay = await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.log('⏰ Zaman aşımı - İşlem iptal edildi.');
      resolve(false);
    }, 5000);

    process.stdin.once('data', (data) => {
      clearTimeout(timeout);
      const input = data.toString().trim().toUpperCase();
      resolve(input === 'EVET');
    });
  });

  if (!onay) {
    console.log('❌ İşlem iptal edildi.');
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