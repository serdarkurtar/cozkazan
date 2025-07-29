// Sınıf bazlı ders filtreleme sistemi
const sinifDersleri = {
  '1': [
    'Türkçe',
    'Matematik',
    'Hayat Bilgisi'
  ],
  '2': [
  ],
  '3': [
  ],
  '4': [
  ]
};

// Sınıfa göre dersleri getir
function getDerslerBySinif(sinif) {
  return sinifDersleri[sinif] || [];
}

// Tüm sınıfları getir
function getSiniflar() {
  return Object.keys(sinifDersleri);
}

// Ders geçerli mi kontrol et
function isDersGecerli(sinif, ders) {
  const dersler = getDerslerBySinif(sinif);
  return dersler.includes(ders);
}

module.exports = {
  sinifDersleri,
  getDerslerBySinif,
  getSiniflar,
  isDersGecerli
}; 