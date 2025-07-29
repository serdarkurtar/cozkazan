const mongoose = require('mongoose');

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

async function analyzeMongoData() {
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

    console.log('\n📈 DETAYLI VERİ ANALİZİ:');
    console.log('='.repeat(50));
    
    console.log(`\n📚 SINIFLAR (${siniflar.length}):`);
    siniflar.forEach(sinif => {
      console.log(`   - ${sinif.ad} (Seviye: ${sinif.seviye}, Aktif: ${sinif.aktif})`);
    });

    console.log(`\n📖 DERSLER (${dersler.length}):`);
    dersler.forEach(ders => {
      console.log(`   - ${ders.ad} (Sınıf: ${ders.sinif?.ad || 'Bilinmiyor'}, Aktif: ${ders.aktif})`);
    });

    console.log(`\n📝 KONULAR (${konular.length}):`);
    konular.forEach(konu => {
      console.log(`   - ${konu.ad} (Ders: ${konu.ders?.ad || 'Bilinmiyor'}, Sınıf: ${konu.sinif?.ad || 'Bilinmiyor'}, Aktif: ${konu.aktif})`);
    });

    console.log(`\n🧪 TESTLER (${testler.length}):`);
    testler.forEach(test => {
      console.log(`   - ${test.testAdi} (Sınıf: ${test.sinif?.ad || 'Bilinmiyor'}, Ders: ${test.ders?.ad || 'Bilinmiyor'}, Konu: ${test.konu?.ad || 'Bilinmiyor'}, Aktif: ${test.aktif})`);
    });

    console.log(`\n❓ SORULAR (${sorular.length}):`);
    sorular.forEach(soru => {
      console.log(`   - "${soru.soru.substring(0, 50)}..." (Test: ${soru.test?.testAdi || 'Bilinmiyor'}, Zorluk: ${soru.zorluk})`);
    });

    console.log(`\n🏊 TEST HAVUZLARI (${havuzlar.length}):`);
    havuzlar.forEach(havuz => {
      console.log(`   - ${havuz.havuzAdi} (Sınıf: ${havuz.sinif?.ad || 'Bilinmiyor'}, Ders: ${havuz.ders?.ad || 'Bilinmiyor'}, Konu: ${havuz.konu?.ad || 'Bilinmiyor'}, Test Sayısı: ${havuz.testler?.length || 0}, Aktif: ${havuz.aktif})`);
    });

    console.log(`\n📚 HİKAYELER (${hikayeler.length}):`);
    hikayeler.forEach(hikaye => {
      console.log(`   - ${hikaye.baslik} (Sınıf: ${hikaye.sinif?.ad || 'Bilinmiyor'}, Aktif: ${hikaye.aktif})`);
    });

    console.log('\n📊 ÖZET İSTATİSTİKLER:');
    console.log('='.repeat(50));
    console.log(`   - Toplam Sınıf: ${siniflar.length}`);
    console.log(`   - Toplam Ders: ${dersler.length}`);
    console.log(`   - Toplam Konu: ${konular.length}`);
    console.log(`   - Toplam Test: ${testler.length}`);
    console.log(`   - Toplam Soru: ${sorular.length}`);
    console.log(`   - Toplam Test Havuzu: ${havuzlar.length}`);
    console.log(`   - Toplam Hikaye: ${hikayeler.length}`);

    // Aktif/Pasif analizi
    const aktifSiniflar = siniflar.filter(s => s.aktif).length;
    const aktifDersler = dersler.filter(d => d.aktif).length;
    const aktifKonular = konular.filter(k => k.aktif).length;
    const aktifTestler = testler.filter(t => t.aktif).length;
    const aktifHavuzlar = havuzlar.filter(h => h.aktif).length;
    const aktifHikayeler = hikayeler.filter(h => h.aktif).length;

    console.log('\n✅ AKTİF VERİLER:');
    console.log(`   - Aktif Sınıf: ${aktifSiniflar}/${siniflar.length}`);
    console.log(`   - Aktif Ders: ${aktifDersler}/${dersler.length}`);
    console.log(`   - Aktif Konu: ${aktifKonular}/${konular.length}`);
    console.log(`   - Aktif Test: ${aktifTestler}/${testler.length}`);
    console.log(`   - Aktif Test Havuzu: ${aktifHavuzlar}/${havuzlar.length}`);
    console.log(`   - Aktif Hikaye: ${aktifHikayeler}/${hikayeler.length}`);

    await mongoose.disconnect();
    console.log('\n✅ MongoDB bağlantısı kapatıldı');

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

analyzeMongoData(); 