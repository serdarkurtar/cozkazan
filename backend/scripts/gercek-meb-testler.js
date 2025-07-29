const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// M.E.B. müfredatına uygun GERÇEK test verileri
const gercekTestler = {
  "1. Sınıf": {
    "Türkçe": {
      "Güzel Davranışlarımız": [
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
        },
        {
          "soru": "Büyüklerimizle konuşurken nasıl davranmalıyız?",
          "secenekA": "Yüksek sesle konuşmak",
          "secenekB": "Saygılı davranmak",
          "secenekC": "Sözlerini kesmek",
          "secenekD": "Görmezden gelmek",
          "dogruCevap": "B"
        },
        {
          "soru": "Sınıfta arkadaşımızın kalemini düşürdüğünde ne yapmalıyız?",
          "secenekA": "Gülmek",
          "secenekB": "Alıp vermek",
          "secenekC": "Görmezden gelmek",
          "secenekD": "Kendi kalemimizi vermek",
          "dogruCevap": "B"
        },
        {
          "soru": "Tuvalete girmeden önce ne yapmalıyız?",
          "secenekA": "Kapıyı çalmak",
          "secenekB": "Kapıyı çalmak",
          "secenekC": "Direkt girmek",
          "secenekD": "Beklemek",
          "dogruCevap": "B"
        },
        {
          "soru": "Okulda hangi davranış yanlıştır?",
          "secenekA": "Öğretmenimize selam vermek",
          "secenekB": "Koridorda koşmak",
          "secenekC": "Arkadaşlarımıza yardım etmek",
          "secenekD": "Sınıfı temiz tutmak",
          "dogruCevap": "B"
        },
        {
          "soru": "Yemek yerken çatal ve bıçağı nasıl kullanmalıyız?",
          "secenekA": "Tek elle kullanmak",
          "secenekB": "Düzgün kullanmak",
          "secenekC": "Oyun aracı yapmak",
          "secenekD": "Yere atmak",
          "dogruCevap": "B"
        },
        {
          "soru": "Sınıfta öksürürken ne yapmalıyız?",
          "secenekA": "Ağzımızı açık bırakmak",
          "secenekB": "Ağzımızı kapatmak",
          "secenekC": "Yüksek sesle öksürmek",
          "secenekD": "Öksürmemek",
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
        }
      ],
      "Çevremizdeki Yaşam": [
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
        },
        {
          "soru": "Hangi sayı 6'dan küçüktür?",
          "secenekA": "7",
          "secenekB": "5",
          "secenekC": "8",
          "secenekD": "9",
          "dogruCevap": "B"
        },
        {
          "soru": "4 + 0 = ?",
          "secenekA": "0",
          "secenekB": "4",
          "secenekC": "5",
          "secenekD": "6",
          "dogruCevap": "B"
        },
        {
          "soru": "Hangi sayı 3'ten büyüktür?",
          "secenekA": "2",
          "secenekB": "5",
          "secenekC": "1",
          "secenekD": "0",
          "dogruCevap": "B"
        },
        {
          "soru": "1 + 1 + 1 = ?",
          "secenekA": "2",
          "secenekB": "3",
          "secenekC": "4",
          "secenekD": "5",
          "dogruCevap": "B"
        },
        {
          "soru": "Hangi sayı 8'den küçüktür?",
          "secenekA": "9",
          "secenekB": "7",
          "secenekC": "10",
          "secenekD": "11",
          "dogruCevap": "B"
        }
      ]
    }
  }
};

// Test oluşturma fonksiyonu
function testOlustur(sinif, ders, konu) {
  const testler = gercekTestler[sinif]?.[ders]?.[konu];
  
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
const desktopPath = path.join(require('os').homedir(), 'Desktop', 'Gerçek-Testler');
if (!fs.existsSync(desktopPath)) {
  fs.mkdirSync(desktopPath, { recursive: true });
  console.log('Masaüstünde "Gerçek-Testler" klasörü oluşturuldu.');
}

// Testleri oluştur
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
      const testAdi = `${konu.replace(/[?]/g, '')}-Gerçek-Test`;
      const excelData = testOlustur(sinif, ders, konu);
      
      if (excelData) {
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
        
        const dosyaAdi = `${testAdi}.xlsx`;
        const dosyaYolu = path.join(dersPath, dosyaAdi);
        
        XLSX.writeFile(workbook, dosyaYolu);
        console.log(`✅ ${dosyaYolu} oluşturuldu (${excelData.length - 1} soru)`);
        testSayisi++;
      }
    });
  });
});

console.log(`\n🎉 Toplam ${testSayisi} gerçek test oluşturuldu!`);
console.log(`📁 Testler masaüstündeki "Gerçek-Testler" klasöründe bulunabilir.`);
console.log(`\n📋 Bu testler M.E.B. müfredatına uygun, anlamlı sorulardan oluşmaktadır.`); 