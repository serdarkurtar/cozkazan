import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Sinif from '../backend/models/Sinif.js';
import Ders from '../backend/models/Ders.js';
import Konu from '../backend/models/Konu.js';

dotenv.config({ path: '../backend/.env' });

const curriculum = [
    {
        sinif: '1. Sınıf',
        sira: 1,
        dersler: [
            {
                ad: 'Türkçe',
                sira: 1,
                konular: [
                    'Güzel Davranışlarımız', 'Mustafa Kemal’den Atatürk’e', 'Çevremizdeki Yaşam',
                    'Yol Arkadaşımız Kitaplar', 'Yeteneklerimizi Keşfediyoruz', 'Minik Kâşifler',
                    'Atalarımızın İzleri', 'Sorumluluklarımızın Farkındayız'
                ]
            },
            {
                ad: 'Matematik',
                sira: 2,
                konular: [
                    'Nesnelerin Geometrisi (1)', 'Sayılar ve Nicelikler (1)', 'Sayılar ve Nicelikler (2)',
                    'İşlemlerden Cebirsel Düşünmeye', 'Sayılar ve Nicelikler (3)', 'Nesnelerin Geometrisi (2)',
                    'Veriye Dayalı Araştırma'
                ]
            },
            {
                ad: 'Hayat Bilgisi',
                sira: 3,
                konular: [
                    'Ben ve Okulum', 'Sağlığım ve Güvenliğim', 'Ailem ve Toplum',
                    'Yaşadığım Yer ve Ülkem', 'Doğa ve Çevre', 'Bilim, Teknoloji ve Sanat'
                ]
            }
        ]
    },
    {
        sinif: '2. Sınıf',
        sira: 2,
        dersler: [
            {
                ad: 'Türkçe',
                sira: 1,
                konular: [
                    'Değerlerimizle Varız', 'Atatürk ve Çocuk', 'Doğada Neler Oluyor?',
                    'Okuma Serüvenimiz', 'Yeteneklerimizi Tanıyoruz', 'Mucit Çocuk',
                    'Kültür Hazinemiz', 'Haklarımızı Biliyoruz'
                ]
            },
            {
                ad: 'Matematik',
                sira: 2,
                konular: [
                    'Nesnelerin Geometrisi (1)', 'Sayılar ve Nicelikler (1)', 'İşlemlerden Cebirsel Düşünmeye',
                    'Sayılar ve Nicelikler (2)', 'Nesnelerin Geometrisi (2)', 'Veriye Dayalı Araştırma'
                ]
            },
             {
                ad: 'Hayat Bilgisi',
                sira: 3,
                konular: [
                    'Ben ve Okulum', 'Sağlığım ve Güvenliğim', 'Ailem ve Toplum',
                    'Yaşadığım Yer ve Ülkem', 'Doğa ve Çevre', 'Bilim, Teknoloji ve Sanat'
                ]
            }
        ]
    },
    {
        sinif: '3. Sınıf',
        sira: 3,
        dersler: [
             {
                ad: 'Türkçe',
                sira: 1,
                konular: [
                    'Değerlerimizle Yaşıyoruz', 'Atatürk ve Kahramanlarımız', 'Doğayı Tanıyoruz',
                    'Bilgi Hazinemiz', 'Yeteneklerimizi Kullanıyoruz', 'Bilim Yolculuğu',
                    'Millî Kültürümüz', 'Hak ve Sorumluluklarımız'
                ]
            },
            {
                ad: 'Matematik',
                sira: 2,
                konular: [
                    'Sayılar ve Nicelikler (1)', 'Sayılar ve Nicelikler (2)', 'İşlemlerden Cebirsel Düşünmeye',
                    'Nesnelerin Geometrisi (1)', 'Nesnelerin Geometrisi (2)', 'Veriye Dayalı Araştırma'
                ]
            },
            {
                ad: 'Hayat Bilgisi',
                sira: 3,
                konular: [
                    'Ben ve Okulum', 'Sağlığım ve Güvenliğim', 'Ailem ve Toplum',
                    'Yaşadığım Yer ve Ülkem', 'Doğa ve Çevre', 'Bilim, Teknoloji ve Sanat'
                ]
            },
            {
                ad: 'Fen Bilimleri',
                sira: 4,
                konular: [
                    'Bilimsel Keşif Yolculuğu', 'Canlılar Dünyasına Yolculuk', 'Yer Bilimciler İş Başında',
                    'Maddeyi Tanıyalım', 'Hareketi Keşfediyorum', 'Yaşamımızı Kolaylaştıran Elektrik',
                    'Toprağı Tanıyorum', 'Canlıların Yaşam Alanlarına Yolculuk'
                ]
            }
        ]
    },
     {
        sinif: '4. Sınıf',
        sira: 4,
        dersler: [
             {
                ad: 'Türkçe',
                sira: 1,
                konular: [
                    'Erdemler', 'Millî Mücadele ve Atatürk', 'Doğa ve İnsan', 'Kütüphanemiz',
                    'Kendimizi Geliştiriyoruz', 'Bilim ve Teknoloji', 'Geçmişten Geleceğe Mirasımız',
                    'Demokratik Yaşam'
                ]
            },
            {
                ad: 'Matematik',
                sira: 2,
                konular: [
                    'Sayılar ve Nicelikler (1)', 'Sayılar ve Nicelikler (2)', 'İşlemlerden Cebirsel Düşünmeye',
                    'Nesnelerin Geometrisi (1)', 'Nesnelerin Geometrisi (2)', 'Nesnelerin Geometrisi (3)',
                    'Olayların Olasılığı ve Veriye Dayalı Araştırma'
                ]
            },
            {
                ad: 'Sosyal Bilgiler',
                sira: 3,
                konular: [
                    'Birlikte Yaşamak', 'Evimiz Dünya', 'Ortak Mirasımız', 'Yaşayan Demokrasimiz',
                    'Hayatımdaki Ekonomi', 'Teknoloji ve Sosyal Bilimler'
                ]
            },
            {
                ad: 'Fen Bilimleri',
                sira: 4,
                konular: [
                    'Bilime Yolculuk', 'Sağlıklı Besleniyoruz', 'Dünyamızı Keşfedelim', 'Maddenin Değişimi',
                    'Mıknatısı Keşfediyorum', 'Enerji Dedektifleri', 'Işığın Peşinde',
                    'Sürdürülebilir Şehirler ve Topluluklar'
                ]
            },
            {
                ad: 'Din Kültürü ve Ahlak Bilgisi',
                sira: 5,
                konular: [
                    'Günlük Hayat ve Din', 'Allah Sevgisi', 'Peygamberlerin Sevgisi',
                    'Ahlaki Değerlerimiz', 'Haklar ve Sorumluluklar'
                ]
            },
            {
                ad: 'İnsan Hakları, Yurttaşlık ve Demokrasi',
                sira: 6,
                konular: [
                    'Çocuk Olarak Haklarımla Varım', 'Hayatımda Eşitlik ve Adalet',
                    'Etkin Bir Vatandaşım', 'Hayatımda Demokrasi'
                ]
            }
        ]
    }
];

const MONGO_URI = "mongodb+srv://serdarkurtar:serdar123@cluster0.fdh0usw.mongodb.net/cozkazan?retryWrites=true&w=majority&appName=Cluster0";

const connectWithRetry = async (retries = 5) => {
  while (retries) {
    try {
      console.log('MongoDB Atlas bağlantısı deneniyor...');
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 30000, // 30 saniye
        connectTimeoutMS: 30000, // 30 saniye
      });
      console.log('MongoDB bağlantısı başarılı.');
      return; // Başarılı olursa fonksiyondan çık
    } catch (err) {
      console.error('MongoDB bağlantı hatası:', err.message);
      retries -= 1;
      console.log(`${retries} deneme hakkı kaldı. 5 saniye sonra tekrar denenecek...`);
      if (retries === 0) throw new Error("Veritabanına bağlanılamadı.");
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

const importData = async () => {
  try {
    await connectWithRetry();

    console.log('Mevcut müfredat verileri temizleniyor (yavaş mod)...');
    const konular = await Konu.find({});
    for(const konu of konular) await Konu.findByIdAndDelete(konu._id);
    console.log('Konular temizlendi.');

    const dersler = await Ders.find({});
    for(const ders of dersler) await Ders.findByIdAndDelete(ders._id);
    console.log('Dersler temizlendi.');
    
    const siniflar = await Sinif.find({});
    for(const sinif of siniflar) await Sinif.findByIdAndDelete(sinif._id);
    console.log('Sınıflar temizlendi.');
    console.log('Mevcut müfredat verileri tamamen temizlendi.');


    for (const sinifData of curriculum) {
      const yeniSinif = await Sinif.create({
        ad: sinifData.sinif,
        sira: sinifData.sira,
      });
      console.log(`-> Sınıf eklendi: ${yeniSinif.ad}`);
      await new Promise(res => setTimeout(res, 50)); // Küçük bir bekleme

      for (const dersData of sinifData.dersler) {
        const yeniDers = await Ders.create({
          ad: dersData.ad,
          sinif: yeniSinif._id,
          sira: dersData.sira,
        });
        console.log(`  -> Ders eklendi: ${yeniDers.ad}`);
        await new Promise(res => setTimeout(res, 50)); // Küçük bir bekleme

        for(const [index, konuAdi] of dersData.konular.entries()){
            await Konu.create({
                ad: konuAdi,
                ders: yeniDers._id,
                sinif: yeniSinif._id,
                sira: index + 1,
            });
            await new Promise(res => setTimeout(res, 20)); // Her konu sonrası daha kısa bekleme
        }
        console.log(`    -> ${dersData.konular.length} adet konu eklendi.`);
      }
    }

    console.log('\n✅ Tüm müfredat başarıyla veritabanına eklendi!');
  } catch (error) {
    console.error('❌ Veri yükleme sırasında bir hata oluştu:', error);
  } finally {
    if (mongoose.connection.readyState === 1) {
        await mongoose.disconnect();
        console.log('MongoDB bağlantısı kapatıldı.');
    }
  }
};

importData(); 