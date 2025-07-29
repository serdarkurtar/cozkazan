const mongoose = require('mongoose');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');

// Firebase Admin SDK yapılandırması - Gerçek service account dosyasını kullan
let serviceAccount;
try {
  serviceAccount = JSON.parse(fs.readFileSync('./cozkazan-app-firebase-adminsdk.json', 'utf8'));
  console.log('✅ Firebase service account dosyası yüklendi');
} catch (error) {
  console.error('❌ Firebase service account dosyası bulunamadı!');
  console.log('📋 Lütfen Firebase Console\'dan service account key\'ini indirin:');
  console.log('   1. https://console.firebase.google.com/');
  console.log('   2. cozkazan-app projesini seçin');
  console.log('   3. Ayarlar (⚙️) > Proje ayarları');
  console.log('   4. Service accounts sekmesi');
  console.log('   5. "Generate new private key" butonuna tıklayın');
  console.log('   6. JSON dosyasını backend/cozkazan-app-firebase-adminsdk.json olarak kaydedin');
  process.exit(1);
}

// Firebase'i başlat
try {
  initializeApp({
    credential: cert(serviceAccount)
  });
  console.log('✅ Firebase Admin SDK başlatıldı');
} catch (error) {
  console.log('⚠️ Firebase zaten başlatılmış, devam ediliyor...');
}

const db = getFirestore();

// MongoDB bağlantısı
const mongoUrl = 'mongodb://localhost:27017/cozkazan';

async function migrateMongoToFirebase() {
  try {
    console.log('🔄 MongoDB bağlantısı kuruluyor...');
    await mongoose.connect(mongoUrl);
    console.log('✅ MongoDB bağlantısı başarılı');

    const mongoDb = mongoose.connection.db;
    
    console.log('\n📊 MongoDB\'den Firebase\'e veri aktarımı başlıyor...');
    console.log('='.repeat(60));

    // 1. Sınıfları aktar
    console.log('\n📚 Sınıflar aktarılıyor...');
    const siniflar = await mongoDb.collection('sinifs').find().toArray();
    for (const sinif of siniflar) {
      await db.collection('siniflar').add({
        ad: sinif.ad,
        sira: sinif.sira || 1,
        aktif: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${siniflar.length} sınıf aktarıldı`);

    // 2. Dersleri aktar
    console.log('\n📖 Dersler aktarılıyor...');
    const dersler = await mongoDb.collection('ders').find().toArray();
    for (const ders of dersler) {
      await db.collection('dersler').add({
        ad: ders.ad,
        sinifAdi: ders.sinifAdi || '',
        sinifId: ders.sinif?.toString() || '',
        aktif: ders.aktif !== false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${dersler.length} ders aktarıldı`);

    // 3. Konuları aktar
    console.log('\n📝 Konular aktarılıyor...');
    const konular = await mongoDb.collection('konus').find().toArray();
    for (const konu of konular) {
      await db.collection('konular').add({
        ad: konu.ad,
        dersAdi: konu.dersAdi || '',
        dersId: konu.ders?.toString() || '',
        sinifAdi: konu.sinifAdi || '',
        sinifId: konu.sinif?.toString() || '',
        sira: konu.sira || 1,
        aktif: konu.aktif !== false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${konular.length} konu aktarıldı`);

    // 4. Testleri aktar
    console.log('\n🧪 Testler aktarılıyor...');
    const testler = await mongoDb.collection('tests').find().toArray();
    for (const test of testler) {
      await db.collection('testler').add({
        ad: test.testAdi || test.ad || 'İsimsiz Test',
        sinifAdi: test.sinif || '',
        dersAdi: test.ders || '',
        konuAdi: test.konu || '',
        aciklama: test.aciklama || '',
        aktif: test.aktif !== false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${testler.length} test aktarıldı`);

    // 5. Soruları aktar
    console.log('\n❓ Sorular aktarılıyor...');
    const sorular = await mongoDb.collection('sorus').find().toArray();
    for (const soru of sorular) {
      await db.collection('sorular').add({
        soru: soru.soruMetni || soru.soru || '',
        secenekler: soru.secenekler || [],
        dogruCevap: soru.dogruCevap || '',
        testAdi: soru.testAdi || '',
        testId: soru.test?.toString() || '',
        konuAdi: soru.konuAdi || '',
        zorluk: soru.zorluk || 'orta',
        ipucu: soru.ipucu || '',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${sorular.length} soru aktarıldı`);

    // 6. Test Havuzlarını aktar
    console.log('\n🏊 Test Havuzları aktarılıyor...');
    const havuzlar = await mongoDb.collection('testhavuzus').find().toArray();
    for (const havuz of havuzlar) {
      const havuzTestleri = havuz.testler?.map(testId => ({
        testId: testId.toString(),
        testAdi: 'Test', // Test adı daha sonra güncellenebilir
      })) || [];

      await db.collection('test_havuzlari').add({
        havuzAdi: havuz.havuzAdi || 'Ana Havuz',
        sinifAdi: havuz.sinif || '',
        dersAdi: havuz.ders || '',
        konuAdi: havuz.konu || '',
        havuzTipi: havuz.havuzTipi || 'varsayilan',
        testler: havuzTestleri,
        testSayisi: havuzTestleri.length,
        aktif: havuz.aktif !== false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${havuzlar.length} test havuzu aktarıldı`);

    // 7. Hikayeleri aktar
    console.log('\n📚 Hikayeler aktarılıyor...');
    const hikayeler = await mongoDb.collection('hikayes').find().toArray();
    for (const hikaye of hikayeler) {
      await db.collection('hikayeler').add({
        baslik: hikaye.baslik || '',
        icerik: hikaye.icerik || '',
        sinifAdi: hikaye.sinifAdi || '',
        sinifId: hikaye.sinif?.toString() || '',
        aktif: hikaye.aktif !== false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${hikayeler.length} hikaye aktarıldı`);

    // 8. Kullanıcıları aktar
    console.log('\n👥 Kullanıcılar aktarılıyor...');
    const kullanicilar = await mongoDb.collection('users').find().toArray();
    for (const kullanici of kullanicilar) {
      await db.collection('kullanicilar').add({
        id: kullanici._id.toString(),
        ad: kullanici.ad || '',
        email: kullanici.email || '',
        rol: kullanici.rol || 'cocuk',
        parentId: kullanici.parentId?.toString() || '',
        aktif: kullanici.aktif !== false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${kullanicilar.length} kullanıcı aktarıldı`);

    // 9. Veli test ayarlarını aktar
    console.log('\n⚙️ Veli test ayarları aktarılıyor...');
    const veliAyarlar = await mongoDb.collection('velitestayarlaris').find().toArray();
    for (const ayar of veliAyarlar) {
      await db.collection('test_sonuclari').add({
        userId: ayar.parentId || 'parent_1',
        cocukId: 'child_1',
        testler: ayar.testler || [],
        testSayisi: ayar.testler?.length || 0,
        soruBasiXp: 15,
        toplamXp: (ayar.testler?.length || 0) * 15,
        guncellemeTarihi: ayar.guncellemeTarihi || new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    console.log(`✅ ${veliAyarlar.length} veli test ayarı aktarıldı`);

    console.log('\n🎉 TÜM VERİLER BAŞARIYLA FIREBASE\'E AKTARILDI!');
    console.log('\n📊 ÖZET:');
    console.log('='.repeat(60));
    console.log(`   - Sınıflar: ${siniflar.length}`);
    console.log(`   - Dersler: ${dersler.length}`);
    console.log(`   - Konular: ${konular.length}`);
    console.log(`   - Testler: ${testler.length}`);
    console.log(`   - Sorular: ${sorular.length}`);
    console.log(`   - Test Havuzları: ${havuzlar.length}`);
    console.log(`   - Hikayeler: ${hikayeler.length}`);
    console.log(`   - Kullanıcılar: ${kullanicilar.length}`);
    console.log(`   - Veli Ayarları: ${veliAyarlar.length}`);

    await mongoose.disconnect();
    console.log('\n✅ MongoDB bağlantısı kapatıldı');
    console.log('\n🚀 Artık tüm sistemler Firebase kullanıyor!');

  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

migrateMongoToFirebase(); 