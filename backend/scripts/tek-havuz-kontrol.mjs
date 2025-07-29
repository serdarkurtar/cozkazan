// Bu script, belirli bir havuzun (1. Sınıf > Ben ve Okulum) içeriğini ve testlerini detaylıca raporlar.
// Kullanım: node scripts/tek-havuz-kontrol.mjs

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

  // 1. Sınıf > Ben ve Okulum
  const sinif = await Sinif.findOne({ ad: /1\.? ?Sınıf/i });
  if (!sinif) return console.log('1. Sınıf bulunamadı!');
  const ders = await Ders.findOne({ sinif: sinif._id, ad: /Hayat Bilgisi/i });
  if (!ders) return console.log('Hayat Bilgisi dersi bulunamadı!');
  const konu = await Konu.findOne({ ders: ders._id, ad: /Ben ve Okulum/i });
  if (!konu) return console.log('Ben ve Okulum konusu bulunamadı!');

  const havuz = await TestHavuzu.findOne({ sinif: sinif._id, ders: ders._id, konu: konu._id }).populate('testler');
  if (!havuz) return console.log('Havuz bulunamadı!');

  console.log(`Havuz: ${sinif.ad} > ${ders.ad} > ${konu.ad} (ID: ${havuz._id})`);
  if (!havuz.testler || !havuz.testler.length) {
    console.log('  - Bu havuzda hiç test yok!');
  } else {
    for (const test of havuz.testler) {
      console.log(`  - Test: ${test.testAdi || test.ad || '-'} | Aktif: ${test.aktif ? 'Evet' : 'Hayır'} | ID: ${test._id}`);
    }
  }

  // Ayrıca, bu konuya ait Test koleksiyonunda test var mı kontrol et
  const testler = await Test.find({ konu: konu._id });
  if (!testler.length) {
    console.log('\nTest koleksiyonunda da bu konuya ait hiç test yok!');
  } else {
    console.log(`\nTest koleksiyonunda bu konuya ait ${testler.length} test var:`);
    for (const test of testler) {
      console.log(`  - Test: ${test.testAdi || test.ad || '-'} | Aktif: ${test.aktif ? 'Evet' : 'Hayır'} | ID: ${test._id}`);
    }
  }

  await mongoose.disconnect();
  console.log('\nİşlem tamamlandı.');
}

main().catch(e => { console.error(e); process.exit(1); }); 