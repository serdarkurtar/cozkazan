import mongoose from 'mongoose';
import { getAllKonular } from '../utils/sinifDersKonulari.js';
import Test from '../models/Test.js';
import Konu from '../models/Konu.js';
import TestHavuzu from '../models/TestHavuzu.js';
import Ders from '../models/Ders.js';
import Sinif from '../models/Sinif.js';

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/cozkazan');

// Test soruları şablonları
const testSoruSablonlari = {
  'Türkçe': [
    {
      soru: 'Aşağıdaki kelimelerden hangisi eş anlamlıdır?',
      secenekler: ['A) Büyük - Küçük', 'B) Güzel - Hoş', 'C) Hızlı - Yavaş', 'D) Sıcak - Soğuk'],
      dogruCevap: 1,
      aciklama: 'Güzel ve hoş kelimeleri aynı anlama gelir.'
    },
    {
      soru: 'Hangi cümlede yazım hatası vardır?',
      secenekler: ['A) Okula gidiyorum.', 'B) Kitabı okuyorum.', 'C) Evde kalıyorum.', 'D) Parka gidiyorum.'],
      dogruCevap: 0,
      aciklama: 'Tüm cümleler doğru yazılmıştır.'
    },
    {
      soru: 'Aşağıdaki kelimelerden hangisi zıt anlamlıdır?',
      secenekler: ['A) Mutlu - Neşeli', 'B) Uzun - Kısa', 'C) Güzel - Hoş', 'D) Büyük - Geniş'],
      dogruCevap: 1,
      aciklama: 'Uzun ve kısa kelimeleri zıt anlamlıdır.'
    }
  ],
  'Matematik': [
    {
      soru: '5 + 3 = ?',
      secenekler: ['A) 6', 'B) 7', 'C) 8', 'D) 9'],
      dogruCevap: 2,
      aciklama: '5 + 3 = 8'
    },
    {
      soru: '10 - 4 = ?',
      secenekler: ['A) 4', 'B) 5', 'C) 6', 'D) 7'],
      dogruCevap: 2,
      aciklama: '10 - 4 = 6'
    },
    {
      soru: '2 x 3 = ?',
      secenekler: ['A) 4', 'B) 5', 'C) 6', 'D) 7'],
      dogruCevap: 2,
      aciklama: '2 x 3 = 6'
    }
  ],
  'Hayat Bilgisi': [
    {
      soru: 'Aşağıdakilerden hangisi güvenlik kuralıdır?',
      secenekler: ['A) Yolda oyun oynamak', 'B) Trafik ışıklarına uymak', 'C) Yabancılarla konuşmak', 'D) Tek başına dışarı çıkmak'],
      dogruCevap: 1,
      aciklama: 'Trafik ışıklarına uymak güvenlik kuralıdır.'
    },
    {
      soru: 'Hangi davranış doğrudur?',
      secenekler: ['A) Çöpleri yere atmak', 'B) Suyu israf etmek', 'C) Çevreyi temiz tutmak', 'D) Ağaçları kesmek'],
      dogruCevap: 2,
      aciklama: 'Çevreyi temiz tutmak doğru bir davranıştır.'
    }
  ],
  'Fen Bilimleri': [
    {
      soru: 'Aşağıdakilerden hangisi canlı bir varlıktır?',
      secenekler: ['A) Taş', 'B) Su', 'C) Ağaç', 'D) Toprak'],
      dogruCevap: 2,
      aciklama: 'Ağaç canlı bir varlıktır.'
    },
    {
      soru: 'Hangi madde sıvı haldedir?',
      secenekler: ['A) Buz', 'B) Su', 'C) Buhar', 'D) Kar'],
      dogruCevap: 1,
      aciklama: 'Su sıvı haldedir.'
    }
  ],
  'Sosyal Bilgiler': [
    {
      soru: 'Türkiye\'nin başkenti neresidir?',
      secenekler: ['A) İstanbul', 'B) Ankara', 'C) İzmir', 'D) Bursa'],
      dogruCevap: 1,
      aciklama: 'Türkiye\'nin başkenti Ankara\'dır.'
    },
    {
      soru: 'Hangi tarih Türkiye Cumhuriyeti\'nin kuruluş tarihidir?',
      secenekler: ['A) 23 Nisan 1920', 'B) 29 Ekim 1923', 'C) 30 Ağustos 1922', 'D) 19 Mayıs 1919'],
      dogruCevap: 1,
      aciklama: '29 Ekim 1923 Türkiye Cumhuriyeti\'nin kuruluş tarihidir.'
    }
  ]
};

// Rastgele test sorusu oluştur
function rastgeleSoruOlustur(ders, konuAdi, testNo) {
  const sablonlar = testSoruSablonlari[ders] || testSoruSablonlari['Türkçe'];
  const sablon = sablonlar[Math.floor(Math.random() * sablonlar.length)];
  
  return {
    soru: `${konuAdi} - Test ${testNo}: ${sablon.soru}`,
    secenekler: sablon.secenekler,
    dogruCevap: sablon.dogruCevap,
    aciklama: sablon.aciklama
  };
}

// Konu için test oluştur
async function konuIcinTestOlustur(konu, testSayisi = 50) {
  try {
    // Sınıfı bul
    const sinifDoc = await Sinif.findOne({ ad: `${konu.sinif}. Sınıf` });
    if (!sinifDoc) {
      console.log(`❌ Sınıf bulunamadı: ${konu.sinif}. Sınıf`);
      return 0;
    }

    // Dersi bul
    const dersDoc = await Ders.findOne({ ad: konu.ders, sinif: sinifDoc._id });
    if (!dersDoc) {
      console.log(`❌ Ders bulunamadı: ${konu.ders} (${konu.sinif}. Sınıf)`);
      return 0;
    }

    // Konuyu bul
    const konuDoc = await Konu.findOne({ 
      ad: konu.konu,
      ders: dersDoc._id,
      sinif: sinifDoc._id
    });

    if (!konuDoc) {
      console.log(`❌ Konu bulunamadı: ${konu.sinif}. Sınıf - ${konu.ders} - ${konu.konu}`);
      return 0;
    }

    console.log(`📝 ${konu.sinif}. Sınıf - ${konu.ders} - ${konu.konu} için ${testSayisi} test oluşturuluyor...`);

    const testler = [];
    
    for (let i = 1; i <= testSayisi; i++) {
      const sorular = [];
      
      // Her test için 10 soru oluştur
      for (let j = 1; j <= 10; j++) {
        const soru = rastgeleSoruOlustur(konu.ders, konu.konu, i);
        sorular.push(soru);
      }

      const test = {
        testAdi: `${konu.konu} - Test ${i}`,
        aciklama: `${konu.sinif}. Sınıf ${konu.ders} dersi ${konu.konu} konusu için ${i}. test`,
        sinif: sinifDoc._id,
        ders: dersDoc._id,
        konu: konuDoc._id,
        konuAdi: konu.konu,
        sorular: sorular,
        zorlukSeviyesi: Math.floor(Math.random() * 3) + 1, // 1-3 arası
        sure: 20, // dakika
        puan: 100,
        aktif: true,
        olusturmaTarihi: new Date()
      };

      testler.push(test);
    }

    // Testleri veritabanına kaydet
    const kaydedilenTestler = await Test.insertMany(testler);
    console.log(`✅ ${kaydedilenTestler.length} test başarıyla oluşturuldu`);

    // Test havuzunu güncelle
    await TestHavuzu.findOneAndUpdate(
      { konu: konuDoc._id },
      { 
        $inc: { 
          testSayisi: kaydedilenTestler.length,
          toplamSoru: kaydedilenTestler.length * 10
        }
      },
      { upsert: true }
    );

    return kaydedilenTestler.length;

  } catch (error) {
    console.error(`❌ Hata: ${konu.konu} için test oluşturulamadı:`, error.message);
    return 0;
  }
}

// Ana fonksiyon
async function otomatikTestOlustur() {
  try {
    console.log('🚀 Otomatik test oluşturma başlıyor...');
    
    const tumKonular = getAllKonular();
    console.log(`📊 Toplam ${tumKonular.length} konu bulundu`);

    let toplamTest = 0;
    let basariliKonu = 0;

    for (const konu of tumKonular) {
      const testSayisi = await konuIcinTestOlustur(konu, 50);
      if (testSayisi > 0) {
        toplamTest += testSayisi;
        basariliKonu++;
      }
      
      // Her 10 konuda bir ilerleme raporu
      if (basariliKonu % 10 === 0) {
        console.log(`📈 İlerleme: ${basariliKonu}/${tumKonular.length} konu tamamlandı`);
      }
    }

    console.log('\n🎉 Otomatik test oluşturma tamamlandı!');
    console.log(`📊 Özet:`);
    console.log(`   - Başarılı konu: ${basariliKonu}/${tumKonular.length}`);
    console.log(`   - Toplam test: ${toplamTest}`);
    console.log(`   - Toplam soru: ${toplamTest * 10}`);

  } catch (error) {
    console.error('❌ Genel hata:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Veritabanı bağlantısı kapatıldı');
  }
}

// Script çalıştır
otomatikTestOlustur(); 