import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Test from './models/Test.js';
import Sinif from './models/Sinif.js';
import Ders from './models/Ders.js';
import Konu from './models/Konu.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cozkazan';

// 2. Sınıf test verileri
const ikinciSinifVerileri = [
  // Türkçe Dersi Testleri
  {
    ders: 'Türkçe',
    konular: [
      {
        konu: 'Değerlerimizle Varız',
        testler: [
          { testAdi: 'Değerlerimizle Varız - Test 1', aciklama: 'Değerlerimizle ilgili temel bilgileri ölçen test' },
          { testAdi: 'Atatürk ve Çocuk - Test 1', aciklama: 'Atatürk ve çocuklar hakkında temel bilgileri ölçen test' },
          { testAdi: 'Doğada Neler Oluyor? - Test 1', aciklama: 'Doğadaki olaylar hakkında temel bilgileri ölçen test' },
          { testAdi: 'Okuma Serüvenimiz - Test 1', aciklama: 'Okuma alışkanlığı ve kitaplar hakkında temel bilgileri ölçen test' },
          { testAdi: 'Yeteneklerimizi Tanıyoruz - Test 1', aciklama: 'Yeteneklerimizi tanıma konusunda temel bilgileri ölçen test' },
          { testAdi: 'Kültür Hazinemiz - Test 1', aciklama: 'Kültürümüz ve değerlerimiz hakkında temel bilgileri ölçen test' },
          { testAdi: 'Haklarımızı Biliyoruz - Test 1', aciklama: 'Haklarımız ve sorumluluklarımız hakkında temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Atatürk ve Çocuk',
        testler: [
          { testAdi: 'Atatürk ve Çocuk - Test 1', aciklama: 'Atatürk ve çocuklar hakkında temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Doğada Neler Oluyor?',
        testler: [
          { testAdi: 'Doğada Neler Oluyor? - Test 1', aciklama: 'Doğadaki olaylar hakkında temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Okuma Serüvenimiz',
        testler: [
          { testAdi: 'Okuma Serüvenimiz - Test 1', aciklama: 'Okuma alışkanlığı ve kitaplar hakkında temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Yeteneklerimizi Tanıyoruz',
        testler: [
          { testAdi: 'Yeteneklerimizi Tanıyoruz - Test 1', aciklama: 'Yeteneklerimizi tanıma konusunda temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Kültür Hazinemiz',
        testler: [
          { testAdi: 'Kültür Hazinemiz - Test 1', aciklama: 'Kültürümüz ve değerlerimiz hakkında temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Haklarımızı Biliyoruz',
        testler: [
          { testAdi: 'Haklarımızı Biliyoruz - Test 1', aciklama: 'Haklarımız ve sorumluluklarımız hakkında temel bilgileri ölçen test' },
        ]
      },
    ]
  },

  // Matematik Dersi Testleri
  {
    ders: 'Matematik',
    konular: [
      {
        konu: 'Nesnelerin Geometrisi (1)',
        testler: [
          { testAdi: 'Nesnelerin Geometrisi (1) - Test 1', aciklama: 'Geometrik şekiller konusunda temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Sayılar ve Nicelikler (1)',
        testler: [
          { testAdi: 'Sayılar ve Nicelikler (1) - Test 1', aciklama: 'Sayılar ve nicelikler konusunda temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'İşlemlerden Cebirsel Düşünmeye',
        testler: [
          { testAdi: 'İşlemlerden Cebirsel Düşünmeye - Test 1', aciklama: 'İşlemler ve cebirsel düşünme konusunda temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Sayılar ve Nicelikler (2)',
        testler: [
          { testAdi: 'Sayılar ve Nicelikler (2) - Test 1', aciklama: 'Sayılar ve nicelikler konusunda orta seviye bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Nesnelerin Geometrisi (2)',
        testler: [
          { testAdi: 'Nesnelerin Geometrisi (2) - Test 1', aciklama: 'Geometrik şekiller konusunda ileri seviye bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Veriye Dayalı Araştırma',
        testler: [
          { testAdi: 'Veriye Dayalı Araştırma - Test 1', aciklama: 'Veri analizi konusunda temel bilgileri ölçen test' },
        ]
      },
    ]
  },

  // Hayat Bilgisi Dersi Testleri
  {
    ders: 'Hayat Bilgisi',
    konular: [
      {
        konu: 'Ben ve Okulum',
        testler: [
          { testAdi: 'Ben ve Okulum - Test 1', aciklama: 'Okul ve benlik konusunda temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Sağlığım ve Güvenliğim',
        testler: [
          { testAdi: 'Sağlığım ve Güvenliğim - Test 1', aciklama: 'Sağlık ve güvenlik konusunda temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Ailem ve Toplum',
        testler: [
          { testAdi: 'Ailem ve Toplum - Test 1', aciklama: 'Aile ve toplum konusunda temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Yaşadığım Yer ve Ülkem',
        testler: [
          { testAdi: 'Yaşadığım Yer ve Ülkem - Test 1', aciklama: 'Coğrafya ve vatan konusunda temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Doğa ve Çevre',
        testler: [
          { testAdi: 'Doğa ve Çevre - Test 1', aciklama: 'Doğa ve çevre konusunda temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Bilim, Teknoloji ve Sanat',
        testler: [
          { testAdi: 'Bilim, Teknoloji ve Sanat - Test 1', aciklama: 'Bilim, teknoloji ve sanat konusunda temel bilgileri ölçen test' },
        ]
      },
    ]
  },
];

async function loadSecondGradeData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı!');

    const sinifAdi = "2. Sınıf";
    let sinif = await Sinif.findOne({ ad: sinifAdi });
    if (!sinif) {
      sinif = await new Sinif({ ad: sinifAdi, aktif: true }).save();
      console.log(`✨ Yeni sınıf oluşturuldu: ${sinif.ad}`);
    } else {
      console.log(`ℹ️ Sınıf zaten mevcut: ${sinif.ad}`);
    }

    for (const dersData of ikinciSinifVerileri) {
      const dersAdi = dersData.ders;
      let ders = await Ders.findOne({ ad: dersAdi, sinif: sinif._id });
      if (!ders) {
        ders = await new Ders({ ad: dersAdi, sinif: sinif._id, aktif: true }).save();
        console.log(`  ✨ Yeni ders oluşturuldu: ${ders.ad}`);
      } else {
        console.log(`  ℹ️ Ders zaten mevcut: ${ders.ad}`);
      }

      for (const [index, konuData] of dersData.konular.entries()) {
        const konuAdi = konuData.konu;
        let konu = await Konu.findOne({ ad: konuAdi, ders: ders._id });
        if (!konu) {
          konu = await new Konu({ 
            ad: konuAdi, 
            sira: index + 1, // Sırayı burada ekliyoruz
            ders: ders._id, 
            sinif: sinif._id, 
            aktif: true 
          }).save();
          console.log(`    ✨ Yeni konu oluşturuldu: ${konu.ad}`);
        } else {
          // İsteğe bağlı: Mevcut konunun sıra numarasını güncelle
          if (konu.sira !== index + 1) {
            konu.sira = index + 1;
            await konu.save();
            console.log(`    ✏️ Konu sırası güncellendi: ${konu.ad}`);
          } else {
            console.log(`    ℹ️ Konu zaten mevcut: ${konu.ad}`);
          }
        }

        const testlerToInsert = konuData.testler.map(test => ({
          testAdi: test.testAdi,
          aciklama: test.aciklama,
          sinif: sinif._id,
          ders: ders._id,
          konu: konu._id,
          aktif: true
        }));
        
        if (testlerToInsert.length > 0) {
            await Test.insertMany(testlerToInsert);
            console.log(`      ✅ ${konuAdi} konusu için ${testlerToInsert.length} test başarıyla eklendi.`);
        }
      }
    }
    
    console.log('✅ 2. Sınıf verileri başarıyla yüklendi!');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB bağlantısı kapatıldı.');
  }
}

loadSecondGradeData(); 