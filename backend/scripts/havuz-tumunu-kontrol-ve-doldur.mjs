// Tüm TestHavuzu kayıtlarını kontrol eder ve eksikse, ilgili konuya ait testleri havuzun testler dizisine ekler.
// Kullanım: node scripts/havuz-tumunu-kontrol-ve-doldur.mjs

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
  console.log('MongoDB bağlantısı başarılı.\n');

  const havuzlar = await TestHavuzu.find().populate('sinif ders konu testler');
  if (!havuzlar.length) {
    console.log('Hiç test havuzu bulunamadı.');
    await mongoose.disconnect();
    return;
  }

  let toplamDoldurulan = 0;
  for (const havuz of havuzlar) {
    const sinifAd = havuz.sinif?.ad || havuz.sinif || '-';
    const dersAd = havuz.ders?.ad || havuz.ders || '-';
    const konuAd = havuz.konu?.ad || havuz.konu || '-';
    console.log(`Havuz: ${sinifAd} > ${dersAd} > ${konuAd} (ID: ${havuz._id})`);
    // Konuya ait testleri bul
    const testler = await Test.find({ konu: havuz.konu?._id || havuz.konu });
    if (!testler.length) {
      console.log('  - Bu konuya ait hiç test yok!');
      continue;
    }
    // Havuzun testler dizisini güncelle
    const eskiTestSayisi = havuz.testler.length;
    havuz.testler = testler.map(t => t._id);
    await havuz.save();
    if (havuz.testler.length !== eskiTestSayisi) {
      console.log(`  - Havuz testleri güncellendi: ${havuz.testler.length} test eklendi.`);
      toplamDoldurulan++;
    } else {
      console.log('  - Havuz zaten güncel.');
    }
  }

  console.log(`\nToplam ${toplamDoldurulan} havuzun testleri güncellendi.`);
  await mongoose.disconnect();
  console.log('İşlem tamamlandı.');
}

main().catch(e => { console.error(e); process.exit(1); }); 