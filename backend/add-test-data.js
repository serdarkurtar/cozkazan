const admin = require('firebase-admin');

// Firebase Admin SDK yapılandırması (geçici)
const serviceAccount = {
  "type": "service_account",
  "project_id": "cozkazan-app",
  "private_key_id": "temp",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@cozkazan-app.iam.gserviceaccount.com",
  "client_id": "temp",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40cozkazan-app.iam.gserviceaccount.com"
};

// Firebase Admin SDK başlatma
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: 'cozkazan-app'
});

const db = admin.firestore();

async function addTestData() {
  try {
    console.log('Firebase\'e test verileri ekleniyor...');

    // Test dersleri ekle
    const dersler = [
      { ad: 'Türkçe', sinifAdi: '1. Sınıf' },
      { ad: 'Matematik', sinifAdi: '1. Sınıf' },
      { ad: 'Hayat Bilgisi', sinifAdi: '1. Sınıf' },
      { ad: 'Türkçe', sinifAdi: '2. Sınıf' },
      { ad: 'Matematik', sinifAdi: '2. Sınıf' },
      { ad: 'Hayat Bilgisi', sinifAdi: '2. Sınıf' },
      { ad: 'Türkçe', sinifAdi: '3. Sınıf' },
      { ad: 'Matematik', sinifAdi: '3. Sınıf' },
      { ad: 'Fen Bilimleri', sinifAdi: '3. Sınıf' },
      { ad: 'Türkçe', sinifAdi: '4. Sınıf' },
      { ad: 'Matematik', sinifAdi: '4. Sınıf' },
      { ad: 'Fen Bilimleri', sinifAdi: '4. Sınıf' },
    ];

    for (const ders of dersler) {
      await db.collection('dersler').add({
        ...ders,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`${dersler.length} ders eklendi`);

    // Test konuları ekle
    const konular = [
      { ad: 'Atamızın İzinde', dersAdi: 'Türkçe', sinifAdi: '2. Sınıf' },
      { ad: 'Çevremizdeki Yaşam', dersAdi: 'Hayat Bilgisi', sinifAdi: '2. Sınıf' },
      { ad: 'Toplama İşlemi', dersAdi: 'Matematik', sinifAdi: '2. Sınıf' },
      { ad: 'Çıkarma İşlemi', dersAdi: 'Matematik', sinifAdi: '2. Sınıf' },
    ];

    for (const konu of konular) {
      await db.collection('konular').add({
        ...konu,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`${konular.length} konu eklendi`);

    // Test testleri ekle
    const testler = [
      {
        ad: 'Atamızın İzinde Test 1',
        dersAdi: 'Türkçe',
        sinifAdi: '2. Sınıf',
        konuAdi: 'Atamızın İzinde',
        sorular: [
          {
            soru: 'Atatürk hangi yılda doğmuştur?',
            secenekler: ['1881', '1882', '1883', '1884'],
            dogruCevap: 0
          },
          {
            soru: 'Atatürk\'ün doğduğu şehir hangisidir?',
            secenekler: ['İstanbul', 'Ankara', 'Selanik', 'İzmir'],
            dogruCevap: 2
          }
        ]
      },
      {
        ad: 'Çevremizdeki Yaşam Test 1',
        dersAdi: 'Hayat Bilgisi',
        sinifAdi: '2. Sınıf',
        konuAdi: 'Çevremizdeki Yaşam',
        sorular: [
          {
            soru: 'Aşağıdakilerden hangisi canlı bir varlıktır?',
            secenekler: ['Taş', 'Su', 'Ağaç', 'Toprak'],
            dogruCevap: 2
          },
          {
            soru: 'Hangi hayvan evcil hayvandır?',
            secenekler: ['Aslan', 'Kedi', 'Kaplan', 'Kurt'],
            dogruCevap: 1
          }
        ]
      }
    ];

    for (const test of testler) {
      await db.collection('testler').add({
        ...test,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log(`${testler.length} test eklendi`);

    console.log('\n✅ Test verileri başarıyla eklendi!');
    
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    process.exit(0);
  }
}

addTestData(); 