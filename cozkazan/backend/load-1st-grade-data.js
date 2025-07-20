import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Test from './models/Test.js';
import Sinif from './models/Sinif.js';
import Ders from './models/Ders.js';
import Konu from './models/Konu.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cozkazan';

const sinifData = { ad: '1. Sınıf' };
const dersData = [
  { ad: 'Türkçe' },
  { ad: 'Matematik' },
  { ad: 'Hayat Bilgisi' }
];
const konuData = [
  // Türkçe Konuları
  { ad: 'Güzel Davranışlarımız', ders: 'Türkçe' },
  { ad: 'Mustafa Kemal\'den Atatürk\'e', ders: 'Türkçe' },
  { ad: 'Çevremizdeki Yaşam', ders: 'Türkçe' },
  { ad: 'Yol Arkadaşımız Kitaplar', ders: 'Türkçe' },
  { ad: 'Yeteneklerimizi Keşfediyoruz', ders: 'Türkçe' },
  { ad: 'Minik Kaşifler', ders: 'Türkçe' },
  { ad: 'Atalarımızın İzleri', ders: 'Türkçe' },
  { ad: 'Sorumluluklarımızın Farkındayız', ders: 'Türkçe' },
  // Matematik Konuları
  { ad: 'Nesnelerin Geometrisi (1)', ders: 'Matematik' },
  { ad: 'Sayılar ve Nicelikler (1)', ders: 'Matematik' },
  { ad: 'Sayılar ve Nicelikler (2)', ders: 'Matematik' },
  { ad: 'Sayılar ve Nicelikler (3)', ders: 'Matematik' },
  { ad: 'İşlemlerden Cebirsel Düşünmeye', ders: 'Matematik' },
  { ad: 'Veriye Dayalı Araştırma', ders: 'Matematik' },
  // Hayat Bilgisi Konuları
  { ad: 'Ben ve Okulum', ders: 'Hayat Bilgisi' },
  { ad: 'Sağlığım ve Güvenliğim', ders: 'Hayat Bilgisi' },
  { ad: 'Ailem ve Toplum', ders: 'Hayat Bilgisi' },
  { ad: 'Yaşadığım Yer ve Ülkem', ders: 'Hayat Bilgisi' },
  { ad: 'Doğa ve Çevre', ders: 'Hayat Bilgisi' },
  { ad: 'Bilim, Teknoloji ve Sanat', ders: 'Hayat Bilgisi' }
];

const testVerileri = [
  // Türkçe Dersi Testleri
  {
    testAdi: 'Güzel Davranışlarımız - Test 1',
    aciklama: 'Güzel davranışlar konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Türkçe',
    konu: 'Güzel Davranışlarımız',
    aktif: true
  },
  {
    testAdi: 'Mustafa Kemal\'den Atatürk\'e - Test 1',
    aciklama: 'Atatürk konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Türkçe',
    konu: 'Mustafa Kemal\'den Atatürk\'e',
    aktif: true
  },
  {
    testAdi: 'Çevremizdeki Yaşam - Test 1',
    aciklama: 'Çevre ve yaşam konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Türkçe',
    konu: 'Çevremizdeki Yaşam',
    aktif: true
  },
  {
    testAdi: 'Yol Arkadaşımız Kitaplar - Test 1',
    aciklama: 'Kitap okuma ve kitaplar konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Türkçe',
    konu: 'Yol Arkadaşımız Kitaplar',
    aktif: true
  },
  {
    testAdi: 'Yeteneklerimizi Keşfediyoruz - Test 1',
    aciklama: 'Yetenekler ve keşif konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Türkçe',
    konu: 'Yeteneklerimizi Keşfediyoruz',
    aktif: true
  },
  {
    testAdi: 'Minik Kaşifler - Test 1',
    aciklama: 'Keşif ve araştırma konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Türkçe',
    konu: 'Minik Kaşifler',
    aktif: true
  },
  {
    testAdi: 'Atalarımızın İzleri - Test 1',
    aciklama: 'Tarih ve kültür konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Türkçe',
    konu: 'Atalarımızın İzleri',
    aktif: true
  },
  {
    testAdi: 'Sorumluluklarımızın Farkındayız - Test 1',
    aciklama: 'Sorumluluk konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Türkçe',
    konu: 'Sorumluluklarımızın Farkındayız',
    aktif: true
  },
  // Matematik Dersi Testleri
  {
    testAdi: 'Nesnelerin Geometrisi (1) - Test 1',
    aciklama: 'Geometrik şekiller konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Matematik',
    konu: 'Nesnelerin Geometrisi (1)',
    aktif: true
  },
  {
    testAdi: 'Sayılar ve Nicelikler (1) - Test 1',
    aciklama: 'Sayılar ve nicelikler konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Matematik',
    konu: 'Sayılar ve Nicelikler (1)',
    aktif: true
  },
  {
    testAdi: 'Sayılar ve Nicelikler (2) - Test 1',
    aciklama: 'Sayılar ve nicelikler konusunda orta seviye bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Matematik',
    konu: 'Sayılar ve Nicelikler (2)',
    aktif: true
  },
  {
    testAdi: 'Sayılar ve Nicelikler (3) - Test 1',
    aciklama: 'Sayılar ve nicelikler konusunda ileri seviye bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Matematik',
    konu: 'Sayılar ve Nicelikler (3)',
    aktif: true
  },
  {
    testAdi: 'İşlemlerden Cebirsel Düşünmeye - Test 1',
    aciklama: 'İşlemler ve cebirsel düşünme konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Matematik',
    konu: 'İşlemlerden Cebirsel Düşünmeye',
    aktif: true
  },
  {
    testAdi: 'Veriye Dayalı Araştırma - Test 1',
    aciklama: 'Veri analizi konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Matematik',
    konu: 'Veriye Dayalı Araştırma',
    aktif: true
  },
  // Hayat Bilgisi Dersi Testleri
  {
    testAdi: 'Ben ve Okulum - Test 1',
    aciklama: 'Okul ve benlik konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Hayat Bilgisi',
    konu: 'Ben ve Okulum',
    aktif: true
  },
  {
    testAdi: 'Sağlığım ve Güvenliğim - Test 1',
    aciklama: 'Sağlık ve güvenlik konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Hayat Bilgisi',
    konu: 'Sağlığım ve Güvenliğim',
    aktif: true
  },
  {
    testAdi: 'Ailem ve Toplum - Test 1',
    aciklama: 'Aile ve toplum konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Hayat Bilgisi',
    konu: 'Ailem ve Toplum',
    aktif: true
  },
  {
    testAdi: 'Yaşadığım Yer ve Ülkem - Test 1',
    aciklama: 'Coğrafya ve vatan konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Hayat Bilgisi',
    konu: 'Yaşadığım Yer ve Ülkem',
    aktif: true
  },
  {
    testAdi: 'Doğa ve Çevre - Test 1',
    aciklama: 'Doğa ve çevre konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Hayat Bilgisi',
    konu: 'Doğa ve Çevre',
    aktif: true
  },
  {
    testAdi: 'Bilim, Teknoloji ve Sanat - Test 1',
    aciklama: 'Bilim, teknoloji ve sanat konusunda temel bilgileri ölçen test',
    sinif: '1. Sınıf',
    ders: 'Hayat Bilgisi',
    konu: 'Bilim, Teknoloji ve Sanat',
    aktif: true
  }
];


async function loadFirstGradeData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı!');

    // Önce ilişkili verileri temizle
    await Test.deleteMany({});
    await Konu.deleteMany({});
    await Ders.deleteMany({});
    await Sinif.deleteMany({});
    console.log('🗑️ Mevcut Sınıf, Ders, Konu ve Test verileri temizlendi.');

    // Sınıfı oluştur ve ID'sini al
    const sinif = await Sinif.create(sinifData);
    console.log(`✅ "${sinif.ad}" başarıyla oluşturuldu.`);

    // Ders verilerine sınıf ID'sini ekle
    const dersVerileriWithSinif = dersData.map(ders => ({ ...ders, sinif: sinif._id }));
    const dersler = await Ders.insertMany(dersVerileriWithSinif);
    console.log('✅ Dersler başarıyla oluşturuldu!');

    // Ders ID'lerini bir haritaya dönüştür
    const dersMap = dersler.reduce((acc, ders) => {
      acc[ders.ad] = ders._id;
      return acc;
    }, {});

    // Ders bazında konuları işle ve 'sira' alanını ekle
    const tumKonular = [];
    for (const ders of dersler) {
      const dersinKonulari = konuData
        .filter(k => k.ders === ders.ad)
        .map((konu, index) => ({
          ad: konu.ad,
          sira: index + 1, // Her ders için sıralamayı 1'den başlat
          sinif: sinif._id,
          ders: ders._id
        }));
      tumKonular.push(...dersinKonulari);
    }
    
    const konular = await Konu.insertMany(tumKonular);
    console.log('✅ Konular başarıyla oluşturuldu!');

    // Konu ID'lerini bir haritaya dönüştür
    const konuMap = konular.reduce((acc, konu) => {
      acc[konu.ad] = konu._id;
      return acc;
    }, {});

    // Test verilerini ID'lerle güncelle
    const hazirTestler = testVerileri.map(test => ({
      ...test,
      sinif: sinif._id,
      ders: dersMap[test.ders],
      konu: konuMap[test.konu]
    }));

    // Testleri veritabanına ekle
    const result = await Test.insertMany(hazirTestler);
    console.log(`✅ ${result.length} adet 1. sınıf testi başarıyla eklendi!`);

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB bağlantısı kapatıldı.');
  }
}

loadFirstGradeData(); 