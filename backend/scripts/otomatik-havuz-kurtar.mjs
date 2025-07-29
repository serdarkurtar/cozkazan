// Bu script, eksik test havuzlarını otomatik olarak oluşturur ve mevcut testleri havuza ekler.
// Kullanım: node scripts/otomatik-havuz-kurtar.mjs

import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Test from '../models/Test.js';
import TestHavuzu from '../models/TestHavuzu.js';
import Konu from '../models/Konu.js';
import Ders from '../models/Ders.js';
import Sinif from '../models/Sinif.js';

const MONGO_URL = 'mongodb://localhost:27017/cozkazan';

async function main() {
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('MongoDB bağlantısı başarılı.');

  const konular = await Konu.find();
  let toplamHavuz = 0;
  let toplamTest = 0;

  for (const konu of konular) {
    // Konuya ait testleri bul
    const testler = await Test.find({ konu: konu._id });
    if (!testler.length) continue;

    // Konunun ders ve sınıfını bul
    const ders = await Ders.findById(konu.ders);
    if (!ders) continue;
    const sinif = await Sinif.findById(ders.sinif);
    if (!sinif) continue;

    // Havuz var mı kontrol et
    let havuz = await TestHavuzu.findOne({ sinif: sinif._id, ders: ders._id, konu: konu._id });
    if (!havuz) {
      havuz = new TestHavuzu({
        sinif: sinif._id,
        ders: ders._id,
        konu: konu._id,
        testler: testler.map(t => t._id),
        createdAt: new Date(),
      });
      await havuz.save();
      toplamHavuz++;
      toplamTest += testler.length;
      console.log(`Havuz oluşturuldu: ${sinif.ad} > ${ders.ad} > ${konu.ad} (${testler.length} test)`);
    } else {
      // Havuz varsa, testleri güncelle
      const eskiTestler = havuz.testler.length;
      havuz.testler = testler.map(t => t._id);
      await havuz.save();
      if (havuz.testler.length !== eskiTestler) {
        toplamTest += testler.length;
        console.log(`Havuz güncellendi: ${sinif.ad} > ${ders.ad} > ${konu.ad} (${testler.length} test)`);
      }
    }
  }

  console.log(`\nToplam ${toplamHavuz} yeni havuz oluşturuldu, ${toplamTest} test havuzlara eklendi/güncellendi.`);
  await mongoose.disconnect();
  console.log('İşlem tamamlandı.');
}

main().catch(e => { console.error(e); process.exit(1); }); 