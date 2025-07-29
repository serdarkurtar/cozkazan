const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Hızlı test oluşturma fonksiyonu
function hizliTestOlustur(konuAdi, dersAdi, sinifAdi) {
  const testler = [];
  
  // Her konu için 50 test oluştur
  for (let i = 1; i <= 50; i++) {
    let soru, secenekA, secenekB, secenekC, secenekD, dogruCevap;
    
    if (dersAdi === 'Türkçe') {
      const turkceSorulari = [
        {
          "soru": `${konuAdi} konusunda aşağıdakilerden hangisi doğrudur?`,
          "secenekA": "Yanlış seçenek A",
          "secenekB": "Doğru cevap",
          "secenekC": "Yanlış seçenek C",
          "secenekD": "Yanlış seçenek D",
          "dogruCevap": "B"
        },
        {
          "soru": `${konuAdi} ile ilgili hangi davranış uygun değildir?`,
          "secenekA": "Doğru davranış",
          "secenekB": "Yanlış davranış",
          "secenekC": "Uygun davranış",
          "secenekD": "Güzel davranış",
          "dogruCevap": "B"
        },
        {
          "soru": `${konuAdi} konusunda en önemli kural nedir?`,
          "secenekA": "Önemsiz kural",
          "secenekB": "En önemli kural",
          "secenekC": "Orta önemli kural",
          "secenekD": "Az önemli kural",
          "dogruCevap": "B"
        }
      ];
      
      const soruIndex = (i - 1) % turkceSorulari.length;
      const secilenSoru = turkceSorulari[soruIndex];
      
      soru = secilenSoru.soru;
      secenekA = secilenSoru.secenekA;
      secenekB = secilenSoru.secenekB;
      secenekC = secilenSoru.secenekC;
      secenekD = secilenSoru.secenekD;
      dogruCevap = secilenSoru.dogruCevap;
      
    } else if (dersAdi === 'Matematik') {
      const matematikSorulari = [
        {
          "soru": `${konuAdi} konusunda ${i} + ${i+1} = ?`,
          "secenekA": i + i + 1,
          "secenekB": i + i + 2,
          "secenekC": i + i + 3,
          "secenekD": i + i + 4,
          "dogruCevap": "A"
        },
        {
          "soru": `${konuAdi} konusunda ${i+2} - ${i} = ?`,
          "secenekA": 1,
          "secenekB": 2,
          "secenekC": 3,
          "secenekD": 4,
          "dogruCevap": "B"
        },
        {
          "soru": `${konuAdi} konusunda ${i} x ${i} = ?`,
          "secenekA": i * i,
          "secenekB": i * i + 1,
          "secenekC": i * i + 2,
          "secenekD": i * i + 3,
          "dogruCevap": "A"
        }
      ];
      
      const soruIndex = (i - 1) % matematikSorulari.length;
      const secilenSoru = matematikSorulari[soruIndex];
      
      soru = secilenSoru.soru;
      secenekA = secilenSoru.secenekA.toString();
      secenekB = secilenSoru.secenekB.toString();
      secenekC = secilenSoru.secenekC.toString();
      secenekD = secilenSoru.secenekD.toString();
      dogruCevap = secilenSoru.dogruCevap;
      
    } else {
      // Diğer dersler için genel sorular
      soru = `${konuAdi} konusunda ${i}. soru: Aşağıdakilerden hangisi doğrudur?`;
      secenekA = "Yanlış seçenek A";
      secenekB = "Doğru cevap";
      secenekC = "Yanlış seçenek C";
      secenekD = "Yanlış seçenek D";
      dogruCevap = "B";
    }
    
    testler.push({
      "soru": soru,
      "secenekA": secenekA,
      "secenekB": secenekB,
      "secenekC": secenekC,
      "secenekD": secenekD,
      "dogruCevap": dogruCevap
    });
  }
  
  return testler;
}

// M.E.B. müfredatı
const curriculumData = [
  {
    "sinif": "1. Sınıf",
    "dersler": [
      {
        "ders": "Türkçe",
        "konular": [
          "Güzel Davranışlarımız",
          "Mustafa Kemal'den Atatürk'e",
          "Çevremizdeki Yaşam",
          "Yol Arkadaşımız Kitaplar",
          "Yeteneklerimizi Keşfediyoruz",
          "Minik Kaşifler",
          "Atalarımızın İzleri",
          "Sorumluluklarımızın Farkındayız"
        ]
      },
      {
        "ders": "Matematik",
        "konular": [
          "Nesnelerin Geometrisi (1)",
          "Sayılar ve Nicelikler (1)",
          "Sayılar ve Nicelikler (2)",
          "Sayılar ve Nicelikler (3)",
          "İşlemlerden Cebirsel Düşünmeye",
          "Veriye Dayalı Araştırma"
        ]
      },
      {
        "ders": "Hayat Bilgisi",
        "konular": [
          "Ben ve Okulum",
          "Sağlığım ve Güvenliğim",
          "Ailem ve Toplum",
          "Yaşadığım Yer ve Ülkem",
          "Doğa ve Çevre",
          "Bilim, Teknoloji ve Sanat"
        ]
      }
    ]
  },
  {
    "sinif": "2. Sınıf",
    "dersler": [
      {
        "ders": "Türkçe",
        "konular": [
          "Değerlerimizle Varız",
          "Atatürk ve Çocuk",
          "Doğada Neler Oluyor?",
          "Okuma Serüvenimiz",
          "Yeteneklerimizi Tanıyoruz",
          "Kültür Hazinemiz",
          "Haklarımızı Biliyoruz"
        ]
      },
      {
        "ders": "Matematik",
        "konular": [
          "Nesnelerin Geometrisi (1)",
          "Sayılar ve Nicelikler (1)",
          "İşlemlerden Cebirsel Düşünmeye",
          "Sayılar ve Nicelikler (2)",
          "Nesnelerin Geometrisi (2)",
          "Veriye Dayalı Araştırma"
        ]
      }
    ]
  }
];

// Masaüstü klasörü oluştur
const desktopPath = path.join(require('os').homedir(), 'Desktop', 'Hizli-50-Testler');
if (!fs.existsSync(desktopPath)) {
  fs.mkdirSync(desktopPath, { recursive: true });
  console.log('Masaüstünde "Hizli-50-Testler" klasörü oluşturuldu.');
}

// Tüm testleri oluştur
let testSayisi = 0;

curriculumData.forEach(sinifData => {
  const sinif = sinifData.sinif;
  const sinifPath = path.join(desktopPath, sinif);
  if (!fs.existsSync(sinifPath)) {
    fs.mkdirSync(sinifPath, { recursive: true });
  }

  sinifData.dersler.forEach(dersData => {
    const ders = dersData.ders;
    const dersPath = path.join(sinifPath, ders);
    if (!fs.existsSync(dersPath)) {
      fs.mkdirSync(dersPath, { recursive: true });
    }

    dersData.konular.forEach(konu => {
      console.log(`${sinif} - ${ders} - ${konu} için 50 test oluşturuluyor...`);
      
      const testler = hizliTestOlustur(konu, ders, sinif);
      
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
      
      const testAdi = `${konu.replace(/[?]/g, '')}-50-Test`;
      const dosyaAdi = `${testAdi}.xlsx`;
      const dosyaYolu = path.join(dersPath, dosyaAdi);
      
      XLSX.writeFile(workbook, dosyaYolu);
      console.log(`✅ ${dosyaYolu} oluşturuldu (50 soru)`);
      testSayisi++;
    });
  });
});

console.log(`\n🎉 Toplam ${testSayisi} test dosyası oluşturuldu!`);
console.log(`📁 Testler masaüstündeki "Hizli-50-Testler" klasöründe bulunabilir.`);
console.log(`📊 Her test dosyasında 50 soru bulunmaktadır.`);
console.log(`\n📋 Oluşturulan testler:`);

curriculumData.forEach(sinifData => {
  console.log(`\n📚 ${sinifData.sinif}:`);
  sinifData.dersler.forEach(dersData => {
    console.log(`  📖 ${dersData.ders}:`);
    dersData.konular.forEach(konu => {
      console.log(`    📝 ${konu} (50 soru)`);
    });
  });
}); 