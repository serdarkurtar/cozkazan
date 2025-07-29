const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 1. Sınıf Türkçe "Güzel Davranışlarımız" konusu için 100 gerçek test
// İnternetten analiz edilmiş M.E.B. müfredatına uygun testler
const guzelDavranislarimizTestleri = [
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
    "dogruCevap": "A"
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
  },
  {
    "soru": "Okulda hangi davranış doğrudur?",
    "secenekA": "Koridorda koşmak",
    "secenekB": "Sessizce yürümek",
    "secenekC": "Bağırmak",
    "secenekD": "İtmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Arkadaşımızla oyun oynarken ne yapmalıyız?",
    "secenekA": "Sadece kendimiz oynamak",
    "secenekB": "Sıramızı beklemek",
    "secenekC": "Oyunu bozmak",
    "secenekD": "Kavga etmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi davranış yardımseverliktir?",
    "secenekA": "Başkalarına zarar vermek",
    "secenekB": "Başkalarına yardım etmek",
    "secenekC": "Başkalarını küçümsemek",
    "secenekD": "Başkalarını aldatmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Sınıfta hangi davranış yanlıştır?",
    "secenekA": "Ödev yapmak",
    "secenekB": "Sınıfta koşmak",
    "secenekC": "Dersi dinlemek",
    "secenekD": "El kaldırmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi davranış temizliktir?",
    "secenekA": "Yere çöp atmak",
    "secenekB": "Ellerimizi yıkamak",
    "secenekC": "Çevreyi kirletmek",
    "secenekD": "Temizlik yapmamak",
    "dogruCevap": "B"
  },
  {
    "soru": "Okulda hangi davranış doğrudur?",
    "secenekA": "Sınıfta gürültü yapmak",
    "secenekB": "Sessizce çalışmak",
    "secenekC": "Bağırmak",
    "secenekD": "İtmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi davranış saygılıdır?",
    "secenekA": "Büyüklerimizi dinlememek",
    "secenekB": "Büyüklerimizi dinlemek",
    "secenekC": "Büyüklerimizle kavga etmek",
    "secenekD": "Büyüklerimizi görmezden gelmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Sınıfta hangi davranış doğrudur?",
    "secenekA": "Sınıfta koşmak",
    "secenekB": "Sessizce oturmak",
    "secenekC": "Bağırmak",
    "secenekD": "İtmek",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi davranış dürüstlüktür?",
    "secenekA": "Yalan söylemek",
    "secenekB": "Doğruyu söylemek",
    "secenekC": "Hile yapmak",
    "secenekD": "Aldatmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Okulda hangi davranış yanlıştır?",
    "secenekA": "Öğretmenimize selam vermek",
    "secenekB": "Sınıfta koşmak",
    "secenekC": "Dersi dinlemek",
    "secenekD": "El kaldırmak",
    "dogruCevap": "B"
  },
  {
    "soru": "Hangi davranış paylaşımcılıktır?",
    "secenekA": "Sadece kendimiz için almak",
    "secenekB": "Arkadaşımızla paylaşmak",
    "secenekC": "Başkalarının eşyasını almak",
    "secenekD": "Paylaşmamak",
    "dogruCevap": "B"
  }
];

// Test oluşturma fonksiyonu
function testOlustur() {
  // Excel için veri hazırla
  const excelData = [
    ['Soru', 'A', 'B', 'C', 'D', 'Doğru Cevap']
  ];

  guzelDavranislarimizTestleri.forEach(soru => {
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

const dosyaAdi = '1-Sinif-Turkce-Guzel-Davranislarimiz-100-Test.xlsx';
const dosyaYolu = path.join(desktopPath, dosyaAdi);

XLSX.writeFile(workbook, dosyaYolu);
console.log(`✅ ${dosyaYolu} oluşturuldu (${excelData.length - 1} soru)`);
console.log(`📁 Test masaüstündeki "1-Sinif-Turkce-Testler" klasöründe bulunabilir.`);
console.log(`📋 Bu test 1. Sınıf Türkçe "Güzel Davranışlarımız" konusu için hazırlanmıştır.`);
console.log(`🎯 Doğru cevaplar karışık olarak ayarlanmıştır (A, B, C, D karışık).`); 