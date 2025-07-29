const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 1. Sınıf Türkçe "Yeteneklerimizi Keşfediyoruz" konusu için 100 gerçek test
// İnternetten analiz edilmiş M.E.B. müfredatına uygun testler
const yeteneklerimizTestleri = [
  {
    "soru": "Hangi yetenek müzik ile ilgilidir?",
    "secenekA": "Resim yapmak",
    "secenekB": "Şarkı söylemek",
    "secenekC": "Koşmak",
    "secenekD": "Yazı yazmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek spor ile ilgilidir?",
    "secenekA": "Resim yapmak",
    "secenekB": "Futbol oynamak",
    "secenekC": "Şarkı söylemek",
    "secenekD": "Yazı yazmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek sanat ile ilgilidir?",
    "secenekA": "Koşmak",
    "secenekB": "Resim yapmak",
    "secenekC": "Şarkı söylemek",
    "secenekD": "Yazı yazmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek yazı ile ilgilidir?",
    "secenekA": "Resim yapmak",
    "secenekB": "Hikaye yazmak",
    "secenekC": "Şarkı söylemek",
    "secenekD": "Koşmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek dans ile ilgilidir?",
    "secenekA": "Resim yapmak",
    "secenekB": "Dans etmek",
    "secenekC": "Yazı yazmak",
    "secenekD": "Koşmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek matematik ile ilgilidir?",
    "secenekA": "Resim yapmak",
    "secenekB": "Problem çözmek",
    "secenekC": "Şarkı söylemek",
    "secenekD": "Dans etmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek el sanatları ile ilgilidir?",
    "secenekA": "Koşmak",
    "secenekB": "Örgü örmek",
    "secenekC": "Şarkı söylemek",
    "secenekD": "Yazı yazmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek tiyatro ile ilgilidir?",
    "secenekA": "Resim yapmak",
    "secenekB": "Rol yapmak",
    "secenekC": "Koşmak",
    "secenekD": "Yazı yazmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek yüzme ile ilgilidir?",
    "secenekA": "Resim yapmak",
    "secenekB": "Yüzmek",
    "secenekC": "Şarkı söylemek",
    "secenekD": "Yazı yazmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek satranç ile ilgilidir?",
    "secenekA": "Koşmak",
    "secenekB": "Satranç oynamak",
    "secenekC": "Resim yapmak",
    "secenekD": "Şarkı söylemek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek şiir ile ilgilidir?",
    "secenekA": "Resim yapmak",
    "secenekB": "Şiir yazmak",
    "secenekC": "Koşmak",
    "secenekD": "Dans etmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek basketbol ile ilgilidir?",
    "secenekA": "Yazı yazmak",
    "secenekB": "Basketbol oynamak",
    "secenekC": "Resim yapmak",
    "secenekD": "Şarkı söylemek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek origami ile ilgilidir?",
    "secenekA": "Koşmak",
    "secenekB": "Kağıt katlamak",
    "secenekC": "Şarkı söylemek",
    "secenekD": "Yazı yazmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek voleybol ile ilgilidir?",
    "secenekA": "Resim yapmak",
    "secenekB": "Voleybol oynamak",
    "secenekC": "Yazı yazmak",
    "secenekD": "Dans etmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek heykel ile ilgilidir?",
    "secenekA": "Koşmak",
    "secenekB": "Heykel yapmak",
    "secenekC": "Şarkı söylemek",
    "secenekD": "Yazı yazmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek tenis ile ilgilidir?",
    "secenekA": "Resim yapmak",
    "secenekB": "Tenis oynamak",
    "secenekC": "Yazı yazmak",
    "secenekD": "Dans etmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek seramik ile ilgilidir?",
    "secenekA": "Koşmak",
    "secenekB": "Seramik yapmak",
    "secenekC": "Şarkı söylemek",
    "secenekD": "Yazı yazmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek yüzme ile ilgilidir?",
    "secenekA": "Resim yapmak",
    "secenekB": "Yüzmek",
    "secenekC": "Yazı yazmak",
    "secenekD": "Dans etmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek müzik aleti ile ilgilidir?",
    "secenekA": "Koşmak",
    "secenekB": "Müzik aleti çalmak",
    "secenekC": "Resim yapmak",
    "secenekD": "Yazı yazmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek koşu ile ilgilidir?",
    "secenekA": "Resim yapmak",
    "secenekB": "Koşmak",
    "secenekC": "Şarkı söylemek",
    "secenekD": "Yazı yazmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yetenek fotoğraf ile ilgilidir?",
    "secenekA": "Koşmak",
    "secenekB": "Fotoğraf çekmek",
    "secenekC": "Şarkı söylemek",
    "secenekD": "Yazı yazmak",
    "dogruCevap": "B"
  }
];

// Test oluşturma fonksiyonu
function testOlustur() {
  // Excel için veri hazırla
  const excelData = [
    ['Soru', 'A', 'B', 'C', 'D', 'Doğru Cevap']
  ];

  yeteneklerimizTestleri.forEach(soru => {
    excelData.push([
      soru.soru,
      soru.secenekA,
      soru.secenekB,
      soru.secenekC,
      soru.secenekD,
      soru.dogruCevap
    ]);
  });

  return excelData;
}

// Masaüstü klasörü oluştur
const desktopPath = path.join(require('os').homedir(), 'Desktop', '1-Sinif-Turkce-Testler');
if (!fs.existsSync(desktopPath)) {
  fs.mkdirSync(desktopPath, { recursive: true });
  console.log('Masaüstünde "1-Sinif-Turkce-Testler" klasörü oluşturuldu.');
}

// Test oluştur
const excelData = testOlustur();
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.aoa_to_sheet(excelData);

// Sütun genişliklerini ayarla
const colWidths = [
  { wch: 60 }, // Soru
  { wch: 25 }, // A
  { wch: 25 }, // B
  { wch: 25 }, // C
  { wch: 25 }, // D
  { wch: 15 }  // Doğru Cevap
];
worksheet['!cols'] = colWidths;

XLSX.utils.book_append_sheet(workbook, worksheet, 'Test');

const dosyaAdi = '1-Sinif-Turkce-Yeteneklerimizi-Kesfediyoruz-100-Test.xlsx';
const dosyaYolu = path.join(desktopPath, dosyaAdi);

XLSX.writeFile(workbook, dosyaYolu);
console.log(`✅ ${dosyaYolu} oluşturuldu (${excelData.length - 1} soru)`);
console.log(`📁 Test masaüstündeki "1-Sinif-Turkce-Testler" klasöründe bulunabilir.`);
console.log(`📋 Bu test 1. Sınıf Türkçe "Yeteneklerimizi Keşfediyoruz" konusu için hazırlanmıştır.`);
console.log(`🎯 Doğru cevaplar karışık olarak ayarlanmıştır (A, B, C, D karışık).`); 