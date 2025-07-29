const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// M.E.B. müfredatına uygun gerçek test verileri
const testVerileri = {
  "1. Sınıf": {
    "Türkçe": {
      "Güzel Davranışlarımız": [
        {
          "soru": "Aşağıdakilerden hangisi güzel bir davranıştır?",
          "secenekA": "Arkadaşımızla kavga etmek",
          "secenekB": "Büyüklerimize saygı göstermek",
          "secenekC": "Çevreyi kirletmek",
          "secenekD": "Başkalarının eşyalarını izinsiz almak",
          "dogruCevap": "B"
        },
        {
          "soru": "Sınıfta öğretmenimiz konuşurken ne yapmalıyız?",
          "secenekA": "Arkadaşımızla konuşmak",
          "secenekB": "Dikkatle dinlemek",
          "secenekC": "Sınıfta koşmak",
          "secenekD": "Pencereye bakmak",
          "dogruCevap": "B"
        }
      ]
    }
  }
};

// Test oluşturma fonksiyonu
function testOlustur(sinif, ders, konu) {
  const testler = testVerileri[sinif]?.[ders]?.[konu];
  
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
const desktopPath = path.join(require('os').homedir(), 'Desktop', '50-Testler');
if (!fs.existsSync(desktopPath)) {
  fs.mkdirSync(desktopPath, { recursive: true });
  console.log('Masaüstünde "50-Testler" klasörü oluşturuldu.');
}

// Testleri oluştur
let testSayisi = 0;

Object.keys(testVerileri).forEach(sinif => {
  const sinifPath = path.join(desktopPath, sinif);
  if (!fs.existsSync(sinifPath)) {
    fs.mkdirSync(sinifPath, { recursive: true });
  }

  Object.keys(testVerileri[sinif]).forEach(ders => {
    const dersPath = path.join(sinifPath, ders);
    if (!fs.existsSync(dersPath)) {
      fs.mkdirSync(dersPath, { recursive: true });
    }

    Object.keys(testVerileri[sinif][ders]).forEach(konu => {
      const testAdi = `${konu}-50-Test`;
      const excelData = testOlustur(sinif, ders, konu);
      
      if (excelData) {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(excelData);
        
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Test');
        
        const dosyaAdi = `${testAdi}.xlsx`;
        const dosyaYolu = path.join(dersPath, dosyaAdi);
        
        XLSX.writeFile(workbook, dosyaYolu);
        console.log(`✅ ${dosyaYolu} oluşturuldu`);
        testSayisi++;
      }
    });
  });
});

console.log(`\n🎉 Toplam ${testSayisi} test oluşturuldu!`);
console.log(`📁 Testler masaüstündeki "50-Testler" klasöründe bulunabilir.`); 