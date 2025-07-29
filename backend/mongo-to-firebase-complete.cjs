const mongoose = require('mongoose');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

// Firebase Admin SDK yapılandırması
const serviceAccount = JSON.parse(fs.readFileSync('./cozkazan-app-firebase-adminsdk.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

// MongoDB bağlantısı
const mongoUrl = 'mongodb://localhost:27017/cozkazan';

// MongoDB modelleri
const SinifSchema = new mongoose.Schema({
  ad: String,
  seviye: Number,
  aktif: { type: Boolean, default: true }
});

const DersSchema = new mongoose.Schema({
  ad: String,
  sinif: { type: mongoose.Schema.Types.ObjectId, ref: 'Sinif' },
  aktif: { type: Boolean, default: true }
});

const KonuSchema = new mongoose.Schema({
  ad: String,
  ders: { type: mongoose.Schema.Types.ObjectId, ref: 'Ders' },
  sinif: { type: mongoose.Schema.Types.ObjectId, ref: 'Sinif' },
  aktif: { type: Boolean, default: true }
});

const TestSchema = new mongoose.Schema({
  testAdi: String,
  sinif: { type: mongoose.Schema.Types.ObjectId, ref: 'Sinif' },
  ders: { type: mongoose.Schema.Types.ObjectId, ref: 'Ders' },
  konu: { type: mongoose.Schema.Types.ObjectId, ref: 'Konu' },
  aktif: { type: Boolean, default: true }
});

const SoruSchema = new mongoose.Schema({
  soru: String,
  secenekler: [String],
  dogruCevap: String,
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
  zorluk: { type: String, default: 'orta' }
});

const TestHavuzuSchema = new mongoose.Schema({
  sinif: { type: mongoose.Schema.Types.ObjectId, ref: 'Sinif' },
  ders: { type: mongoose.Schema.Types.ObjectId, ref: 'Ders' },
  konu: { type: mongoose.Schema.Types.ObjectId, ref: 'Konu' },
  havuzAdi: String,
  testler: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
  aktif: { type: Boolean, default: true }
});

const HikayeSchema = new mongoose.Schema({
  baslik: String,
  icerik: String,
  sinif: { type: mongoose.Schema.Types.ObjectId, ref: 'Sinif' },
  aktif: { type: Boolean, default: true }
});

// Modelleri oluştur
const Sinif = mongoose.model('Sinif', SinifSchema);
const Ders = mongoose.model('Ders', DersSchema);
const Konu = mongoose.model('Konu', KonuSchema);
const Test = mongoose.model('Test', TestSchema);
const Soru = mongoose.model('Soru', SoruSchema);
const TestHavuzu = mongoose.model('TestHavuzu', TestHavuzuSchema);
const Hikaye = mongoose.model('Hikaye', HikayeSchema);

async function migrateAllData() {
  try {
    console.log('🔄 MongoDB bağlantısı kuruluyor...');
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB bağlantısı başarılı');

    console.log('\n📊 MongoDB verileri analiz ediliyor...');
    
    // Tüm verileri çek
    const siniflar = await Sinif.find().lean();
    const dersler = await Ders.find().populate('sinif').lean();
    const konular = await Konu.find().populate('ders sinif').lean();
    const testler = await Test.find().populate('sinif ders konu').lean();
    const sorular = await Soru.find().populate('test').lean();
    const havuzlar = await TestHavuzu.find().populate('sinif ders konu testler').lean();
    const hikayeler = await Hikaye.find().populate('sinif').lean();

    console.log(`📈 Veri sayıları:`);
    console.log(`   - Sınıflar: ${siniflar.length}`);
    console.log(`   - Dersler: ${dersler.length}`);
    console.log(`   - Konular: ${konular.length}`);
    console.log(`   - Testler: ${testler.length}`);
    console.log(`   - Sorular: ${sorular.length}`);
    console.log(`   - Test Havuzları: ${havuzlar.length}`);
    console.log(`   - Hikayeler: ${hikayeler.length}`);

    console.log('\n🔥 Firebase\'e veri yükleme başlıyor...');

    // 1. Sınıfları yükle
    console.log('\n📚 Sınıflar yükleniyor...');
    for (const sinif of siniflar) {
      await db.collection('siniflar').add({
        ad: sinif.ad,
        seviye: sinif.seviye,
        aktif: sinif.aktif,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${siniflar.length} sınıf yüklendi`);

    // 2. Dersleri yükle
    console.log('\n📖 Dersler yükleniyor...');
    for (const ders of dersler) {
      await db.collection('dersler').add({
        ad: ders.ad,
        sinifAdi: ders.sinif?.ad || '',
        sinifId: ders.sinif?._id?.toString() || '',
        aktif: ders.aktif,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${dersler.length} ders yüklendi`);

    // 3. Konuları yükle
    console.log('\n📝 Konular yükleniyor...');
    for (const konu of konular) {
      await db.collection('konular').add({
        ad: konu.ad,
        dersAdi: konu.ders?.ad || '',
        dersId: konu.ders?._id?.toString() || '',
        sinifAdi: konu.sinif?.ad || '',
        sinifId: konu.sinif?._id?.toString() || '',
        aktif: konu.aktif,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${konular.length} konu yüklendi`);

    // 4. Testleri yükle
    console.log('\n🧪 Testler yükleniyor...');
    for (const test of testler) {
      await db.collection('testler').add({
        ad: test.testAdi,
        sinifAdi: test.sinif?.ad || '',
        sinifId: test.sinif?._id?.toString() || '',
        dersAdi: test.ders?.ad || '',
        dersId: test.ders?._id?.toString() || '',
        konuAdi: test.konu?.ad || '',
        konuId: test.konu?._id?.toString() || '',
        aktif: test.aktif,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${testler.length} test yüklendi`);

    // 5. Soruları yükle
    console.log('\n❓ Sorular yükleniyor...');
    for (const soru of sorular) {
      await db.collection('sorular').add({
        soru: soru.soru,
        secenekler: soru.secenekler,
        dogruCevap: soru.dogruCevap,
        testAdi: soru.test?.testAdi || '',
        testId: soru.test?._id?.toString() || '',
        zorluk: soru.zorluk,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${sorular.length} soru yüklendi`);

    // 6. Test Havuzlarını yükle
    console.log('\n🏊 Test Havuzları yükleniyor...');
    for (const havuz of havuzlar) {
      const havuzTestleri = havuz.testler?.map(test => ({
        testAdi: test.testAdi,
        testId: test._id.toString(),
        sinifAdi: test.sinif?.ad || '',
        dersAdi: test.ders?.ad || '',
        konuAdi: test.konu?.ad || ''
      })) || [];

      await db.collection('test_havuzlari').add({
        havuzAdi: havuz.havuzAdi,
        sinifAdi: havuz.sinif?.ad || '',
        sinifId: havuz.sinif?._id?.toString() || '',
        dersAdi: havuz.ders?.ad || '',
        dersId: havuz.ders?._id?.toString() || '',
        konuAdi: havuz.konu?.ad || '',
        konuId: havuz.konu?._id?.toString() || '',
        testler: havuzTestleri,
        testSayisi: havuzTestleri.length,
        aktif: havuz.aktif,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${havuzlar.length} test havuzu yüklendi`);

    // 7. Hikayeleri yükle
    console.log('\n📚 Hikayeler yükleniyor...');
    for (const hikaye of hikayeler) {
      await db.collection('hikayeler').add({
        baslik: hikaye.baslik,
        icerik: hikaye.icerik,
        sinifAdi: hikaye.sinif?.ad || '',
        sinifId: hikaye.sinif?._id?.toString() || '',
        aktif: hikaye.aktif,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${hikayeler.length} hikaye yüklendi`);

    // 8. Örnek kullanıcı verileri oluştur
    console.log('\n👥 Örnek kullanıcı verileri oluşturuluyor...');
    await db.collection('kullanicilar').add({
      id: 'parent_1',
      tip: 'veli',
      ad: 'Veli Kullanıcı',
      email: 'veli@cozkazan.com',
      createdAt: new Date()
    });

    await db.collection('kullanicilar').add({
      id: 'child_1',
      tip: 'cocuk',
      ad: 'Çocuk Kullanıcı',
      veliId: 'parent_1',
      sinif: '2. Sınıf',
      createdAt: new Date()
    });

    console.log('✅ Örnek kullanıcılar oluşturuldu');

    console.log('\n🎉 TÜM VERİLER BAŞARIYLA FIREBASE\'E YÜKLENDİ!');
    console.log('\n📊 ÖZET:');
    console.log(`   - ${siniflar.length} sınıf`);
    console.log(`   - ${dersler.length} ders`);
    console.log(`   - ${konular.length} konu`);
    console.log(`   - ${testler.length} test`);
    console.log(`   - ${sorular.length} soru`);
    console.log(`   - ${havuzlar.length} test havuzu`);
    console.log(`   - ${hikayeler.length} hikaye`);

    await mongoose.disconnect();
    console.log('\n✅ MongoDB bağlantısı kapatıldı');

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

migrateAllData(); 