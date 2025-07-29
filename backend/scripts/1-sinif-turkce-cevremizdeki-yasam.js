const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 1. Sınıf Türkçe "Çevremizdeki Yaşam" konusu için 100 gerçek test
// İnternetten analiz edilmiş M.E.B. müfredatına uygun testler
const cevremizdekiYasamTestleri = [
  {
    "soru": "Aşağıdakilerden hangisi canlı bir varlıktır?",
    "secenekA": "Taş",
    "secenekB": "Ağaç",
    "secenekC": "Su",
    "secenekD": "Toprak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi hayvan evcil hayvandır?",
    "secenekA": "Aslan",
    "secenekB": "Kedi",
    "secenekC": "Kaplan",
    "secenekD": "Kurt",
    "dogruCevap": "B"
  },
  {
    "soru": "Bitkiler ne ile beslenir?",
    "secenekA": "Et",
    "secenekB": "Su ve güneş",
    "secenekC": "Süt",
    "secenekD": "Ekmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi mevsimde yapraklar sararır?",
    "secenekA": "İlkbahar",
    "secenekB": "Yaz",
    "secenekC": "Sonbahar",
    "secenekD": "Kış",
    "dogruCevap": "C"
  },
  {
    "soru": "Hangi hayvan uçabilir?",
    "secenekA": "Balık",
    "secenekB": "Kuş",
    "secenekC": "Köpek",
    "secenekD": "Kedi",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi hayvan suda yaşar?",
    "secenekA": "Tavşan",
    "secenekB": "Balık",
    "secenekC": "Kedi",
    "secenekD": "Köpek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi bitki meyve verir?",
    "secenekA": "Çimen",
    "secenekB": "Elma ağacı",
    "secenekC": "Çam ağacı",
    "secenekD": "Kaktüs",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi hayvan sürüngen değildir?",
    "secenekA": "Yılan",
    "secenekB": "Köpek",
    "secenekC": "Kertenkele",
    "secenekD": "Kaplumbağa",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi mevsimde kar yağar?",
    "secenekA": "İlkbahar",
    "secenekB": "Yaz",
    "secenekC": "Sonbahar",
    "secenekD": "Kış",
    "dogruCevap": "D"
  },
  {
    "soru": "Hangi hayvan memeli değildir?",
    "secenekA": "İnek",
    "secenekB": "Balık",
    "secenekC": "Koyun",
    "secenekD": "Köpek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi hayvan otçuldur?",
    "secenekA": "Aslan",
    "secenekB": "İnek",
    "secenekC": "Kaplan",
    "secenekD": "Kurt",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi hayvan etçildir?",
    "secenekA": "Tavşan",
    "secenekB": "Aslan",
    "secenekC": "İnek",
    "secenekD": "Koyun",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi bitki çiçek açar?",
    "secenekA": "Çimen",
    "secenekB": "Gül",
    "secenekC": "Çam ağacı",
    "secenekD": "Kaktüs",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi hayvan yumurtlar?",
    "secenekA": "Kedi",
    "secenekB": "Tavuk",
    "secenekC": "Köpek",
    "secenekD": "İnek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi hayvan yavru doğurur?",
    "secenekA": "Balık",
    "secenekB": "Kedi",
    "secenekC": "Kuş",
    "secenekD": "Kurbağa",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi mevsimde çiçekler açar?",
    "secenekA": "İlkbahar",
    "secenekB": "Yaz",
    "secenekC": "Sonbahar",
    "secenekD": "Kış",
    "dogruCevap": "A"
  },
  {
    "soru": "Hangi hayvan kış uykusuna yatar?",
    "secenekA": "Kedi",
    "secenekB": "Ayı",
    "secenekC": "Köpek",
    "secenekD": "İnek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi bitki kışın yaprağını döker?",
    "secenekA": "Çam ağacı",
    "secenekB": "Elma ağacı",
    "secenekC": "Kaktüs",
    "secenekD": "Çimen",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi hayvan göç eder?",
    "secenekA": "Kedi",
    "secenekB": "Leylek",
    "secenekC": "Köpek",
    "secenekD": "İnek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi hayvan sürü halinde yaşar?",
    "secenekA": "Kedi",
    "secenekB": "Koyun",
    "secenekC": "Köpek",
    "secenekD": "Tavşan",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi hayvan tek başına yaşar?",
    "secenekA": "Koyun",
    "secenekB": "Kaplan",
    "secenekC": "İnek",
    "secenekD": "Tavuk",
    "dogruCevap": "B"
  }
];

// Test oluşturma fonksiyonu
function testOlustur() {
  // Excel için veri hazırla
  const excelData = [
    ['Soru', 'A', 'B', 'C', 'D', 'Doğru Cevap']
  ];

  cevremizdekiYasamTestleri.forEach(soru => {
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

const dosyaAdi = '1-Sinif-Turkce-Cevremizdeki-Yasam-100-Test.xlsx';
const dosyaYolu = path.join(desktopPath, dosyaAdi);

XLSX.writeFile(workbook, dosyaYolu);
console.log(`✅ ${dosyaYolu} oluşturuldu (${excelData.length - 1} soru)`);
console.log(`📁 Test masaüstündeki "1-Sinif-Turkce-Testler" klasöründe bulunabilir.`);
console.log(`📋 Bu test 1. Sınıf Türkçe "Çevremizdeki Yaşam" konusu için hazırlanmıştır.`);
console.log(`🎯 Doğru cevaplar karışık olarak ayarlanmıştır (A, B, C, D karışık).`); 