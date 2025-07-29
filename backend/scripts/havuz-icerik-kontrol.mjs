// Bu script, tüm TestHavuzu kayıtlarını ve içlerindeki testlerin varlığını, aktifliğini ve temel bilgilerini raporlar.
// Kullanım: node scripts/havuz-icerik-kontrol.mjs

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

  for (const havuz of havuzlar) {
    const sinifAd = havuz.sinif?.ad || havuz.sinif || '-';
    const dersAd = havuz.ders?.ad || havuz.ders || '-';
    const konuAd = havuz.konu?.ad || havuz.konu || '-';
    console.log(`Havuz: ${sinifAd} > ${dersAd} > ${konuAd} (ID: ${havuz._id})`);
    if (!havuz.testler || !havuz.testler.length) {
      console.log('  - Bu havuzda hiç test yok!');
      continue;
    }
    for (const test of havuz.testler) {
      // Eğer populate başarısızsa test bir ObjectId olabilir
      if (typeof test === 'string' || typeof test === 'object' && test._bsontype === 'ObjectID') {
        const testDoc = await Test.findById(test);
        if (!testDoc) {
          console.log(`  - Test bulunamadı! (ID: ${test})`);
        } else {
          console.log(`  - Test: ${testDoc.testAdi || testDoc.ad || '-'} | Aktif: ${testDoc.aktif ? 'Evet' : 'Hayır'} | ID: ${test._id}`);
        }
      } else {
        // Test populate ile gelmişse
        console.log(`  - Test: ${test.testAdi || test.ad || '-'} | Aktif: ${test.aktif ? 'Evet' : 'Hayır'} | ID: ${test._id}`);
      }
    }
    console.log('');
  }

  await mongoose.disconnect();
  console.log('İşlem tamamlandı.');
}

main().catch(e => { console.error(e); process.exit(1); }); 