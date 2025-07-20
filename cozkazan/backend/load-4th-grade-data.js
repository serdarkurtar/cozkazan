import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Test from './models/Test.js';
import Sinif from './models/Sinif.js';
import Ders from './models/Ders.js';
import Konu from './models/Konu.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cozkazan';

// 4. Sınıf test verileri
const dorduncuSinifVerileri = [
  // Türkçe Dersi Testleri
  {
    ders: 'Türkçe',
    konular: [
      {
        konu: 'Erdemler',
        testler: [
          { testAdi: 'Erdemler - Test 1', aciklama: 'Erdemler ile ilgili temel bilgileri ölçen test' },
          { testAdi: 'Millî Mücadele ve Atatürk - Test 1', aciklama: 'Millî Mücadele ve Atatürk ile ilgili temel bilgileri ölçen test' },
          { testAdi: 'Doğa ve İnsan - Test 1', aciklama: 'Doğa ve insan ile ilgili temel bilgileri ölçen test' },
          { testAdi: 'Kütüphanemiz - Test 1', aciklama: 'Kütüphane ile ilgili temel bilgileri ölçen test' },
          { testAdi: 'Kendimizi Geliştiriyoruz - Test 1', aciklama: 'Kendimizi geliştirme ile ilgili temel bilgileri ölçen test' },
          { testAdi: 'Bilim ve Teknoloji - Test 1', aciklama: 'Bilim ve teknoloji ile ilgili temel bilgileri ölçen test' },
          { testAdi: 'Geçmişten Geleceğe Mirasımız - Test 1', aciklama: 'Mirasımız ile ilgili temel bilgileri ölçen test' },
          { testAdi: 'Demokratik Yaşam - Test 1', aciklama: 'Demokratik yaşam ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Millî Mücadele ve Atatürk',
        testler: [
          { testAdi: 'Millî Mücadele ve Atatürk - Test 1', aciklama: 'Millî Mücadele ve Atatürk ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Doğa ve İnsan',
        testler: [
          { testAdi: 'Doğa ve İnsan - Test 1', aciklama: 'Doğa ve insan ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Kütüphanemiz',
        testler: [
          { testAdi: 'Kütüphanemiz - Test 1', aciklama: 'Kütüphane ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Kendimizi Geliştiriyoruz',
        testler: [
          { testAdi: 'Kendimizi Geliştiriyoruz - Test 1', aciklama: 'Kendimizi geliştirme ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Bilim ve Teknoloji',
        testler: [
          { testAdi: 'Bilim ve Teknoloji - Test 1', aciklama: 'Bilim ve teknoloji ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Geçmişten Geleceğe Mirasımız',
        testler: [
          { testAdi: 'Geçmişten Geleceğe Mirasımız - Test 1', aciklama: 'Mirasımız ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Demokratik Yaşam',
        testler: [
          { testAdi: 'Demokratik Yaşam - Test 1', aciklama: 'Demokratik yaşam ile ilgili temel bilgileri ölçen test' },
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
        konu: 'Nesnelerin Geometrisi (3)',
        testler: [
          { testAdi: 'Nesnelerin Geometrisi (3) - Test 1', aciklama: 'Nesnelerin geometrisi (3) ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Olasılık ve Veriye Dayalı Araştırma',
        testler: [
          { testAdi: 'Olasılık ve Veriye Dayalı Araştırma - Test 1', aciklama: 'Olasılık ve veriye dayalı araştırma ile ilgili temel bilgileri ölçen test' },
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
        konu: 'Bilime Yolculuk',
        testler: [
          { testAdi: 'Bilime Yolculuk - Test 1', aciklama: 'Bilime yolculuk ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Beş Duyumuz',
        testler: [
          { testAdi: 'Beş Duyumuz - Test 1', aciklama: 'Beş duyumuz ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Dünyamız',
        testler: [
          { testAdi: 'Dünyamız - Test 1', aciklama: 'Dünyamız ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Maddenin Değişimi',
        testler: [
          { testAdi: 'Maddenin Değişimi - Test 1', aciklama: 'Maddenin değişimi ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Mıknatıs',
        testler: [
          { testAdi: 'Mıknatıs - Test 1', aciklama: 'Mıknatıs ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Enerji Dedektifleri',
        testler: [
          { testAdi: 'Enerji Dedektifleri - Test 1', aciklama: 'Enerji dedektifleri ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Işığın Peşinde',
        testler: [
          { testAdi: 'Işığın Peşinde - Test 1', aciklama: 'Işığın peşinde ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Sürdürülebilir Şehirler',
        testler: [
          { testAdi: 'Sürdürülebilir Şehirler - Test 1', aciklama: 'Sürdürülebilir şehirler ile ilgili temel bilgileri ölçen test' },
        ]
      },
    ]
  },

  // Sosyal Bilgiler Dersi Testleri
  {
    ders: 'Sosyal Bilgiler',
    konular: [
      {
        konu: 'Birlikte Yaşamak',
        testler: [
          { testAdi: 'Birlikte Yaşamak - Test 1', aciklama: 'Birlikte yaşamak ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Evimiz Dünya',
        testler: [
          { testAdi: 'Evimiz Dünya - Test 1', aciklama: 'Evimiz dünya ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Ortak Mirasımız',
        testler: [
          { testAdi: 'Ortak Mirasımız - Test 1', aciklama: 'Ortak mirasımız ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Yaşayan Demokrasimiz',
        testler: [
          { testAdi: 'Yaşayan Demokrasimiz - Test 1', aciklama: 'Yaşayan demokrasimiz ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Hayatımızdaki Ekonomi',
        testler: [
          { testAdi: 'Hayatımızdaki Ekonomi - Test 1', aciklama: 'Hayatımızdaki ekonomi ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Teknoloji ve Sosyal Bilimler',
        testler: [
          { testAdi: 'Teknoloji ve Sosyal Bilimler - Test 1', aciklama: 'Teknoloji ve sosyal bilimler ile ilgili temel bilgileri ölçen test' },
        ]
      },
    ]
  },

  // Din Kültürü ve Ahlak Bilgisi Dersi Testleri
  {
    ders: 'Din Kültürü ve Ahlak Bilgisi',
    konular: [
      {
        konu: 'Günlük Hayat ve Din',
        testler: [
          { testAdi: 'Günlük Hayat ve Din - Test 1', aciklama: 'Günlük hayat ve din ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Allah Sevgisi',
        testler: [
          { testAdi: 'Allah Sevgisi - Test 1', aciklama: 'Allah sevgisi ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Peygamberlerin Sevgisi',
        testler: [
          { testAdi: 'Peygamberlerin Sevgisi - Test 1', aciklama: 'Peygamberlerin sevgisi ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Ahlaki Değerlerimiz',
        testler: [
          { testAdi: 'Ahlaki Değerlerimiz - Test 1', aciklama: 'Ahlaki değerlerimiz ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Haklar ve Sorumluluklar',
        testler: [
          { testAdi: 'Haklar ve Sorumluluklar - Test 1', aciklama: 'Haklar ve sorumluluklar ile ilgili temel bilgileri ölçen test' },
        ]
      },
    ]
  },

  // İnsan Hakları, Vatandaşlık ve Demokrasi Dersi Testleri
  {
    ders: 'İnsan Hakları, Vatandaşlık ve Demokrasi',
    konular: [
      {
        konu: 'Çocuk Olarak Haklarım',
        testler: [
          { testAdi: 'Çocuk Olarak Haklarım - Test 1', aciklama: 'Çocuk olarak haklarımız ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Eşitlik ve Adalet',
        testler: [
          { testAdi: 'Eşitlik ve Adalet - Test 1', aciklama: 'Eşitlik ve adalet ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Etkin Vatandaşlık',
        testler: [
          { testAdi: 'Etkin Vatandaşlık - Test 1', aciklama: 'Etkin vatandaşlık ile ilgili temel bilgileri ölçen test' },
        ]
      },
      {
        konu: 'Hayatımda Demokrasi',
        testler: [
          { testAdi: 'Hayatımda Demokrasi - Test 1', aciklama: 'Hayatımızda demokrasi ile ilgili temel bilgileri ölçen test' },
        ]
      },
    ]
  },
];

async function loadFourthGradeData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı!');

    const sinifAdi = "4. Sınıf";
    let sinif = await Sinif.findOne({ ad: sinifAdi });
    if (!sinif) {
      sinif = await new Sinif({ ad: sinifAdi, aktif: true }).save();
      console.log(`✨ Yeni sınıf oluşturuldu: ${sinif.ad}`);
    } else {
      console.log(`ℹ️ Sınıf zaten mevcut: ${sinif.ad}`);
    }

    for (const dersData of dorduncuSinifVerileri) {
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
    
    console.log('✅ 4. Sınıf verileri başarıyla yüklendi!');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB bağlantısı kapatıldı.');
  }
}

loadFourthGradeData(); 