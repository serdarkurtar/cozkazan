import mongoose from 'mongoose';
import Test from '../models/Test.js';
import Konu from '../models/Konu.js';
import Ders from '../models/Ders.js';
import { MONGO_URL } from '../env.js';

// Veritabanı bağlantısı
await mongoose.connect(MONGO_URL);
console.log('✅ Veritabanı bağlantısı başarılı.');

// Önce mevcut testleri silelim
await Test.deleteMany({});
console.log('🗑️ Mevcut testler silindi.');

// Test soruları şablonları
const soruSablolari = {
  turkce: [
    {
      soru: "Aşağıdaki kelimelerden hangisi eş anlamlıdır?",
      secenekler: ["Büyük - Küçük", "Güzel - Hoş", "Hızlı - Yavaş", "Sıcak - Soğuk"],
      dogruCevap: 1,
      aciklama: "Güzel ve hoş kelimeleri aynı anlama gelir."
    },
    {
      soru: "Hangi cümlede yazım hatası vardır?",
      secenekler: ["Okula gidiyorum.", "Kitabı okuyorum.", "Güzel bir gün.", "Senide bekliyorum."],
      dogruCevap: 3,
      aciklama: "'Senide' kelimesi 'Seni de' şeklinde yazılmalıdır."
    },
    {
      soru: "Aşağıdaki kelimelerden hangisi zıt anlamlıdır?",
      secenekler: ["Masa - Sandalye", "Kalem - Defter", "Açık - Kapalı", "Araba - Otomobil"],
      dogruCevap: 2,
      aciklama: "Açık ve kapalı kelimeleri zıt anlamlıdır."
    },
    {
      soru: "Hangi kelime türemiş kelimedir?",
      secenekler: ["Ev", "Evli", "Evde", "Eve"],
      dogruCevap: 1,
      aciklama: "'Evli' kelimesi 'ev' kökünden türemiştir."
    },
    {
      soru: "Aşağıdaki cümlelerden hangisi olumludur?",
      secenekler: ["Gelmiyor.", "Gelmedi.", "Geliyor.", "Gelmez."],
      dogruCevap: 2,
      aciklama: "'Geliyor' cümlesi olumlu bir cümledir."
    },
    {
      soru: "Hangi kelime çoğul eki almıştır?",
      secenekler: ["Kitap", "Kitaplar", "Kitabım", "Kitapta"],
      dogruCevap: 1,
      aciklama: "'Kitaplar' kelimesi '-lar' çoğul eki almıştır."
    },
    {
      soru: "Aşağıdaki kelimelerden hangisi birleşik kelimedir?",
      secenekler: ["Okul", "Ev", "Hanımeli", "Masa"],
      dogruCevap: 2,
      aciklama: "'Hanımeli' birleşik bir kelimedir."
    },
    {
      soru: "Hangi cümlede noktalama hatası vardır?",
      secenekler: ["Merhaba, nasılsın?", "Güzel bir gün!", "Nereye gidiyorsun.", "Ah, ne güzel!"],
      dogruCevap: 2,
      aciklama: "Soru cümlesi olduğu için sonuna '?' konmalıdır."
    },
    {
      soru: "Aşağıdaki kelimelerden hangisi soyut isimdir?",
      secenekler: ["Masa", "Sevgi", "Kalem", "Araba"],
      dogruCevap: 1,
      aciklama: "'Sevgi' soyut bir isimdir."
    },
    {
      soru: "Hangi kelime sıfat görevinde kullanılmıştır?",
      secenekler: ["Güzel ev", "Ev güzel", "Evde güzel", "Eve güzel"],
      dogruCevap: 0,
      aciklama: "'Güzel' kelimesi 'ev' ismini niteleyen sıfattır."
    }
  ],
  matematik: [
    {
      soru: "5 + 3 = ?",
      secenekler: ["6", "7", "8", "9"],
      dogruCevap: 2,
      aciklama: "5 + 3 = 8"
    },
    {
      soru: "10 - 4 = ?",
      secenekler: ["4", "5", "6", "7"],
      dogruCevap: 2,
      aciklama: "10 - 4 = 6"
    },
    {
      soru: "2 x 6 = ?",
      secenekler: ["10", "12", "14", "16"],
      dogruCevap: 1,
      aciklama: "2 x 6 = 12"
    },
    {
      soru: "15 ÷ 3 = ?",
      secenekler: ["3", "4", "5", "6"],
      dogruCevap: 2,
      aciklama: "15 ÷ 3 = 5"
    },
    {
      soru: "Hangi sayı çifttir?",
      secenekler: ["3", "7", "12", "15"],
      dogruCevap: 2,
      aciklama: "12 çift bir sayıdır."
    },
    {
      soru: "5'in 2 katı kaçtır?",
      secenekler: ["7", "10", "12", "15"],
      dogruCevap: 1,
      aciklama: "5 x 2 = 10"
    },
    {
      soru: "Hangi şekil üçgendir?",
      secenekler: ["Kare", "Daire", "Üçgen", "Dikdörtgen"],
      dogruCevap: 2,
      aciklama: "Üçgen üç kenarlı bir şekildir."
    },
    {
      soru: "1 + 2 + 3 = ?",
      secenekler: ["5", "6", "7", "8"],
      dogruCevap: 1,
      aciklama: "1 + 2 + 3 = 6"
    },
    {
      soru: "Hangi sayı 10'dan küçüktür?",
      secenekler: ["12", "15", "8", "20"],
      dogruCevap: 2,
      aciklama: "8 sayısı 10'dan küçüktür."
    },
    {
      soru: "4 + 4 + 4 = ?",
      secenekler: ["10", "12", "14", "16"],
      dogruCevap: 1,
      aciklama: "4 + 4 + 4 = 12"
    }
  ],
  hayatBilgisi: [
    {
      soru: "Hangi organımız kalp atışını sağlar?",
      secenekler: ["Beyin", "Kalp", "Akciğer", "Mide"],
      dogruCevap: 1,
      aciklama: "Kalp, kanı pompalayan organdır."
    },
    {
      soru: "Hangi mevsimde kar yağar?",
      secenekler: ["Yaz", "Sonbahar", "Kış", "İlkbahar"],
      dogruCevap: 2,
      aciklama: "Kar kış mevsiminde yağar."
    },
    {
      soru: "Hangi hayvan evcil hayvandır?",
      secenekler: ["Aslan", "Kedi", "Kaplan", "Kurt"],
      dogruCevap: 1,
      aciklama: "Kedi evcil bir hayvandır."
    },
    {
      soru: "Hangi renk ana renklerden biridir?",
      secenekler: ["Yeşil", "Kırmızı", "Turuncu", "Mor"],
      dogruCevap: 1,
      aciklama: "Kırmızı ana renklerden biridir."
    },
    {
      soru: "Hangi gezegen Güneş'e en yakındır?",
      secenekler: ["Mars", "Venüs", "Merkür", "Dünya"],
      dogruCevap: 2,
      aciklama: "Merkür Güneş'e en yakın gezegendir."
    },
    {
      soru: "Hangi organımız nefes almamızı sağlar?",
      secenekler: ["Kalp", "Beyin", "Akciğer", "Karaciğer"],
      dogruCevap: 2,
      aciklama: "Akciğer nefes almamızı sağlar."
    },
    {
      soru: "Hangi bitki meyve verir?",
      secenekler: ["Çam", "Elma ağacı", "Kavak", "Çınar"],
      dogruCevap: 1,
      aciklama: "Elma ağacı meyve verir."
    },
    {
      soru: "Hangi hava durumu güzel hava sayılır?",
      secenekler: ["Yağmurlu", "Güneşli", "Karlı", "Fırtınalı"],
      dogruCevap: 1,
      aciklama: "Güneşli hava güzel hava sayılır."
    },
    {
      soru: "Hangi organımız düşünmemizi sağlar?",
      secenekler: ["Kalp", "Beyin", "Mide", "Akciğer"],
      dogruCevap: 1,
      aciklama: "Beyin düşünmemizi sağlar."
    },
    {
      soru: "Hangi hayvan uçabilir?",
      secenekler: ["Balık", "Kuş", "Köpek", "Kedi"],
      dogruCevap: 1,
      aciklama: "Kuş uçabilen bir hayvandır."
    }
  ]
};

// Ders türüne göre soru şablonu seç
function dersTuruSec(dersAdi) {
  const dersAdiLower = dersAdi.toLowerCase();
  if (dersAdiLower.includes('türkçe') || dersAdiLower.includes('turkce')) return 'turkce';
  if (dersAdiLower.includes('matematik')) return 'matematik';
  return 'hayatBilgisi';
}

// Rastgele soru seç
function rastgeleSoruSec(soruListesi) {
  const karisikSorular = [...soruListesi].sort(() => Math.random() - 0.5);
  return karisikSorular.slice(0, 10);
}

try {
  // Tüm konuları al
  const konular = await Konu.find().populate('ders');
  console.log(`📊 Toplam ${konular.length} konu bulundu`);

  let toplamTest = 0;
  let toplamSoru = 0;

  for (const konu of konular) {
    if (!konu.ders || !konu.ders.dersAdi) continue;
    
    const dersTuru = dersTuruSec(konu.ders.dersAdi);
    const soruSablonu = soruSablolari[dersTuru];
    
    console.log(`📝 ${konu.sinifAdi} - ${konu.ders.dersAdi} - ${konu.konuAdi} için 10 test oluşturuluyor...`);
    
    // Her konu için 10 test oluştur
    for (let i = 1; i <= 10; i++) {
      const rastgeleSorular = rastgeleSoruSec(soruSablonu);
      
      const test = new Test({
        testAdi: `${konu.konuAdi} - Test ${i}`,
        aciklama: `${konu.konuAdi} konusu için ${i}. test`,
        sinif: konu.sinif,
        ders: konu.ders._id,
        konu: konu._id,
        konuAdi: konu.konuAdi,
        sorular: rastgeleSorular,
        puan: 10, // Sabit 10 XP
        aktif: true
      });
      
      await test.save();
      toplamTest++;
      toplamSoru += rastgeleSorular.length;
    }
    
    console.log(`✅ ${konu.konuAdi} için 10 test başarıyla oluşturuldu`);
  }

  console.log(`\n🎉 Gerçek soruları olan testler oluşturma tamamlandı!`);
  console.log(`📊 Özet:`);
  console.log(`   - Toplam test: ${toplamTest}`);
  console.log(`   - Toplam soru: ${toplamSoru}`);
  console.log(`   - Her test: 10 XP puanı`);
  console.log(`   - Süre: Yok (anında geçiş)`);
  console.log(`   - Zorluk seviyesi: Yok`);

} catch (error) {
  console.error('❌ Hata:', error);
} finally {
  await mongoose.disconnect();
  console.log('🔌 Veritabanı bağlantısı kapatıldı');
} 