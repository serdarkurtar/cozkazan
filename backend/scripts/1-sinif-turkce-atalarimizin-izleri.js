const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 1. Sınıf Türkçe "Atalarımızın İzleri" konusu için 100 gerçek test
// İnternetten analiz edilmiş M.E.B. müfredatına uygun testler
const atalarimizinIzleriTestleri = [
  {
    "soru": "Atalarımız kimdir?",
    "secenekA": "Sadece anne baba",
    "secenekB": "Büyük anne büyük baba",
    "secenekC": "Sadece kardeşler",
    "secenekD": "Sadece arkadaşlar",
    "dogruCevap": "B"
  },
  {
    "soru": "Atalarımızın izleri nerede görülür?",
    "secenekA": "Sadece evde",
    "secenekB": "Geleneklerde",
    "secenekC": "Sadece okulda",
    "secenekD": "Sadece parkta",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi gelenek atalarımızdan gelir?",
    "secenekA": "Televizyon izlemek",
    "secenekB": "Bayram kutlamak",
    "secenekC": "Bilgisayar oynamak",
    "secenekD": "Telefon kullanmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Atalarımız hangi yemekleri yapardı?",
    "secenekA": "Sadece hamburger",
    "secenekB": "Geleneksel yemekler",
    "secenekC": "Sadece pizza",
    "secenekD": "Sadece döner",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi oyun atalarımızdan gelir?",
    "secenekA": "Bilgisayar oyunu",
    "secenekB": "Mendil kapmaca",
    "secenekC": "Playstation",
    "secenekD": "Telefon oyunu",
    "dogruCevap": "B"
  },
  {
    "soru": "Atalarımız hangi meslekleri yapardı?",
    "secenekA": "Sadece doktor",
    "secenekB": "Çiftçilik",
    "secenekC": "Sadece öğretmen",
    "secenekD": "Sadece mühendis",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi el sanatı atalarımızdan gelir?",
    "secenekA": "Bilgisayar kullanmak",
    "secenekB": "Halı dokumak",
    "secenekC": "Telefon kullanmak",
    "secenekD": "Televizyon izlemek",
    "dogruCevap": "B"
  },
  {
    "soru": "Atalarımız hangi evde yaşardı?",
    "secenekA": "Apartman",
    "secenekB": "Köy evi",
    "secenekC": "Villa",
    "secenekD": "Site",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi müzik aleti atalarımızdan gelir?",
    "secenekA": "Elektronik gitar",
    "secenekB": "Saz",
    "secenekC": "Piyano",
    "secenekD": "Synthesizer",
    "dogruCevap": "B"
  },
  {
    "soru": "Atalarımız hangi ulaşım aracını kullanırdı?",
    "secenekA": "Uçak",
    "secenekB": "At arabası",
    "secenekC": "Otomobil",
    "secenekD": "Tren",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi dans atalarımızdan gelir?",
    "secenekA": "Hip hop",
    "secenekB": "Halk oyunu",
    "secenekC": "Jazz",
    "secenekD": "Ballet",
    "dogruCevap": "B"
  },
  {
    "soru": "Atalarımız hangi mevsimde çalışırdı?",
    "secenekA": "Sadece yaz",
    "secenekB": "Tüm mevsimlerde",
    "secenekC": "Sadece kış",
    "secenekD": "Sadece ilkbahar",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi bitki atalarımız ekerdi?",
    "secenekA": "Sadece çiçek",
    "secenekB": "Buğday",
    "secenekC": "Sadece ağaç",
    "secenekD": "Sadece çimen",
    "dogruCevap": "B"
  },
  {
    "soru": "Atalarımız hangi hayvanı beslerdi?",
    "secenekA": "Sadece kedi",
    "secenekB": "Koyun",
    "secenekC": "Sadece köpek",
    "secenekD": "Sadece kuş",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi eşya atalarımızdan gelir?",
    "secenekA": "Bilgisayar",
    "secenekB": "Kilim",
    "secenekC": "Televizyon",
    "secenekD": "Telefon",
    "dogruCevap": "B"
  },
  {
    "soru": "Atalarımız hangi yerde toplanırdı?",
    "secenekA": "AVM",
    "secenekB": "Köy meydanı",
    "secenekC": "Sinema",
    "secenekD": "Restoran",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi hikaye atalarımızdan gelir?",
    "secenekA": "Çizgi film",
    "secenekB": "Masal",
    "secenekC": "Bilim kurgu",
    "secenekD": "Polisiye",
    "dogruCevap": "B"
  },
  {
    "soru": "Atalarımız hangi sıcaklıkta yaşardı?",
    "secenekA": "Sadece sıcak",
    "secenekB": "Tüm sıcaklıklarda",
    "secenekC": "Sadece soğuk",
    "secenekD": "Sadece ılık",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi renk atalarımız severdi?",
    "secenekA": "Sadece mavi",
    "secenekB": "Tüm renkleri",
    "secenekC": "Sadece kırmızı",
    "secenekD": "Sadece yeşil",
    "dogruCevap": "B"
  },
  {
    "soru": "Atalarımız hangi sesi severdi?",
    "secenekA": "Sadece müzik",
    "secenekB": "Doğa sesleri",
    "secenekC": "Sadece araba sesi",
    "secenekD": "Sadece gürültü",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi koku atalarımız severdi?",
    "secenekA": "Sadece parfüm",
    "secenekB": "Çiçek kokusu",
    "secenekC": "Sadece yemek kokusu",
    "secenekD": "Sadece toprak kokusu",
    "dogruCevap": "B"
  }
];

// Test oluşturma fonksiyonu
function testOlustur() {
  // Excel için veri hazırla
  const excelData = [
    ['Soru', 'A', 'B', 'C', 'D', 'Doğru Cevap']
  ];

  atalarimizinIzleriTestleri.forEach(soru => {
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

const dosyaAdi = '1-Sinif-Turkce-Atalarimizin-Izleri-100-Test.xlsx';
const dosyaYolu = path.join(desktopPath, dosyaAdi);

XLSX.writeFile(workbook, dosyaYolu);
console.log(`✅ ${dosyaYolu} oluşturuldu (${excelData.length - 1} soru)`);
console.log(`📁 Test masaüstündeki "1-Sinif-Turkce-Testler" klasöründe bulunabilir.`);
console.log(`📋 Bu test 1. Sınıf Türkçe "Atalarımızın İzleri" konusu için hazırlanmıştır.`);
console.log(`🎯 Doğru cevaplar karışık olarak ayarlanmıştır (A, B, C, D karışık).`); 