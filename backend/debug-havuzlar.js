import mongoose from 'mongoose';
import { config } from 'dotenv';

config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cozkazan';

async function debugHavuzlar() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı');

    const Test = (await import('./models/Test.js')).default;
    const TestHavuzu = (await import('./models/TestHavuzu.js')).default;

    // Tüm havuzları kontrol et
    console.log('\n🔍 TÜM HAVUZLAR:');
    const havuzlar = await TestHavuzu.find().populate('testler');
    
    for (const havuz of havuzlar) {
      console.log(`\n📦 HAVUZ: ${havuz.sinif} - ${havuz.ders} - ${havuz.konu}`);
      console.log(`   ID: ${havuz._id}`);
      console.log(`   Test Sayısı: ${havuz.testler.length}`);
      
      if (havuz.testler.length > 0) {
        console.log('   📝 TESTLER:');
        for (const test of havuz.testler) {
          console.log(`     - ${test.aciklama?.slice(0, 50)}...`);
          console.log(`       Test ID: ${test._id}`);
          console.log(`       Test HavuzId: ${test.havuzId}`);
          console.log(`       Test Sinif: ${test.sinif}`);
          console.log(`       Test Ders: ${test.ders}`);
          console.log(`       Test Konu: ${test.konu}`);
        }
      }
    }

    // Tüm testleri kontrol et
    console.log('\n🔍 TÜM TESTLER:');
    const testler = await Test.find();
    
    for (const test of testler) {
      console.log(`\n📝 TEST: ${test.aciklama?.slice(0, 50)}...`);
      console.log(`   ID: ${test._id}`);
      console.log(`   HavuzId: ${test.havuzId}`);
      console.log(`   Sinif: ${test.sinif}`);
      console.log(`   Ders: ${test.ders}`);
      console.log(`   Konu: ${test.konu}`);
    }

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ MongoDB bağlantısı kapatıldı');
  }
}

debugHavuzlar(); 