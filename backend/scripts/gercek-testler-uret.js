const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// M.E.B. müfredatına uygun gerçek test verileri (internetten analiz edilmiş)
const gercekTestler = {
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
        },
        {
          "soru": "Yemek yerken hangi davranış doğrudur?",
          "secenekA": "Ağzımız açık çiğnemek",
          "secenekB": "Ellerimizi yıkamak",
          "secenekC": "Yemekle oynamak",
          "secenekD": "Başkalarının tabağından yemek",
          "dogruCevap": "B"
        },
        {
          "soru": "Okulda arkadaşımız düştüğünde ne yapmalıyız?",
          "secenekA": "Gülmek",
          "secenekB": "Yardım etmek",
          "secenekC": "Görmezden gelmek",
          "secenekD": "Başka yere gitmek",
          "dogruCevap": "B"
        },
        {
          "soru": "Hangi davranış çevreye zarar verir?",
          "secenekA": "Çöpleri çöp kutusuna atmak",
          "secenekB": "Yere çöp atmak",
          "secenekC": "Ağaçları korumak",
          "secenekD": "Su tasarrufu yapmak",
          "dogruCevap": "B"
        }
      ],
      "Mustafa Kemal'den Atatürk'e": [
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
        }
      ]
    },
    "Matematik": {
      "Sayılar ve Nicelikler (1)": [
        {
          "soru": "Aşağıdaki sayılardan hangisi en büyüktür?",
          "secenekA": "5",
          "secenekB": "3",
          "secenekC": "7",
          "secenekD": "2",
          "dogruCevap": "C"
        },
        {
          "soru": "3 + 2 = ?",
          "secenekA": "4",
          "secenekB": "5",
          "secenekC": "6",
          "secenekD": "7",
          "dogruCevap": "B"
        },
        {
          "soru": "5 - 1 = ?",
          "secenekA": "3",
          "secenekB": "4",
          "secenekC": "5",
          "secenekD": "6",
          "dogruCevap": "B"
        },
        {
          "soru": "Hangi sayı 4'ten sonra gelir?",
          "secenekA": "3",
          "secenekB": "5",
          "secenekC": "6",
          "secenekD": "7",
          "dogruCevap": "B"
        },
        {
          "soru": "2 + 3 + 1 = ?",
          "secenekA": "5",
          "secenekB": "6",
          "secenekC": "7",
          "secenekD": "8",
          "dogruCevap": "B"
        }
      ]
    }
  }
};

// Test oluşturma fonksiyonu
function testOlustur(sinif, ders, konu, testAdi) {
  const testler = gercekTestler[sinif]?.[ders]?.[konu];
  
  if (!testler) {
    console.log(`${sinif} - ${ders} - ${konu} için test bulunamadı!`);
    return null;
  }

  // Excel için veri hazırla
  const excelData = [
    ['Soru', 'A', 'B', 'C', 'D', 'Doğru Cevap'] // Başlık satırı
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
const desktopPath = path.join(require('os').homedir(), 'Desktop', 'Testler');
if (!fs.existsSync(desktopPath)) {
  fs.mkdirSync(desktopPath, { recursive: true });
  console.log('Masaüstünde "Testler" klasörü oluşturuldu.');
}

// Tüm testleri oluştur
let testSayisi = 0;

Object.keys(gercekTestler).forEach(sinif => {
  const sinifPath = path.join(desktopPath, sinif);
  if (!fs.existsSync(sinifPath)) {
    fs.mkdirSync(sinifPath, { recursive: true });
  }

  Object.keys(gercekTestler[sinif]).forEach(ders => {
    const dersPath = path.join(sinifPath, ders);
    if (!fs.existsSync(dersPath)) {
      fs.mkdirSync(dersPath, { recursive: true });
    }

    Object.keys(gercekTestler[sinif][ders]).forEach(konu => {
      const testAdi = `${konu}-Test`;
      const excelData = testOlustur(sinif, ders, konu, testAdi);
      
      if (excelData) {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(excelData);
        
        // Sütun genişliklerini ayarla
        const colWidths = [
          { wch: 50 }, // Soru
          { wch: 20 }, // A
          { wch: 20 }, // B
          { wch: 20 }, // C
          { wch: 20 }, // D
          { wch: 15 }  // Doğru Cevap
        ];
        worksheet['!cols'] = colWidths;
        
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
console.log(`📁 Testler masaüstündeki "Testler" klasöründe bulunabilir.`); 