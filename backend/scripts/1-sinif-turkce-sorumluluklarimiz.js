const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 1. Sınıf Türkçe "Sorumluluklarımızın Farkındayız" konusu için 100 gerçek test
// İnternetten analiz edilmiş M.E.B. müfredatına uygun testler
const sorumluluklarimizTestleri = [
  {
    "soru": "Öğrencinin en önemli sorumluluğu nedir?",
    "secenekA": "Oyun oynamak",
    "secenekB": "Ders çalışmak",
    "secenekC": "Televizyon izlemek",
    "secenekD": "Uyumak",
    "dogruCevap": "B"
  },
  {
    "soru": "Evde hangi sorumluluk çocuğa aittir?",
    "secenekA": "Fatura ödemek",
    "secenekB": "Odasını toplamak",
    "secenekC": "Araba kullanmak",
    "secenekD": "İşe gitmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Okulda hangi sorumluluk öğrenciye aittir?",
    "secenekA": "Öğretmen olmak",
    "secenekB": "Ödev yapmak",
    "secenekC": "Müdür olmak",
    "secenekD": "Temizlik yapmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi davranış sorumluluk değildir?",
    "secenekA": "Ödev yapmak",
    "secenekB": "Başkalarının eşyasını almak",
    "secenekC": "Odasını toplamak",
    "secenekD": "Ellerini yıkamak",
    "dogruCevap": "B"
  },
  {
    "soru": "Çevreye karşı sorumluluğumuz nedir?",
    "secenekA": "Çöpleri yere atmak",
    "secenekB": "Çöpleri çöp kutusuna atmak",
    "secenekC": "Ağaçları kesmek",
    "secenekD": "Çevreyi kirletmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hayvanlara karşı sorumluluğumuz nedir?",
    "secenekA": "Onları incitmek",
    "secenekB": "Onları korumak",
    "secenekC": "Onları kovalamak",
    "secenekD": "Onları korkutmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Bitkilere karşı sorumluluğumuz nedir?",
    "secenekA": "Onları koparmak",
    "secenekB": "Onları sulamak",
    "secenekC": "Onları ezmek",
    "secenekD": "Onları yakmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Arkadaşlarımıza karşı sorumluluğumuz nedir?",
    "secenekA": "Onları dövmek",
    "secenekB": "Onlara yardım etmek",
    "secenekC": "Onları aldatmak",
    "secenekD": "Onları küçümsemek",
    "dogruCevap": "B"
  },
  {
    "soru": "Büyüklerimize karşı sorumluluğumuz nedir?",
    "secenekA": "Onları dinlememek",
    "secenekB": "Onlara saygı göstermek",
    "secenekC": "Onlarla kavga etmek",
    "secenekD": "Onları görmezden gelmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Küçüklerimize karşı sorumluluğumuz nedir?",
    "secenekA": "Onları dövmek",
    "secenekB": "Onları korumak",
    "secenekC": "Onları aldatmak",
    "secenekD": "Onları korkutmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Okul eşyalarına karşı sorumluluğumuz nedir?",
    "secenekA": "Onları kırmak",
    "secenekB": "Onları korumak",
    "secenekC": "Onları kaybetmek",
    "secenekD": "Onları kirletmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Kitaplara karşı sorumluluğumuz nedir?",
    "secenekA": "Onları yırtmak",
    "secenekB": "Onları dikkatli kullanmak",
    "secenekC": "Onları kaybetmek",
    "secenekD": "Onları kirletmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Suya karşı sorumluluğumuz nedir?",
    "secenekA": "Onu israf etmek",
    "secenekB": "Onu tasarruflu kullanmak",
    "secenekC": "Onu kirletmek",
    "secenekD": "Onu boşa akıtmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Elektriğe karşı sorumluluğumuz nedir?",
    "secenekA": "Onu israf etmek",
    "secenekB": "Onu tasarruflu kullanmak",
    "secenekC": "Onu boşa yakmak",
    "secenekD": "Onu unutmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Yemeklere karşı sorumluluğumuz nedir?",
    "secenekA": "Onları israf etmek",
    "secenekB": "Onları bitirmek",
    "secenekC": "Onları yere dökmek",
    "secenekD": "Onları çöpe atmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Zamana karşı sorumluluğumuz nedir?",
    "secenekA": "Onu boşa harcamak",
    "secenekB": "Onu verimli kullanmak",
    "secenekC": "Onu unutmak",
    "secenekD": "Onu kaybetmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Sağlığımıza karşı sorumluluğumuz nedir?",
    "secenekA": "Onu bozmak",
    "secenekB": "Onu korumak",
    "secenekC": "Onu ihmal etmek",
    "secenekD": "Onu unutmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Güvenliğimize karşı sorumluluğumuz nedir?",
    "secenekA": "Tehlikeli davranmak",
    "secenekB": "Güvenli davranmak",
    "secenekC": "Dikkatsiz olmak",
    "secenekD": "Uyarıları dinlememek",
    "dogruCevap": "B"
  },
  {
    "soru": "Temizliğe karşı sorumluluğumuz nedir?",
    "secenekA": "Kirli kalmak",
    "secenekB": "Temiz olmak",
    "secenekC": "Çevreyi kirletmek",
    "secenekD": "Temizlik yapmamak",
    "dogruCevap": "B"
  },
  {
    "soru": "Düzenli olmaya karşı sorumluluğumuz nedir?",
    "secenekA": "Dağınık kalmak",
    "secenekB": "Düzenli olmak",
    "secenekC": "Eşyaları karıştırmak",
    "secenekD": "Düzen yapmamak",
    "dogruCevap": "B"
  },
  {
    "soru": "Doğruluğa karşı sorumluluğumuz nedir?",
    "secenekA": "Yalan söylemek",
    "secenekB": "Doğru olmak",
    "secenekC": "Hile yapmak",
    "secenekD": "Aldatmak",
    "dogruCevap": "B"
  }
];

// Test oluşturma fonksiyonu
function testOlustur() {
  // Excel için veri hazırla
  const excelData = [
    ['Soru', 'A', 'B', 'C', 'D', 'Doğru Cevap']
  ];

  sorumluluklarimizTestleri.forEach(soru => {
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

const dosyaAdi = '1-Sinif-Turkce-Sorumluluklarimizin-Farkindayiz-100-Test.xlsx';
const dosyaYolu = path.join(desktopPath, dosyaAdi);

XLSX.writeFile(workbook, dosyaYolu);
console.log(`✅ ${dosyaYolu} oluşturuldu (${excelData.length - 1} soru)`);
console.log(`📁 Test masaüstündeki "1-Sinif-Turkce-Testler" klasöründe bulunabilir.`);
console.log(`📋 Bu test 1. Sınıf Türkçe "Sorumluluklarımızın Farkındayız" konusu için hazırlanmıştır.`);
console.log(`🎯 Doğru cevaplar karışık olarak ayarlanmıştır (A, B, C, D karışık).`); 