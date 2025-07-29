const mongoose = require('mongoose');

// MongoDB bağlantısı
const mongoUrl = 'mongodb://localhost:27017/cozkazan';

async function checkMongoCollections() {
  try {
    console.log('🔄 MongoDB bağlantısı kuruluyor...');
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB bağlantısı başarılı');

    const db = mongoose.connection.db;
    
    console.log('\n📊 MongoDB Koleksiyonları Analiz Ediliyor...');
    console.log('='.repeat(60));

    // Tüm koleksiyonları listele
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Toplam ${collections.length} koleksiyon bulundu:`);
    
    for (const collection of collections) {
      console.log(`   - ${collection.name}`);
    }

    // Her koleksiyondaki veri sayısını kontrol et
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`\n📈 ${collection.name}: ${count} kayıt`);
      
      if (count > 0) {
        // İlk 3 kaydı göster
        const sampleDocs = await db.collection(collection.name).find().limit(3).toArray();
        console.log(`   Örnek kayıtlar:`);
        sampleDocs.forEach((doc, index) => {
          console.log(`   ${index + 1}. ${JSON.stringify(doc, null, 2).substring(0, 200)}...`);
        });
      }
    }

    // Özel kontroller
    console.log('\n🔍 ÖZEL KONTROLLER:');
    console.log('='.repeat(60));

    // Test havuzları kontrolü
    const havuzlar = await db.collection('testhavuzus').find().toArray();
    console.log(`\n🏊 Test Havuzları: ${havuzlar.length} adet`);
    havuzlar.forEach((havuz, index) => {
      console.log(`   ${index + 1}. ${havuz.havuzAdi || 'İsimsiz'} (Test sayısı: ${havuz.testler?.length || 0})`);
    });

    // Testler kontrolü
    const testler = await db.collection('tests').find().toArray();
    console.log(`\n🧪 Testler: ${testler.length} adet`);
    testler.slice(0, 5).forEach((test, index) => {
      console.log(`   ${index + 1}. ${test.testAdi || 'İsimsiz'} (${test.sinif || 'Sınıf yok'}, ${test.ders || 'Ders yok'}, ${test.konu || 'Konu yok'})`);
    });

    // Sorular kontrolü
    const sorular = await db.collection('sorus').find().toArray();
    console.log(`\n❓ Sorular: ${sorular.length} adet`);
    sorular.slice(0, 3).forEach((soru, index) => {
      console.log(`   ${index + 1}. "${soru.soru?.substring(0, 50) || 'Soru yok'}..." (Test: ${soru.test || 'Test yok'})`);
    });

    // Sınıflar kontrolü
    const siniflar = await db.collection('sinifs').find().toArray();
    console.log(`\n📚 Sınıflar: ${siniflar.length} adet`);
    siniflar.forEach((sinif, index) => {
      console.log(`   ${index + 1}. ${sinif.ad || 'İsimsiz'} (Seviye: ${sinif.seviye || 'Bilinmiyor'})`);
    });

    // Dersler kontrolü
    const dersler = await db.collection('derss').find().toArray();
    console.log(`\n📖 Dersler: ${dersler.length} adet`);
    dersler.slice(0, 5).forEach((ders, index) => {
      console.log(`   ${index + 1}. ${ders.ad || 'İsimsiz'} (Sınıf: ${ders.sinif || 'Sınıf yok'})`);
    });

    // Konular kontrolü
    const konular = await db.collection('konus').find().toArray();
    console.log(`\n📝 Konular: ${konular.length} adet`);
    konular.slice(0, 5).forEach((konu, index) => {
      console.log(`   ${index + 1}. ${konu.ad || 'İsimsiz'} (Ders: ${konu.ders || 'Ders yok'}, Sınıf: ${konu.sinif || 'Sınıf yok'})`);
    });

    console.log('\n📊 ÖZET:');
    console.log('='.repeat(60));
    console.log(`   - Test Havuzları: ${havuzlar.length}`);
    console.log(`   - Testler: ${testler.length}`);
    console.log(`   - Sorular: ${sorular.length}`);
    console.log(`   - Sınıflar: ${siniflar.length}`);
    console.log(`   - Dersler: ${dersler.length}`);
    console.log(`   - Konular: ${konular.length}`);

    await mongoose.disconnect();
    console.log('\n✅ MongoDB bağlantısı kapatıldı');

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

checkMongoCollections(); 