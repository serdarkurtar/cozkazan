const mongoose = require('mongoose');
const admin = require('firebase-admin');
const Test = require('./models/Test');
const Ders = require('./models/Ders');
const Konu = require('./models/Konu');

// Firebase Admin SDK yapılandırması
const serviceAccount = {
  "type": "service_account",
  "project_id": "cozkazan-app",
  "private_key_id": "YOUR_PRIVATE_KEY_ID",
  "private_key": "YOUR_PRIVATE_KEY",
  "client_email": "firebase-adminsdk-xxxxx@cozkazan-app.iam.gserviceaccount.com",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40cozkazan-app.iam.gserviceaccount.com"
};

// Firebase Admin SDK başlatma
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'cozkazan-app'
});

const db = admin.firestore();

async function migrateData() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect('mongodb://localhost:27017/cozkazan');
    console.log('MongoDB bağlandı');

    // Verileri çek
    const tests = await Test.find({});
    const dersler = await Ders.find({});
    const konular = await Konu.find({});

    console.log(`Bulunan veriler:`);
    console.log(`- Tests: ${tests.length}`);
    console.log(`- Dersler: ${dersler.length}`);
    console.log(`- Konular: ${konular.length}`);

    // Firestore'a taşı
    console.log('\nFirestore\'a taşınıyor...');

    // Dersleri taşı
    for (const ders of dersler) {
      await db.collection('dersler').doc(ders._id.toString()).set({
        ad: ders.ad,
        sinifAdi: ders.sinifAdi,
        createdAt: ders.createdAt,
        updatedAt: ders.updatedAt
      });
    }
    console.log(`${dersler.length} ders taşındı`);

    // Konuları taşı
    for (const konu of konular) {
      await db.collection('konular').doc(konu._id.toString()).set({
        ad: konu.ad,
        dersAdi: konu.dersAdi,
        sinifAdi: konu.sinifAdi,
        dersId: konu.dersId,
        createdAt: konu.createdAt,
        updatedAt: konu.updatedAt
      });
    }
    console.log(`${konular.length} konu taşındı`);

    // Testleri taşı
    for (const test of tests) {
      await db.collection('testler').doc(test._id.toString()).set({
        ad: test.ad,
        dersAdi: test.dersAdi,
        sinifAdi: test.sinifAdi,
        konuAdi: test.konuAdi,
        dersId: test.dersId,
        konuId: test.konuId,
        sorular: test.sorular,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt
      });
    }
    console.log(`${tests.length} test taşındı`);

    console.log('\n✅ Veri taşıma tamamlandı!');
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

migrateData(); 