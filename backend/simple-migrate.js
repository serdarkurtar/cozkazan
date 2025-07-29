const mongoose = require('mongoose');
const Test = require('./models/Test');
const Ders = require('./models/Ders');
const Konu = require('./models/Konu');
const fs = require('fs');

async function exportData() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect('mongodb://localhost:27017/cozkazan');
    console.log('MongoDB bağlandı');

    // Verileri çek
    const tests = await Test.find({});
    const dersler = await Ders.find({});
    const konular = await Konu.find({});

    console.log(`Bulunan veriler:`);
    console.log(`- Tests: ${tests.length}`);
    console.log(`- Dersler: ${dersler.length}`);
    console.log(`- Konular: ${konular.length}`);

    // JSON dosyalarına kaydet
    const exportData = {
      tests: tests.map(t => t.toObject()),
      dersler: dersler.map(d => d.toObject()),
      konular: konular.map(k => k.toObject()),
      exportDate: new Date().toISOString()
    };

    fs.writeFileSync('mongo-export.json', JSON.stringify(exportData, null, 2));
    console.log('\n✅ Veriler mongo-export.json dosyasına kaydedildi!');
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

exportData(); 