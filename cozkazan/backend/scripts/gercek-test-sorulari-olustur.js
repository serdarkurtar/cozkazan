import mongoose from 'mongoose';
import { getAllKonular } from '../utils/sinifDersKonulari.js';
import Test from '../models/Test.js';
import Konu from '../models/Konu.js';
import Ders from '../models/Ders.js';
import Sinif from '../models/Sinif.js';
import TestHavuzu from '../models/TestHavuzu.js';

// MongoDB bağlantısı
mongoose.connect('mongodb://localhost:27017/cozkazan');

// Konu bazlı test soruları şablonları
const konuSorulari = {
  'Güzel Davranışlarımız': [
    {
      soru: 'Aşağıdakilerden hangisi güzel bir davranıştır?',
      secenekler: [
        'Arkadaşlarımızla kavga etmek',
        'Büyüklerimize saygı göstermek',
        'Çöpleri yere atmak',
        'Başkalarının eşyalarını izinsiz almak'
      ],
      dogruCevap: 1,
      aciklama: 'Büyüklerimize saygı göstermek güzel bir davranıştır.'
    },
    {
      soru: 'Hangi davranış doğru değildir?',
      secenekler: [
        'Teşekkür etmek',
        'Özür dilemek',
        'Yalan söylemek',
        'Selam vermek'
      ],
      dogruCevap: 2,
      aciklama: 'Yalan söylemek doğru bir davranış değildir.'
    },
    {
      soru: 'Sınıfta nasıl davranmalıyız?',
      secenekler: [
        'Gürültü yaparak',
        'Sessizce ve düzenli',
        'Sürekli konuşarak',
        'Yerimizden kalkarak'
      ],
      dogruCevap: 1,
      aciklama: 'Sınıfta sessizce ve düzenli davranmalıyız.'
    }
  ],
  'Mustafa Kemal\'den Atatürk\'e': [
    {
      soru: 'Atatürk hangi tarihte doğmuştur?',
      secenekler: [
        '1881',
        '1882',
        '1883',
        '1884'
      ],
      dogruCevap: 0,
      aciklama: 'Atatürk 1881 yılında doğmuştur.'
    },
    {
      soru: 'Atatürk\'ün doğduğu şehir hangisidir?',
      secenekler: [
        'İstanbul',
        'Ankara',
        'Selanik',
        'İzmir'
      ],
      dogruCevap: 2,
      aciklama: 'Atatürk Selanik\'te doğmuştur.'
    },
    {
      soru: 'Atatürk hangi savaşta "Geldikleri gibi giderler" demiştir?',
      secenekler: [
        'Çanakkale Savaşı',
        'Kurtuluş Savaşı',
        'Sakarya Savaşı',
        'Büyük Taarruz'
      ],
      dogruCevap: 0,
      aciklama: 'Atatürk Çanakkale Savaşı\'nda "Geldikleri gibi giderler" demiştir.'
    }
  ],
  'Çevremizdeki Yaşam': [
    {
      soru: 'Aşağıdakilerden hangisi canlı bir varlıktır?',
      secenekler: [
        'Taş',
        'Su',
        'Ağaç',
        'Toprak'
      ],
      dogruCevap: 2,
      aciklama: 'Ağaç canlı bir varlıktır.'
    },
    {
      soru: 'Hangi hayvan evcil bir hayvandır?',
      secenekler: [
        'Aslan',
        'Kedi',
        'Kaplan',
        'Kurt'
      ],
      dogruCevap: 1,
      aciklama: 'Kedi evcil bir hayvandır.'
    },
    {
      soru: 'Bitkiler nasıl beslenir?',
      secenekler: [
        'Et yiyerek',
        'Güneş ışığı ile',
        'Su içerek',
        'Topraktan besin alarak'
      ],
      dogruCevap: 3,
      aciklama: 'Bitkiler topraktan besin alarak beslenir.'
    }
  ],
  'Sayılar ve Nicelikler (1)': [
    {
      soru: '5 + 3 = ?',
      secenekler: [
        '6',
        '7',
        '8',
        '9'
      ],
      dogruCevap: 2,
      aciklama: '5 + 3 = 8'
    },
    {
      soru: '10 - 4 = ?',
      secenekler: [
        '4',
        '5',
        '6',
        '7'
      ],
      dogruCevap: 2,
      aciklama: '10 - 4 = 6'
    },
    {
      soru: 'Hangi sayı 5\'ten büyüktür?',
      secenekler: [
        '3',
        '4',
        '6',
        '2'
      ],
      dogruCevap: 2,
      aciklama: '6 sayısı 5\'ten büyüktür.'
    }
  ],
  'Ben ve Okulum': [
    {
      soru: 'Okula ne zaman gideriz?',
      secenekler: [
        'Hafta sonu',
        'Hafta içi',
        'Gece',
        'Tatilde'
      ],
      dogruCevap: 1,
      aciklama: 'Okula hafta içi gideriz.'
    },
    {
      soru: 'Okulda hangi eşyayı kullanırız?',
      secenekler: [
        'Televizyon',
        'Kalem',
        'Buzdolabı',
        'Çamaşır makinesi'
      ],
      dogruCevap: 1,
      aciklama: 'Okulda kalem kullanırız.'
    },
    {
      soru: 'Sınıfımızda kaç kişi olmalı?',
      secenekler: [
        'Çok kalabalık',
        'Düzenli ve sessiz',
        'Gürültülü',
        'Dağınık'
      ],
      dogruCevap: 1,
      aciklama: 'Sınıfımızda düzenli ve sessiz olmalıyız.'
    }
  ],
  'Sağlığım ve Güvenliğim': [
    {
      soru: 'Hangi besin sağlıklıdır?',
      secenekler: [
        'Çok fazla şeker',
        'Meyve',
        'Çok tuzlu yemek',
        'Gazlı içecek'
      ],
      dogruCevap: 1,
      aciklama: 'Meyve sağlıklı bir besindir.'
    },
    {
      soru: 'Güvenlik için ne yapmalıyız?',
      secenekler: [
        'Yolda oyun oynamak',
        'Trafik ışıklarına uymak',
        'Yabancılarla konuşmak',
        'Tek başına dışarı çıkmak'
      ],
      dogruCevap: 1,
      aciklama: 'Güvenlik için trafik ışıklarına uymalıyız.'
    },
    {
      soru: 'Hangi davranış tehlikelidir?',
      secenekler: [
        'Ellerimizi yıkamak',
        'Elektrik prizine dokunmak',
        'Dişlerimizi fırçalamak',
        'Meyve yemek'
      ],
      dogruCevap: 1,
      aciklama: 'Elektrik prizine dokunmak tehlikelidir.'
    }
  ]
};

// Rastgele soru seç
function rastgeleSoruSec(konuAdi) {
  const sorular = konuSorulari[konuAdi];
  if (!sorular || sorular.length === 0) {
    // Varsayılan soru
    return {
      soru: `${konuAdi} konusuyla ilgili bir soru`,
      secenekler: ['A şıkkı', 'B şıkkı', 'C şıkkı', 'D şıkkı'],
      dogruCevap: Math.floor(Math.random() * 4),
      aciklama: 'Bu soru otomatik oluşturulmuştur.'
    };
  }
  return sorular[Math.floor(Math.random() * sorular.length)];
}

// Konu için test oluştur
async function konuIcinTestOlustur(konu, testSayisi = 10) {
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
        const soru = rastgeleSoruSec(konu.konu);
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
async function gercekTestSorulariOlustur() {
  try {
    console.log('🚀 Gerçek test soruları oluşturma başlıyor...');
    
    const tumKonular = getAllKonular();
    console.log(`📊 Toplam ${tumKonular.length} konu bulundu`);

    let toplamTest = 0;
    let basariliKonu = 0;

    for (const konu of tumKonular) {
      const testSayisi = await konuIcinTestOlustur(konu, 10); // Her konuya 10 test
      if (testSayisi > 0) {
        toplamTest += testSayisi;
        basariliKonu++;
      }
      
      // Her 10 konuda bir ilerleme raporu
      if (basariliKonu % 10 === 0) {
        console.log(`📈 İlerleme: ${basariliKonu}/${tumKonular.length} konu tamamlandı`);
      }
    }

    console.log('\n🎉 Gerçek test soruları oluşturma tamamlandı!');
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
gercekTestSorulariOlustur(); 