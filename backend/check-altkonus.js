const mongoose = require('mongoose');

// MongoDB connection
const mongoUrl = 'mongodb://localhost:27017/cozkazan';

// AltKonu koleksiyonu için model
const AltKonuSchema = new mongoose.Schema({}, { strict: false });
const AltKonu = mongoose.model('AltKonu', AltKonuSchema, 'altkonus');

async function checkAltKonus() {
  try {
    console.log('🔄 MongoDB bağlantısı kuruluyor...');
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB bağlantısı başarılı');

    console.log('\n📊 ALTKONUS KOLEKSİYONU ANALİZİ');
    console.log('================================');

    // AltKonu koleksiyonunu kontrol et
    console.log('\n📝 ALTKONUS:');
    const altKonular = await AltKonu.find({});
    console.log(`Toplam ${altKonular.length} alt konu bulundu:`);
    
    // Alt konuları sınıf ve derse göre grupla
    const altKonuGruplari = {};
    for (const altKonu of altKonular) {
      const sinifAdi = altKonu.sinifAdi || 'Belirtilmemiş';
      const dersAdi = altKonu.dersAdi || 'Belirtilmemiş';
      const konuAdi = altKonu.konuAdi || 'Belirtilmemiş';
      
      if (!altKonuGruplari[sinifAdi]) {
        altKonuGruplari[sinifAdi] = {};
      }
      if (!altKonuGruplari[sinifAdi][dersAdi]) {
        altKonuGruplari[sinifAdi][dersAdi] = {};
      }
      if (!altKonuGruplari[sinifAdi][dersAdi][konuAdi]) {
        altKonuGruplari[sinifAdi][dersAdi][konuAdi] = [];
      }
      altKonuGruplari[sinifAdi][dersAdi][konuAdi].push(altKonu.ad);
    }

    // Gruplandırılmış alt konuları yazdır
    let toplamAltKonu = 0;
    for (const [sinifAdi, dersler] of Object.entries(altKonuGruplari)) {
      console.log(`\n  ${sinifAdi}:`);
      for (const [dersAdi, konular] of Object.entries(dersler)) {
        console.log(`    ${dersAdi}:`);
        for (const [konuAdi, altKonular] of Object.entries(konular)) {
          console.log(`      ${konuAdi} (${altKonular.length} alt konu):`);
          toplamAltKonu += altKonular.length;
          for (const altKonu of altKonular) {
            console.log(`        - ${altKonu}`);
          }
        }
      }
    }
    console.log(`\n📊 TOPLAM ALT KONU SAYISI: ${toplamAltKonu}`);

    // İlk birkaç alt konunun detaylarını göster
    console.log('\n🔍 İLK 5 ALT KONU DETAYI:');
    for (let i = 0; i < Math.min(5, altKonular.length); i++) {
      const altKonu = altKonular[i];
      console.log(`\n  Alt Konu ${i + 1}:`);
      console.log(`    ID: ${altKonu._id}`);
      console.log(`    Ad: ${altKonu.ad}`);
      console.log(`    Sınıf: ${altKonu.sinifAdi}`);
      console.log(`    Ders: ${altKonu.dersAdi}`);
      console.log(`    Konu: ${altKonu.konuAdi}`);
      console.log(`    Tüm alanlar:`, Object.keys(altKonu.toObject()));
    }

    console.log('\n✅ AltKonus analizi tamamlandı!');
    await mongoose.disconnect();

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

checkAltKonus(); 