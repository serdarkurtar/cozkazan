import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Test from './models/Test.js';
import Sinif from './models/Sinif.js';
import Ders from './models/Ders.js';
import Konu from './models/Konu.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cozkazan';

// 3. Sınıf test verileri
const ucuncuSinifVerileri = [
  // Türkçe Dersi Testleri
  {
    ders: 'Türkçe',
    konular: [
      {
        konu: 'Değerlerimizle Yaşıyoruz',
        testler: [
          { testAdi: 'Değerlerimizle Yaşıyoruz - Test 1', aciklama: 'Değerlerimizle yaşamakla ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Atatürk ve Kahramanlarımız',
        testler: [
          { testAdi: 'Atatürk ve Kahramanlarımız - Test 1', aciklama: 'Atatürk ve kahramanlarımız hakkında temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Doğayı Tanıyoruz',
        testler: [
          { testAdi: 'Doğayı Tanıyoruz - Test 1', aciklama: 'Doğayı tanıma ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Bilgi Hazinemiz',
        testler: [
          { testAdi: 'Bilgi Hazinemiz - Test 1', aciklama: 'Bilgi hazinesi ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Yeteneklerimizi Kullanıyoruz',
        testler: [
          { testAdi: 'Yeteneklerimizi Kullanıyoruz - Test 1', aciklama: 'Yeteneklerimizi kullanma ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Bilim Yolculuğu',
        testler: [
          { testAdi: 'Bilim Yolculuğu - Test 1', aciklama: 'Bilim yolculuğu ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Millî Kültürümüz',
        testler: [
          { testAdi: 'Millî Kültürümüz - Test 1', aciklama: 'Millî kültürümüz ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Hak ve Sorumluluklarımız',
        testler: [
          { testAdi: 'Hak ve Sorumluluklarımız - Test 1', aciklama: 'Hak ve sorumluluklarımız ile ilgili temel bilgileri ölçen test' },
        ]
      },
    ]
  },

  // Matematik Dersi Testleri
  {
    ders: 'Matematik',
    konular: [
      {
        konu: 'Sayılar ve Nicelikler (1)',
        testler: [
          { testAdi: 'Sayılar ve Nicelikler (1) - Test 1', aciklama: 'Sayılar ve nicelikler (1) ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Sayılar ve Nicelikler (2)',
        testler: [
          { testAdi: 'Sayılar ve Nicelikler (2) - Test 1', aciklama: 'Sayılar ve nicelikler (2) ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'İşlemlerden Cebirsel Düşünmeye',
        testler: [
          { testAdi: 'İşlemlerden Cebirsel Düşünmeye - Test 1', aciklama: 'İşlemlerden cebirsel düşünmeye ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Nesnelerin Geometrisi (1)',
        testler: [
          { testAdi: 'Nesnelerin Geometrisi (1) - Test 1', aciklama: 'Nesnelerin geometrisi (1) ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Nesnelerin Geometrisi (2)',
        testler: [
          { testAdi: 'Nesnelerin Geometrisi (2) - Test 1', aciklama: 'Nesnelerin geometrisi (2) ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Veriye Dayalı Araştırma',
        testler: [
          { testAdi: 'Veriye Dayalı Araştırma - Test 1', aciklama: 'Veriye dayalı araştırma ile ilgili temel bilgileri ölçen test' },
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
          { testAdi: 'Ben ve Okulum - Test 1', aciklama: 'Ben ve okulum ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Sağlığım ve Güvenliğim',
        testler: [
          { testAdi: 'Sağlığım ve Güvenliğim - Test 1', aciklama: 'Sağlığım ve güvenliğim ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Ailem ve Toplum',
        testler: [
          { testAdi: 'Ailem ve Toplum - Test 1', aciklama: 'Ailem ve toplum ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Yaşadığım Yer ve Ülkem',
        testler: [
          { testAdi: 'Yaşadığım Yer ve Ülkem - Test 1', aciklama: 'Yaşadığım yer ve ülkem ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Doğa ve Çevre',
        testler: [
          { testAdi: 'Doğa ve Çevre - Test 1', aciklama: 'Doğa ve çevre ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Bilim, Teknoloji ve Sanat',
        testler: [
          { testAdi: 'Bilim, Teknoloji ve Sanat - Test 1', aciklama: 'Bilim, teknoloji ve sanat ile ilgili temel bilgileri ölçen test' },
        ]
      },
    ]
  },

  // Fen Bilimleri Dersi Testleri
  {
    ders: 'Fen Bilimleri',
    konular: [
      {
        konu: 'Bilimsel Keşif Yolculuğu',
        testler: [
          { testAdi: 'Bilimsel Keşif Yolculuğu - Test 1', aciklama: 'Bilimsel keşif yolculuğu ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Canlılar Dünyasına Yolculuk',
        testler: [
          { testAdi: 'Canlılar Dünyasına Yolculuk - Test 1', aciklama: 'Canlılar dünyasına yolculuk ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Yer Bilimleri',
        testler: [
          { testAdi: 'Yer Bilimleri - Test 1', aciklama: 'Yer bilimleri ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Maddeyi Tanıyalım',
        testler: [
          { testAdi: 'Maddeyi Tanıyalım - Test 1', aciklama: 'Maddeyi tanıyalım ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Hareket',
        testler: [
          { testAdi: 'Hareket - Test 1', aciklama: 'Hareket ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Elektrik',
        testler: [
          { testAdi: 'Elektrik - Test 1', aciklama: 'Elektrik ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Tarım',
        testler: [
          { testAdi: 'Tarım - Test 1', aciklama: 'Tarım ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Canlıların Yaşam Alanları',
        testler: [
          { testAdi: 'Canlıların Yaşam Alanları - Test 1', aciklama: 'Canlıların yaşam alanları ile ilgili temel bilgileri ölçen test' },
        ]
      },
    ]
  },
];

async function loadData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı!');

    const sinifAdi = "3. Sınıf";
    let sinif = await Sinif.findOne({ ad: sinifAdi });
    if (!sinif) {
      sinif = await new Sinif({ ad: sinifAdi, aktif: true }).save();
      console.log(`✨ Yeni sınıf oluşturuldu: ${sinif.ad}`);
    } else {
      console.log(`ℹ️ Sınıf zaten mevcut: ${sinif.ad}`);
    }

    for (const dersData of ucuncuSinifVerileri) {
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
            console.log(`      ✅ ${konu.ad} konusu için ${testlerToInsert.length} test başarıyla eklendi.`);
        }
      }
    }
    
    console.log('✅ 3. Sınıf verileri başarıyla yüklendi!');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB bağlantısı kapatıldı.');
  }
}

loadData(); 