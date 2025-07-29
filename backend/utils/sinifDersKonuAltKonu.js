// 4 Seviyeli Hiyerarşik Yapı: Sınıf -> Ders -> Konu -> Alt Konu
const SINIF_DERS_KONU_ALT_KONU = {
  '1': {
    'Türkçe': {
      'Güzel Davranışlarımız': [
      ],
      'Mustafa Kemal\'den Atatürk\'e': [
      ],
      'Çevremizdeki Yaşam': [
      ],
      'Yol Arkadaşımız Kitaplar': [
      ],
      'Yeteneklerimizi Keşfediyoruz': [
      ],
      'Minik Kâşifler': [
      ],
      'Atalarımızın İzleri': [
      ],
      'Sorumluluklarımızın Farkındayız': [
      ]
    }
  },
  '2': {
    'Türkçe': {
      'Değerlerimizle Varız': [
      ],
      'Atatürk ve Çocuk': [
      ],
      'Doğada Neler Oluyor?': [
      ],
      'Okuma Serüvenimiz': [
      ],
      'Yeteneklerimizi Tanıyoruz': [
      ],
      'Mucit Çocuk': [
      ],
      'Kültür Hazinemiz': [
      ],
      'Haklarımızı Biliyoruz': [
      ]
    }
  },
  '3': {
    'Türkçe': {
      'Değerlerimizle Yaşıyoruz': [
      ],
      'Atatürk ve Kahramanlarımız': [
      ],
      'Doğayı Tanıyoruz': [
      ],
      'Bilgi Hazinemiz': [
      ],
      'Yeteneklerimizi Kullanıyoruz': [
      ],
      'Bilim Yolculuğu': [
      ],
      'Millî Kültürümüz': [
      ],
      'Hak ve Sorumluluklarımız': [
      ]
    }
  },
  '4': {
    'Türkçe': {
      'Erdemler': [
      ],
      'Millî Mücadele ve Atatürk': [
      ],
      'Doğa ve İnsan': [
      ],
      'Kütüphanemiz': [
      ],
      'Kendimizi Geliştiriyoruz': [
      ],
      'Bilim ve Teknoloji': [
      ],
      'Geçmişten Geleceğe Mirasımız': [
      ],
      'Demokratik Yaşam': [
      ]
    }
  }
};

// Sınıf listesini döndür
const getSiniflar = () => {
  return Object.keys(SINIF_DERS_KONU_ALT_KONU).map(sinif => ({
    value: sinif,
    label: `${sinif}. Sınıf`
  }));
};

// Belirli bir sınıf için dersleri döndür
const getDerslerBySinif = (sinif) => {
  if (!SINIF_DERS_KONU_ALT_KONU[sinif]) {
    return [];
  }
  return Object.keys(SINIF_DERS_KONU_ALT_KONU[sinif]);
};

// Belirli bir sınıf ve ders için konuları döndür
const getKonularBySinifDers = (sinif, ders) => {
  if (!SINIF_DERS_KONU_ALT_KONU[sinif] || !SINIF_DERS_KONU_ALT_KONU[sinif][ders]) {
    return [];
  }
  return Object.keys(SINIF_DERS_KONU_ALT_KONU[sinif][ders]);
};

// Belirli bir sınıf, ders ve konu için alt konuları döndür
const getAltKonularBySinifDersKonu = (sinif, ders, konu) => {
  if (!SINIF_DERS_KONU_ALT_KONU[sinif] || 
      !SINIF_DERS_KONU_ALT_KONU[sinif][ders] || 
      !SINIF_DERS_KONU_ALT_KONU[sinif][ders][konu]) {
    return [];
  }
  return SINIF_DERS_KONU_ALT_KONU[sinif][ders][konu];
};

// Tüm alt konuları döndür
const getAllAltKonular = () => {
  const allAltKonular = [];
  Object.keys(SINIF_DERS_KONU_ALT_KONU).forEach(sinif => {
    Object.keys(SINIF_DERS_KONU_ALT_KONU[sinif]).forEach(ders => {
      Object.keys(SINIF_DERS_KONU_ALT_KONU[sinif][ders]).forEach(konu => {
        SINIF_DERS_KONU_ALT_KONU[sinif][ders][konu].forEach(altKonu => {
          allAltKonular.push({
            sinif,
            ders,
            konu,
            altKonu
          });
        });
      });
    });
  });
  return allAltKonular;
};

module.exports = {
  SINIF_DERS_KONU_ALT_KONU,
  getSiniflar,
  getDerslerBySinif,
  getKonularBySinifDers,
  getAltKonularBySinifDersKonu,
  getAllAltKonular
}; 