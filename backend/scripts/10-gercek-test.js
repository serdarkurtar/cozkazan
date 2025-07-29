const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 10 gerçek test daha
const ekTestler = {
  "1. Sınıf": {
    "Türkçe": {
      "Yol Arkadaşımız Kitaplar": [
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
        }
      ]
    },
    "Matematik": {
      "Nesnelerin Geometrisi (1)": [
        {
          "soru": "Hangi şekil üçgendir?",
          "secenekA": "Kare",
          "secenekB": "Üç köşeli şekil",
          "secenekC": "Daire",
          "secenekD": "Dikdörtgen",
          "dogruCevap": "B"
        },
        {
          "soru": "Kare kaç köşelidir?",
          "secenekA": "3",
          "secenekB": "4",
          "secenekC": "5",
          "secenekD": "6",
          "dogruCevap": "B"
        },
        {
          "soru": "Daire hangi şekildedir?",
          "secenekA": "Köşeli",
          "secenekB": "Yuvarlak",
          "secenekC": "Kare",
          "secenekD": "Üçgen",
          "dogruCevap": "B"
        },
        {
          "soru": "Hangi şekil dikdörtgendir?",
          "secenekA": "Kare",
          "secenekB": "Uzun dikdörtgen",
          "secenekC": "Daire",
          "secenekD": "Üçgen",
          "dogruCevap": "B"
        },
        {
          "soru": "Üçgen kaç kenarlıdır?",
          "secenekA": "2",
          "secenekB": "3",
          "secenekC": "4",
          "secenekD": "5",
          "dogruCevap": "B"
        }
      ]
    }
  }
};

// Test oluşturma fonksiyonu
function testOlustur(sinif, ders, konu) {
  const testler = ekTestler[sinif]?.[ders]?.[konu];
  
  if (!testler) {
    console.log(`${sinif} - ${ders} - ${konu} için test bulunamadı!`);
    return null;
  }

  // Excel için veri hazırla
  const excelData = [
    ['Soru', 'A', 'B', 'C', 'D', 'Doğru Cevap']
  ];

  testler.forEach(soru => {
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
const desktopPath = path.join(require('os').homedir(), 'Desktop', '10-Gerçek-Test');
if (!fs.existsSync(desktopPath)) {
  fs.mkdirSync(desktopPath, { recursive: true });
  console.log('Masaüstünde "10-Gerçek-Test" klasörü oluşturuldu.');
}

// Testleri oluştur
let testSayisi = 0;

Object.keys(ekTestler).forEach(sinif => {
  const sinifPath = path.join(desktopPath, sinif);
  if (!fs.existsSync(sinifPath)) {
    fs.mkdirSync(sinifPath, { recursive: true });
  }

  Object.keys(ekTestler[sinif]).forEach(ders => {
    const dersPath = path.join(sinifPath, ders);
    if (!fs.existsSync(dersPath)) {
      fs.mkdirSync(dersPath, { recursive: true });
    }

    Object.keys(ekTestler[sinif][ders]).forEach(konu => {
      const testAdi = `${konu.replace(/[?]/g, '')}-10-Test`;
      const excelData = testOlustur(sinif, ders, konu);
      
      if (excelData) {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(excelData);
        
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Test');
        
        const dosyaAdi = `${testAdi}.xlsx`;
        const dosyaYolu = path.join(dersPath, dosyaAdi);
        
        XLSX.writeFile(workbook, dosyaYolu);
        console.log(`✅ ${dosyaYolu} oluşturuldu (${excelData.length - 1} soru)`);
        testSayisi++;
      }
    });
  });
});

console.log(`\n🎉 Toplam ${testSayisi} test daha oluşturuldu!`);
console.log(`📁 Testler masaüstündeki "10-Gerçek-Test" klasöründe bulunabilir.`);
console.log(`\n💡 Önerim: M.E.B. sitesinden gerçek testler indirin:`);
console.log(`🌐 https://www.meb.gov.tr → Öğretmenler → Sınavlar`);
console.log(`🌐 https://yardimcikaynaklar.meb.gov.tr → Testler`); 