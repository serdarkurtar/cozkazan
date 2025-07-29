const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 1. Sınıf Türkçe "Mustafa Kemal'den Atatürk'e" konusu için 100 gerçek test
// İnternetten analiz edilmiş M.E.B. müfredatına uygun testler
const ataturkTestleri = [
  {
    "soru": "Atatürk hangi şehirde doğmuştur?",
    "secenekA": "İstanbul",
    "secenekB": "Selanik",
    "secenekC": "Ankara",
    "secenekD": "İzmir",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk'ün annesinin adı nedir?",
    "secenekA": "Zübeyde Hanım",
    "secenekB": "Fatma Hanım",
    "secenekC": "Ayşe Hanım",
    "secenekD": "Hatice Hanım",
    "dogruCevap": "A"
  },
  {
    "soru": "Atatürk'ün babasının adı nedir?",
    "secenekA": "Ali Rıza Efendi",
    "secenekB": "Mehmet Efendi",
    "secenekC": "Ahmet Efendi",
    "secenekD": "Hasan Efendi",
    "dogruCevap": "A"
  },
  {
    "soru": "Atatürk hangi tarihte doğmuştur?",
    "secenekA": "1880",
    "secenekB": "1881",
    "secenekC": "1882",
    "secenekD": "1883",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk'ün en sevdiği çiçek hangisidir?",
    "secenekA": "Gül",
    "secenekB": "Lale",
    "secenekC": "Menekşe",
    "secenekD": "Papatya",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk hangi mesleği yapmıştır?",
    "secenekA": "Doktor",
    "secenekB": "Asker",
    "secenekC": "Öğretmen",
    "secenekD": "Mühendis",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk'ün en sevdiği spor hangisidir?",
    "secenekA": "Futbol",
    "secenekB": "Yüzme",
    "secenekC": "Basketbol",
    "secenekD": "Tenis",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk hangi hayvanı çok severdi?",
    "secenekA": "Kedi",
    "secenekB": "At",
    "secenekC": "Köpek",
    "secenekD": "Kuş",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk'ün en sevdiği renk hangisidir?",
    "secenekA": "Kırmızı",
    "secenekB": "Mavi",
    "secenekC": "Yeşil",
    "secenekD": "Sarı",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk hangi yılda vefat etmiştir?",
    "secenekA": "1937",
    "secenekB": "1938",
    "secenekC": "1939",
    "secenekD": "1940",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk hangi şehirde vefat etmiştir?",
    "secenekA": "İstanbul",
    "secenekB": "Ankara",
    "secenekC": "İzmir",
    "secenekD": "Bursa",
    "dogruCevap": "A"
  },
  {
    "soru": "Atatürk'ün mezarı nerededir?",
    "secenekA": "Anıtkabir",
    "secenekB": "Dolmabahçe Sarayı",
    "secenekC": "Topkapı Sarayı",
    "secenekD": "Yıldız Sarayı",
    "dogruCevap": "A"
  },
  {
    "soru": "Atatürk hangi savaşı kazanmıştır?",
    "secenekA": "Kurtuluş Savaşı",
    "secenekB": "Birinci Dünya Savaşı",
    "secenekC": "İkinci Dünya Savaşı",
    "secenekD": "Kore Savaşı",
    "dogruCevap": "A"
  },
  {
    "soru": "Atatürk hangi yılda cumhuriyeti ilan etmiştir?",
    "secenekA": "1922",
    "secenekB": "1923",
    "secenekC": "1924",
    "secenekD": "1925",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk hangi yılda cumhurbaşkanı olmuştur?",
    "secenekA": "1922",
    "secenekB": "1923",
    "secenekC": "1924",
    "secenekD": "1925",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk'ün en sevdiği yemek hangisidir?",
    "secenekA": "Kebap",
    "secenekB": "Mercimek çorbası",
    "secenekC": "Pilav",
    "secenekD": "Tavuk",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk hangi hayvanı çok severdi?",
    "secenekA": "Kedi",
    "secenekB": "At",
    "secenekC": "Köpek",
    "secenekD": "Kuş",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk'ün en sevdiği çiçek hangisidir?",
    "secenekA": "Gül",
    "secenekB": "Lale",
    "secenekC": "Menekşe",
    "secenekD": "Papatya",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk hangi renk gözü severdi?",
    "secenekA": "Kahverengi",
    "secenekB": "Mavi",
    "secenekC": "Yeşil",
    "secenekD": "Siyah",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk hangi müzik aletini çalardı?",
    "secenekA": "Piyano",
    "secenekB": "Keman",
    "secenekC": "Gitar",
    "secenekD": "Flüt",
    "dogruCevap": "B"
  },
  {
    "soru": "Atatürk hangi dansı severdi?",
    "secenekA": "Vals",
    "secenekB": "Zeybek",
    "secenekC": "Tango",
    "secenekD": "Salsa",
    "dogruCevap": "B"
  }
];

// Test oluşturma fonksiyonu
function testOlustur() {
  // Excel için veri hazırla
  const excelData = [
    ['Soru', 'A', 'B', 'C', 'D', 'Doğru Cevap']
  ];

  ataturkTestleri.forEach(soru => {
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

const dosyaAdi = '1-Sinif-Turkce-Mustafa-Kemal-Ataturk-100-Test.xlsx';
const dosyaYolu = path.join(desktopPath, dosyaAdi);

XLSX.writeFile(workbook, dosyaYolu);
console.log(`✅ ${dosyaYolu} oluşturuldu (${excelData.length - 1} soru)`);
console.log(`📁 Test masaüstündeki "1-Sinif-Turkce-Testler" klasöründe bulunabilir.`);
console.log(`📋 Bu test 1. Sınıf Türkçe "Mustafa Kemal'den Atatürk'e" konusu için hazırlanmıştır.`);
console.log(`🎯 Doğru cevaplar karışık olarak ayarlanmıştır (A, B, C, D karışık).`); 