import mongoose from 'mongoose';
import Konu from '../models/Konu.js';
import Ders from '../models/Ders.js';
import { MONGO_URL } from '../env.js';

// Veritabanı bağlantısı
await mongoose.connect(MONGO_URL);
console.log('✅ Veritabanı bağlantısı başarılı.');

try {
  // Tüm konuları al
  const konular = await Konu.find().populate('ders');
  console.log(`📊 Toplam ${konular.length} konu bulundu`);
  
  // İlk 5 konuyu kontrol et
  for (let i = 0; i < Math.min(5, konular.length); i++) {
    const konu = konular[i];
    console.log(`\nKonu ${i + 1}:`);
    console.log(`  - Konu Adı: ${konu.konuAdi}`);
    console.log(`  - Ders: ${konu.ders ? konu.ders.dersAdi : 'YOK'}`);
    console.log(`  - Ders ID: ${konu.ders ? konu.ders._id : 'YOK'}`);
    console.log(`  - Sinif: ${konu.sinifAdi}`);
  }
  
  // Dersleri kontrol et
  const dersler = await Ders.find();
  console.log(`\n📚 Toplam ${dersler.length} ders bulundu`);
  
  for (const ders of dersler) {
    console.log(`  - ${ders.dersAdi} (ID: ${ders._id})`);
  }

} catch (error) {
  console.error('❌ Hata:', error);
} finally {
  await mongoose.disconnect();
  console.log('🔌 Veritabanı bağlantısı kapatıldı');
} 