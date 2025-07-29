const mongoose = require('mongoose');

// Müfredat verisi
const curriculumData = [
  {
    "sinif": "1. Sınıf",
    "dersler": [
      {
        "ders": "Türkçe",
        "konular": [
          "Güzel Davranışlarımız",
          "Mustafa Kemal'den Atatürk'e",
          "Çevremizdeki Yaşam",
          "Yol Arkadaşımız Kitaplar",
          "Yeteneklerimizi Keşfediyoruz",
          "Minik Kaşifler",
          "Atalarımızın İzleri",
          "Sorumluluklarımızın Farkındayız"
        ]
      },
      {
        "ders": "Matematik",
        "konular": [
          "Nesnelerin Geometrisi (1)",
          "Sayılar ve Nicelikler (1)",
          "Sayılar ve Nicelikler (2)",
          "Sayılar ve Nicelikler (3)",
          "İşlemlerden Cebirsel Düşünmeye",
          "Veriye Dayalı Araştırma"
        ]
      },
      {
        "ders": "Hayat Bilgisi",
        "konular": [
          "Ben ve Okulum",
          "Sağlığım ve Güvenliğim",
          "Ailem ve Toplum",
          "Yaşadığım Yer ve Ülkem",
          "Doğa ve Çevre",
          "Bilim, Teknoloji ve Sanat"
        ]
      }
    ]
  },
  {
    "sinif": "2. Sınıf",
    "dersler": [
      {
        "ders": "Türkçe",
        "konular": [
          "Değerlerimizle Varız",
          "Atatürk ve Çocuk",
          "Doğada Neler Oluyor?",
          "Okuma Serüvenimiz",
          "Yeteneklerimizi Tanıyoruz",
          "Kültür Hazinemiz",
          "Haklarımızı Biliyoruz"
        ]
      },
      {
        "ders": "Matematik",
        "konular": [
          "Nesnelerin Geometrisi (1)",
          "Sayılar ve Nicelikler (1)",
          "İşlemlerden Cebirsel Düşünmeye",
          "Sayılar ve Nicelikler (2)",
          "Nesnelerin Geometrisi (2)",
          "Veriye Dayalı Araştırma"
        ]
      },
      {
        "ders": "Hayat Bilgisi",
        "konular": [
          "Ben ve Okulum",
          "Sağlığım ve Güvenliğim",
          "Ailem ve Toplum",
          "Yaşadığım Yer ve Ülkem",
          "Doğa ve Çevre",
          "Bilim, Teknoloji ve Sanat"
        ]
      }
    ]
  },
  {
    "sinif": "3. Sınıf",
    "dersler": [
      {
        "ders": "Türkçe",
        "konular": [
          "Değerlerimizle Yaşıyoruz",
          "Atatürk ve Kahramanlarımız",
          "Doğayı Tanıyoruz",
          "Bilgi Hazinemiz",
          "Yeteneklerimizi Kullanıyoruz",
          "Bilim Yolculuğu",
          "Millî Kültürümüz",
          "Hak ve Sorumluluklarımız"
        ]
      },
      {
        "ders": "Matematik",
        "konular": [
          "Sayılar ve Nicelikler (1)",
          "Sayılar ve Nicelikler (2)",
          "İşlemlerden Cebirsel Düşünmeye",
          "Nesnelerin Geometrisi (1)",
          "Nesnelerin Geometrisi (2)",
          "Veriye Dayalı Araştırma"
        ]
      },
      {
        "ders": "Hayat Bilgisi",
        "konular": [
          "Ben ve Okulum",
          "Sağlığım ve Güvenliğim",
          "Ailem ve Toplum",
          "Yaşadığım Yer ve Ülkem",
          "Doğa ve Çevre",
          "Bilim, Teknoloji ve Sanat"
        ]
      },
      {
        "ders": "Fen Bilimleri",
        "konular": [
          "Bilimsel Keşif Yolculuğu",
          "Canlılar Dünyasına Yolculuk",
          "Yer Bilimleri",
          "Maddeyi Tanıyalım",
          "Hareket",
          "Elektrik",
          "Tarım",
          "Canlıların Yaşam Alanları"
        ]
      }
    ]
  },
  {
    "sinif": "4. Sınıf",
    "dersler": [
      {
        "ders": "Türkçe",
        "konular": [
          "Erdemler",
          "Millî Mücadele ve Atatürk",
          "Doğa ve İnsan",
          "Kütüphanemiz",
          "Kendimizi Geliştiriyoruz",
          "Bilim ve Teknoloji",
          "Geçmişten Geleceğe Mirasımız",
          "Demokratik Yaşam"
        ]
      },
      {
        "ders": "Matematik",
        "konular": [
          "Sayılar ve Nicelikler (1)",
          "Sayılar ve Nicelikler (2)",
          "İşlemlerden Cebirsel Düşünmeye",
          "Nesnelerin Geometrisi (1)",
          "Nesnelerin Geometrisi (2)",
          "Nesnelerin Geometrisi (3)",
          "Olasılık ve Veriye Dayalı Araştırma"
        ]
      },
      {
        "ders": "Hayat Bilgisi",
        "konular": [
          "Ben ve Okulum",
          "Sağlığım ve Güvenliğim",
          "Ailem ve Toplum",
          "Yaşadığım Yer ve Ülkem",
          "Doğa ve Çevre",
          "Bilim, Teknoloji ve Sanat"
        ]
      },
      {
        "ders": "Fen Bilimleri",
        "konular": [
          "Bilime Yolculuk",
          "Beş Duyumuz",
          "Dünyamız",
          "Maddenin Değişimi",
          "Mıknatıs",
          "Enerji Dedektifleri",
          "Işığın Peşinde",
          "Sürdürülebilir Şehirler"
        ]
      },
      {
        "ders": "Sosyal Bilgiler",
        "konular": [
          "Birlikte Yaşamak",
          "Evimiz Dünya",
          "Ortak Mirasımız",
          "Yaşayan Demokrasimiz",
          "Hayatımızdaki Ekonomi",
          "Teknoloji ve Sosyal Bilimler"
        ]
      },
      {
        "ders": "Din Kültürü ve Ahlak Bilgisi",
        "konular": [
          "Günlük Hayat ve Din",
          "Allah Sevgisi",
          "Peygamberlerin Sevgisi",
          "Ahlaki Değerlerimiz",
          "Haklar ve Sorumluluklar"
        ]
      },
      {
        "ders": "İnsan Hakları, Vatandaşlık ve Demokrasi",
        "konular": [
          "Çocuk Olarak Haklarım",
          "Eşitlik ve Adalet",
          "Etkin Vatandaşlık",
          "Hayatımda Demokrasi"
        ]
      }
    ]
  }
];

// MongoDB bağlantısı
const MONGODB_URI = 'mongodb://localhost:27017/cozkazan';

async function fixMongoCurriculum() {
  try {
    console.log('🔄 MongoDB bağlantısı kuruluyor...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı');

    // Koleksiyonları temizle
    console.log('🧹 Eski müfredat verilerini temizleniyor...');
    await mongoose.connection.db.collection('ders').deleteMany({});
    await mongoose.connection.db.collection('konus').deleteMany({});
    await mongoose.connection.db.collection('altkonus').deleteMany({});
    console.log('✅ Eski veriler temizlendi');

    // Sınıfları kontrol et/oluştur
    console.log('📚 Sınıflar kontrol ediliyor...');
    const siniflar = await mongoose.connection.db.collection('sinifs').find({}).toArray();
    const sinifMap = {};
    
    for (const sinif of siniflar) {
      sinifMap[sinif.ad] = sinif._id;
    }

    // Yeni müfredat verisini yükle
    console.log('📖 Yeni müfredat verisi yükleniyor...');
    let toplamDers = 0;
    let toplamKonu = 0;

    for (const sinifData of curriculumData) {
      const sinifAdi = sinifData.sinif;
      const sinifId = sinifMap[sinifAdi];
      
      if (!sinifId) {
        console.log(`❌ Sınıf bulunamadı: ${sinifAdi}`);
        continue;
      }

      console.log(`\n📚 ${sinifAdi} işleniyor...`);

      for (const dersData of sinifData.dersler) {
        const dersAdi = dersData.ders;
        
        // Ders oluştur
        const dersDoc = {
          ad: dersAdi,
          sinif: sinifId,
          sinifAdi: sinifAdi,
          aktif: true,
          createdAt: new Date(),
          __v: 0
        };
        
        const dersResult = await mongoose.connection.db.collection('ders').insertOne(dersDoc);
        const dersId = dersResult.insertedId;
        toplamDers++;
        
        console.log(`  📖 ${dersAdi} oluşturuldu (${dersData.konular.length} konu)`);

        // Konuları oluştur
        for (let i = 0; i < dersData.konular.length; i++) {
          const konuAdi = dersData.konular[i];
          
          const konuDoc = {
            ad: konuAdi,
            sira: i + 1,
            ders: dersId,
            sinif: sinifId,
            dersAdi: dersAdi,
            sinifAdi: sinifAdi,
            aktif: true,
            createdAt: new Date(),
            __v: 0
          };
          
          await mongoose.connection.db.collection('konus').insertOne(konuDoc);
          toplamKonu++;
        }
      }
    }

    console.log('\n📊 ÖZET:');
    console.log(`   - Toplam Ders: ${toplamDers}`);
    console.log(`   - Toplam Konu: ${toplamKonu}`);
    console.log('✅ Müfredat verisi başarıyla güncellendi!');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB bağlantısı kapatıldı');
  }
}

fixMongoCurriculum(); 