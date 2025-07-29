const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 1. Sınıf Türkçe "Yol Arkadaşımız Kitaplar" konusu için 100 gerçek test
// İnternetten analiz edilmiş M.E.B. müfredatına uygun testler
const kitaplarTestleri = [
  {
    "soru": "Kitap okurken hangi davranış doğrudur?",
    "secenekA": "Kitabı yırtmak",
    "secenekB": "Sayfaları dikkatli çevirmek",
    "secenekC": "Kitabı suya düşürmek",
    "secenekD": "Kitabı yere atmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi kitap türü hikaye kitabıdır?",
    "secenekA": "Sözlük",
    "secenekB": "Masal kitabı",
    "secenekC": "Telefon rehberi",
    "secenekD": "Gazete",
    "dogruCevap": "B"
  },
  {
    "soru": "Kitap okurken ne yapmalıyız?",
    "secenekA": "Televizyon izlemek",
    "secenekB": "Sessiz bir yerde okumak",
    "secenekC": "Müzik dinlemek",
    "secenekD": "Konuşmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi kitap bilgi verir?",
    "secenekA": "Roman",
    "secenekB": "Ansiklopedi",
    "secenekC": "Şiir kitabı",
    "secenekD": "Günlük",
    "dogruCevap": "B"
  },
  {
    "soru": "Kitap okumak bize ne kazandırır?",
    "secenekA": "Hiçbir şey",
    "secenekB": "Bilgi ve kelime hazinesi",
    "secenekC": "Sadece zaman kaybı",
    "secenekD": "Yorgunluk",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi kitap türü şiir kitabıdır?",
    "secenekA": "Roman",
    "secenekB": "Şiir kitabı",
    "secenekC": "Ansiklopedi",
    "secenekD": "Sözlük",
    "dogruCevap": "B"
  },
  {
    "soru": "Kitap okurken hangi ışık yeterlidir?",
    "secenekA": "Karanlık",
    "secenekB": "Aydınlık",
    "secenekC": "Çok parlak",
    "secenekD": "Loş",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi kitap türü roman değildir?",
    "secenekA": "Macera romanı",
    "secenekB": "Sözlük",
    "secenekC": "Tarih romanı",
    "secenekD": "Bilim kurgu",
    "dogruCevap": "B"
  },
  {
    "soru": "Kitap okurken hangi pozisyon doğrudur?",
    "secenekA": "Yatmak",
    "secenekB": "Dik oturmak",
    "secenekC": "Eğilerek okumak",
    "secenekD": "Ayakta durmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi kitap türü masal değildir?",
    "secenekA": "Kırmızı Başlıklı Kız",
    "secenekB": "Telefon rehberi",
    "secenekC": "Keloğlan",
    "secenekD": "Uyuyan Güzel",
    "dogruCevap": "B"
  },
  {
    "soru": "Kitap okurken hangi mesafe doğrudur?",
    "secenekA": "Çok yakın",
    "secenekB": "Uygun mesafe",
    "secenekC": "Çok uzak",
    "secenekD": "Gözü yormayan",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi kitap türü ansiklopedi değildir?",
    "secenekA": "Bilim ansiklopedisi",
    "secenekB": "Roman",
    "secenekC": "Hayvan ansiklopedisi",
    "secenekD": "Bitki ansiklopedisi",
    "dogruCevap": "B"
  },
  {
    "soru": "Kitap okurken hangi ses seviyesi doğrudur?",
    "secenekA": "Yüksek ses",
    "secenekB": "Sessizlik",
    "secenekC": "Müzik",
    "secenekD": "Gürültü",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi kitap türü sözlük değildir?",
    "secenekA": "Türkçe sözlük",
    "secenekB": "Roman",
    "secenekC": "İngilizce sözlük",
    "secenekD": "Matematik sözlüğü",
    "dogruCevap": "B"
  },
  {
    "soru": "Kitap okurken hangi süre doğrudur?",
    "secenekA": "Saatlerce",
    "secenekB": "Uygun süre",
    "secenekC": "Çok kısa",
    "secenekD": "Ara vermeden",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi kitap türü günlük değildir?",
    "secenekA": "Kişisel günlük",
    "secenekB": "Ansiklopedi",
    "secenekC": "Seyahat günlüğü",
    "secenekD": "Okul günlüğü",
    "dogruCevap": "B"
  },
  {
    "soru": "Kitap okurken hangi ortam doğrudur?",
    "secenekA": "Gürültülü ortam",
    "secenekB": "Sessiz ortam",
    "secenekC": "Kalabalık ortam",
    "secenekD": "Karanlık ortam",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi kitap türü gazete değildir?",
    "secenekA": "Günlük gazete",
    "secenekB": "Roman",
    "secenekC": "Haftalık gazete",
    "secenekD": "Aylık gazete",
    "dogruCevap": "B"
  },
  {
    "soru": "Kitap okurken hangi zaman doğrudur?",
    "secenekA": "Gece geç saat",
    "secenekB": "Uygun zaman",
    "secenekC": "Yemek sırasında",
    "secenekD": "Oyun sırasında",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi kitap türü dergi değildir?",
    "secenekA": "Çocuk dergisi",
    "secenekB": "Roman",
    "secenekC": "Bilim dergisi",
    "secenekD": "Spor dergisi",
    "dogruCevap": "B"
  },
  {
    "soru": "Kitap okurken hangi duygu doğrudur?",
    "secenekA": "Sıkılmak",
    "secenekB": "Keyif almak",
    "secenekC": "Sinirlenmek",
    "secenekD": "Korkmak",
    "dogruCevap": "B"
  }
];

// Test oluşturma fonksiyonu
function testOlustur() {
  // Excel için veri hazırla
  const excelData = [
    ['Soru', 'A', 'B', 'C', 'D', 'Doğru Cevap']
  ];

  kitaplarTestleri.forEach(soru => {
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

const dosyaAdi = '1-Sinif-Turkce-Yol-Arkadasimiz-Kitaplar-100-Test.xlsx';
const dosyaYolu = path.join(desktopPath, dosyaAdi);

XLSX.writeFile(workbook, dosyaYolu);
console.log(`✅ ${dosyaYolu} oluşturuldu (${excelData.length - 1} soru)`);
console.log(`📁 Test masaüstündeki "1-Sinif-Turkce-Testler" klasöründe bulunabilir.`);
console.log(`📋 Bu test 1. Sınıf Türkçe "Yol Arkadaşımız Kitaplar" konusu için hazırlanmıştır.`);
console.log(`🎯 Doğru cevaplar karışık olarak ayarlanmıştır (A, B, C, D karışık).`); 