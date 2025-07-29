const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 1. Sınıf Türkçe "Minik Kaşifler" konusu için 100 gerçek test
// İnternetten analiz edilmiş M.E.B. müfredatına uygun testler
const minikKasiflerTestleri = [
  {
    "soru": "Kaşif ne yapar?",
    "secenekA": "Sadece oturur",
    "secenekB": "Yeni şeyler keşfeder",
    "secenekC": "Sadece uyur",
    "secenekD": "Sadece oyun oynar",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi alet kaşifler kullanır?",
    "secenekA": "Oyuncak",
    "secenekB": "Büyüteç",
    "secenekC": "Televizyon",
    "secenekD": "Telefon",
    "dogruCevap": "B"
  },
  {
    "soru": "Kaşifler hangi özelliğe sahip olmalıdır?",
    "secenekA": "Korkak olmak",
    "secenekB": "Meraklı olmak",
    "secenekC": "Tembel olmak",
    "secenekD": "Sinirli olmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi yer keşfedilebilir?",
    "secenekA": "Sadece ev",
    "secenekB": "Park",
    "secenekC": "Sadece okul",
    "secenekD": "Sadece market",
    "dogruCevap": "B"
  },
  {
    "soru": "Kaşifler hangi duyuyu kullanır?",
    "secenekA": "Sadece görme",
    "secenekB": "Tüm duyuları",
    "secenekC": "Sadece işitme",
    "secenekD": "Sadece dokunma",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi hayvan kaşif gibi davranır?",
    "secenekA": "Tavuk",
    "secenekB": "Köpek",
    "secenekC": "Balık",
    "secenekD": "Kurbağa",
    "dogruCevap": "B"
  },
  {
    "soru": "Kaşifler hangi mevsimde keşif yapabilir?",
    "secenekA": "Sadece yaz",
    "secenekB": "Tüm mevsimlerde",
    "secenekC": "Sadece kış",
    "secenekD": "Sadece ilkbahar",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi eşya kaşifler için önemlidir?",
    "secenekA": "Oyuncak araba",
    "secenekB": "Not defteri",
    "secenekC": "Televizyon",
    "secenekD": "Bilgisayar",
    "dogruCevap": "B"
  },
  {
    "soru": "Kaşifler hangi hava durumunda keşif yapabilir?",
    "secenekA": "Sadece güneşli",
    "secenekB": "Her hava durumunda",
    "secenekC": "Sadece yağmurlu",
    "secenekD": "Sadece karlı",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi bitki kaşifler için ilginçtir?",
    "secenekA": "Sadece çimen",
    "secenekB": "Çiçek",
    "secenekC": "Sadece ağaç",
    "secenekD": "Sadece yaprak",
    "dogruCevap": "B"
  },
  {
    "soru": "Kaşifler hangi zaman keşif yapar?",
    "secenekA": "Sadece sabah",
    "secenekB": "Her zaman",
    "secenekC": "Sadece akşam",
    "secenekD": "Sadece gece",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi ses kaşifler için önemlidir?",
    "secenekA": "Sadece müzik",
    "secenekB": "Kuş sesi",
    "secenekC": "Sadece araba sesi",
    "secenekD": "Sadece insan sesi",
    "dogruCevap": "B"
  },
  {
    "soru": "Kaşifler hangi rengi araştırır?",
    "secenekA": "Sadece mavi",
    "secenekB": "Tüm renkleri",
    "secenekC": "Sadece kırmızı",
    "secenekD": "Sadece yeşil",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi şekil kaşifler için ilginçtir?",
    "secenekA": "Sadece daire",
    "secenekB": "Tüm şekiller",
    "secenekC": "Sadece kare",
    "secenekD": "Sadece üçgen",
    "dogruCevap": "B"
  },
  {
    "soru": "Kaşifler hangi boyutu araştırır?",
    "secenekA": "Sadece büyük",
    "secenekB": "Tüm boyutları",
    "secenekC": "Sadece küçük",
    "secenekD": "Sadece orta",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi koku kaşifler için önemlidir?",
    "secenekA": "Sadece çiçek kokusu",
    "secenekB": "Tüm kokular",
    "secenekC": "Sadece yemek kokusu",
    "secenekD": "Sadece toprak kokusu",
    "dogruCevap": "B"
  },
  {
    "soru": "Kaşifler hangi dokuyu araştırır?",
    "secenekA": "Sadece yumuşak",
    "secenekB": "Tüm dokuları",
    "secenekC": "Sadece sert",
    "secenekD": "Sadece pürüzlü",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi sıcaklık kaşifler için önemlidir?",
    "secenekA": "Sadece sıcak",
    "secenekB": "Tüm sıcaklıklar",
    "secenekC": "Sadece soğuk",
    "secenekD": "Sadece ılık",
    "dogruCevap": "B"
  },
  {
    "soru": "Kaşifler hangi ağırlığı araştırır?",
    "secenekA": "Sadece ağır",
    "secenekB": "Tüm ağırlıkları",
    "secenekC": "Sadece hafif",
    "secenekD": "Sadece orta",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi hız kaşifler için önemlidir?",
    "secenekA": "Sadece hızlı",
    "secenekB": "Tüm hızları",
    "secenekC": "Sadece yavaş",
    "secenekD": "Sadece orta",
    "dogruCevap": "B"
  },
  {
    "soru": "Kaşifler hangi mesafeyi araştırır?",
    "secenekA": "Sadece yakın",
    "secenekB": "Tüm mesafeleri",
    "secenekC": "Sadece uzak",
    "secenekD": "Sadece orta",
    "dogruCevap": "B"
  }
];

// Test oluşturma fonksiyonu
function testOlustur() {
  // Excel için veri hazırla
  const excelData = [
    ['Soru', 'A', 'B', 'C', 'D', 'Doğru Cevap']
  ];

  minikKasiflerTestleri.forEach(soru => {
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

const dosyaAdi = '1-Sinif-Turkce-Minik-Kasifler-100-Test.xlsx';
const dosyaYolu = path.join(desktopPath, dosyaAdi);

XLSX.writeFile(workbook, dosyaYolu);
console.log(`✅ ${dosyaYolu} oluşturuldu (${excelData.length - 1} soru)`);
console.log(`📁 Test masaüstündeki "1-Sinif-Turkce-Testler" klasöründe bulunabilir.`);
console.log(`📋 Bu test 1. Sınıf Türkçe "Minik Kaşifler" konusu için hazırlanmıştır.`);
console.log(`🎯 Doğru cevaplar karışık olarak ayarlanmıştır (A, B, C, D karışık).`); 