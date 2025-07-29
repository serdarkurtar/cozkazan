import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Test from '../models/Test.js';
import TestHavuzu from '../models/TestHavuzu.js';
import Soru from '../models/Soru.js';
import Sinif from '../models/Sinif.js';
import Ders from '../models/Ders.js';
import Konu from '../models/Konu.js';

dotenv.config();

const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/cozkazan';

async function havuzlariGuncelle() {
  try {
    await mongoose.connect(mongoUrl);
    console.log('✅ Veritabanı bağlantısı başarılı.');

    // Tüm testleri getir
    const testler = await Test.find().populate('sinif ders konu');
    console.log(`📊 ${testler.length} test bulundu.`);

    // Her test için havuz oluştur veya güncelle
    for (const test of testler) {
      console.log(`🔄 Test işleniyor: ${test.testAdi}`);
      
      // Mevcut havuzu bul
      let havuz = await TestHavuzu.findOne({
        sinif: test.sinif._id,
        ders: test.ders._id,
        konu: test.konu._id
      });

      if (!havuz) {
        // Yeni havuz oluştur
        havuz = new TestHavuzu({
          sinif: test.sinif._id,
          ders: test.ders._id,
          konu: test.konu._id,
          havuzAdi: `${test.sinif.ad} - ${test.ders.ad} - ${test.konu.ad}`,
          testler: [test._id]
        });
        console.log(`✅ Yeni havuz oluşturuldu: ${havuz.havuzAdi}`);
      } else {
        // Mevcut havuza test ekle (eğer yoksa)
        if (!havuz.testler.includes(test._id)) {
          havuz.testler.push(test._id);
          console.log(`✅ Test havuza eklendi: ${test.testAdi}`);
        } else {
          console.log(`ℹ️ Test zaten havuzda: ${test.testAdi}`);
        }
      }

      await havuz.save();
    }

    // Havuz istatistiklerini güncelle
    const havuzlar = await TestHavuzu.find();
    console.log(`\n📈 Havuz istatistikleri güncelleniyor...`);

    for (const havuz of havuzlar) {
      const testler = await Test.find({ _id: { $in: havuz.testler } });
      const sorular = await Soru.find({ test: { $in: havuz.testler } });
      
      havuz.toplamSoru = sorular.length;
      havuz.aktifTest = testler.filter(t => t.aktif).length;
      
      await havuz.save();
      console.log(`✅ Havuz güncellendi: ${havuz.havuzAdi} - ${havuz.testler.length} test, ${havuz.toplamSoru} soru`);
    }

    console.log('\n🎉 Tüm havuzlar başarıyla güncellendi!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

havuzlariGuncelle(); 