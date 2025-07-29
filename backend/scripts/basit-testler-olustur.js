import mongoose from 'mongoose';
import Test from '../models/Test.js';
import { MONGO_URL } from '../env.js';

// Veritabanı bağlantısı
await mongoose.connect(MONGO_URL);
console.log('✅ Veritabanı bağlantısı başarılı.');

// Önce mevcut testleri silelim
await Test.deleteMany({});
console.log('🗑️ Mevcut testler silindi.');

// Test soruları
const sorular = [
  {
    soru: "5 + 3 = ?",
    secenekler: ["6", "7", "8", "9"],
    dogruCevap: 2,
    aciklama: "5 + 3 = 8"
  },
  {
    soru: "Hangi hayvan evcil hayvandır?",
    secenekler: ["Aslan", "Kedi", "Kaplan", "Kurt"],
    dogruCevap: 1,
    aciklama: "Kedi evcil bir hayvandır."
  },
  {
    soru: "Aşağıdaki kelimelerden hangisi eş anlamlıdır?",
    secenekler: ["Büyük - Küçük", "Güzel - Hoş", "Hızlı - Yavaş", "Sıcak - Soğuk"],
    dogruCevap: 1,
    aciklama: "Güzel ve hoş kelimeleri aynı anlama gelir."
  },
  {
    soru: "Hangi gezegen Güneş'e en yakındır?",
    secenekler: ["Mars", "Venüs", "Merkür", "Dünya"],
    dogruCevap: 2,
    aciklama: "Merkür Güneş'e en yakın gezegendir."
  },
  {
    soru: "10 - 4 = ?",
    secenekler: ["4", "5", "6", "7"],
    dogruCevap: 2,
    aciklama: "10 - 4 = 6"
  },
  {
    soru: "Hangi organımız düşünmemizi sağlar?",
    secenekler: ["Kalp", "Beyin", "Mide", "Akciğer"],
    dogruCevap: 1,
    aciklama: "Beyin düşünmemizi sağlar."
  },
  {
    soru: "2 x 6 = ?",
    secenekler: ["10", "12", "14", "16"],
    dogruCevap: 1,
    aciklama: "2 x 6 = 12"
  },
  {
    soru: "Hangi mevsimde kar yağar?",
    secenekler: ["Yaz", "Sonbahar", "Kış", "İlkbahar"],
    dogruCevap: 2,
    aciklama: "Kar kış mevsiminde yağar."
  },
  {
    soru: "Hangi kelime türemiş kelimedir?",
    secenekler: ["Ev", "Evli", "Evde", "Eve"],
    dogruCevap: 1,
    aciklama: "'Evli' kelimesi 'ev' kökünden türemiştir."
  },
  {
    soru: "Hangi hayvan uçabilir?",
    secenekler: ["Balık", "Kuş", "Köpek", "Kedi"],
    dogruCevap: 1,
    aciklama: "Kuş uçabilen bir hayvandır."
  }
];

try {
  // 50 test oluştur
  for (let i = 1; i <= 50; i++) {
    // Soruları karıştır
    const karisikSorular = [...sorular].sort(() => Math.random() - 0.5);
    
    const test = new Test({
      testAdi: `Test ${i}`,
      aciklama: `${i}. test açıklaması`,
      sinif: new mongoose.Types.ObjectId(), // Geçici ID
      ders: new mongoose.Types.ObjectId(), // Geçici ID
      konu: new mongoose.Types.ObjectId(), // Geçici ID
      konuAdi: `Konu ${i}`,
      sorular: karisikSorular,
      puan: 10, // Sabit 10 XP
      aktif: true
    });
    
    await test.save();
    console.log(`✅ Test ${i} oluşturuldu`);
  }

  console.log(`\n🎉 Testler oluşturma tamamlandı!`);
  console.log(`📊 Özet:`);
  console.log(`   - Toplam test: 50`);
  console.log(`   - Toplam soru: 500`);
  console.log(`   - Her test: 10 XP puanı`);
  console.log(`   - Süre: Yok (anında geçiş)`);
  console.log(`   - Zorluk seviyesi: Yok`);

} catch (error) {
  console.error('❌ Hata:', error);
} finally {
  await mongoose.disconnect();
  console.log('🔌 Veritabanı bağlantısı kapatıldı');
} 