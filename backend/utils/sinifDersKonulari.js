// Sınıf, Ders ve Konular şeması
const SINIF_DERS_KONULARI = {
  '1': {
    'Türkçe': [
      'Güzel Davranışlarımız',
      'Mustafa Kemal\'den Atatürk\'e',
      'Çevremizdeki Yaşam',
      'Yol Arkadaşımız Kitaplar',
      'Yeteneklerimizi Keşfediyoruz',
      'Minik Kaşifler',
      'Atalarımızın İzleri',
      'Sorumluluklarımızın Farkındayız'
    ],
    'Matematik': [
      'Nesnelerin Geometrisi (1)',
      'Sayılar ve Nicelikler (1)',
      'Sayılar ve Nicelikler (2)',
      'İşlemlerden Cebirsel Düşünmeye',
      'Sayılar ve Nicelikler (3)',
      'Nesnelerin Geometrisi (2)',
      'Veriye Dayalı Araştırma'
    ],
    'Hayat Bilgisi': [
      'Ben ve Okulum',
      'Sağlığım ve Güvenliğim',
      'Ailem ve Toplum',
      'Yaşadığım Yer ve Ülkem',
      'Doğa ve Çevre',
      'Bilim, Teknoloji ve Sanat'
    ]
  },
  '2': {
    'Türkçe': [
      'Değerlerimizle Varız',
      'Atatürk ve Çocuk',
      'Doğada Neler Oluyor?',
      'Okuma Serüvenimiz',
      'Yeteneklerimizi Tanıyoruz',
      'Mucit Çocuk',
      'Kültür Hazinemiz',
      'Haklarımızı Biliyoruz'
    ],
    'Matematik': [
      'Sayılar ve İşlemler',
      'Geometri ve Ölçme',
      'Veri İşleme'
    ],
    'Hayat Bilgisi': [
      'Okulumuzda Hayat',
      'Evimizde Hayat',
      'Sağlıklı Hayat',
      'Güvenli Hayat',
      'Ülkemizde Hayat',
      'Doğada Hayat'
    ]
  },
  '3': {
    'Türkçe': [
      'Değerlerimizle Yaşıyoruz',
      'Atatürk ve Kahramanlarımız',
      'Doğayı Tanıyoruz',
      'Bilgi Hazinemiz',
      'Yeteneklerimizi Kullanıyoruz',
      'Bilim ve Teknoloji',
      'Millî Kültürümüz',
      'Hak ve Sorumluluklarımız'
    ],
    'Matematik': [
      'Sayılar ve İşlemler',
      'Geometri ve Ölçme',
      'Veri İşleme'
    ],
    'Hayat Bilgisi': [
      'Okulumuzda Hayat',
      'Evimizde Hayat',
      'Sağlıklı Hayat',
      'Güvenli Hayat',
      'Ülkemizde Hayat',
      'Doğada Hayat'
    ]
  },
  '4': {
    'Türkçe': [
      'Erdemler',
      'Millî Mücadele ve Atatürk',
      'Doğa ve İnsan',
      'Kütüphanemiz',
      'Kendimizi Geliştiriyoruz',
      'Bilim ve Teknoloji',
      'Geçmişten Geleceğe Mirasımız',
      'Demokratik Yaşam'
    ],
    'Matematik': [
      'Sayılar ve İşlemler',
      'Geometri ve Ölçme',
      'Veri İşleme'
    ],
    'Sosyal Bilgiler': [
      'Birey ve Toplum',
      'Kültür ve Miras',
      'İnsanlar, Yerler ve Çevreler',
      'Bilim, Teknoloji ve Toplum'
    ],
    'Fen Bilimleri': [
      'Yer Kabuğu ve Dünya\'mızın Hareketleri',
      'Besinlerimiz',
      'Kuvvetin Etkileri',
      'Maddeyi Tanıyalım',
      'Aydınlatma ve Ses Teknolojileri',
      'İnsan ve Çevre',
      'Basit Elektrik Devreleri',
      'Uygun Aydınlatma'
    ]
  }
};

// Sınıf listesini döndür
const getSiniflar = () => {
  return Object.keys(SINIF_DERS_KONULARI).map(sinif => ({
    value: sinif,
    label: `${sinif}. Sınıf`
  }));
};

// Belirli bir sınıf için dersleri döndür
const getDerslerBySinif = (sinif) => {
  if (!SINIF_DERS_KONULARI[sinif]) {
    return [];
  }
  return Object.keys(SINIF_DERS_KONULARI[sinif]);
};

// Belirli bir sınıf ve ders için konuları döndür
const getKonularBySinifDers = (sinif, ders) => {
  if (!SINIF_DERS_KONULARI[sinif] || !SINIF_DERS_KONULARI[sinif][ders]) {
    return [];
  }
  return SINIF_DERS_KONULARI[sinif][ders];
};

// Tüm konuları döndür
const getAllKonular = () => {
  const allKonular = [];
  Object.keys(SINIF_DERS_KONULARI).forEach(sinif => {
    Object.keys(SINIF_DERS_KONULARI[sinif]).forEach(ders => {
      SINIF_DERS_KONULARI[sinif][ders].forEach(konu => {
        allKonular.push({
          sinif,
          ders,
          konu
        });
      });
    });
  });
  return allKonular;
};

export {
  SINIF_DERS_KONULARI,
  getSiniflar,
  getDerslerBySinif,
  getKonularBySinifDers,
  getAllKonular
}; 