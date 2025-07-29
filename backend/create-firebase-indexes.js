const admin = require('firebase-admin');
const serviceAccount = require('./cozkazan-app-firebase-adminsdk.json');

// Firebase Admin SDK'yı başlat
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'cozkazan-app'
});

const db = admin.firestore();

async function createFirebaseIndexes() {
  try {
    console.log('🔥 Firebase Index\'leri oluşturuluyor...');
    console.log('='.repeat(50));

    // 1. testler koleksiyonu için index
    console.log('\n📝 testler koleksiyonu index\'i oluşturuluyor...');
    try {
      await db.collection('testler').createIndex({
        fields: [
          { fieldPath: 'sinifAdi', order: 'ASCENDING' },
          { fieldPath: 'dersAdi', order: 'ASCENDING' },
          { fieldPath: 'konuAdi', order: 'ASCENDING' }
        ]
      });
      console.log('✅ testler index oluşturuldu');
    } catch (error) {
      if (error.code === 'ALREADY_EXISTS') {
        console.log('ℹ️ testler index zaten mevcut');
      } else {
        console.log('❌ testler index hatası:', error.message);
      }
    }

    // 2. test_sonuclari koleksiyonu için index
    console.log('\n📊 test_sonuclari koleksiyonu index\'i oluşturuluyor...');
    try {
      await db.collection('test_sonuclari').createIndex({
        fields: [
          { fieldPath: 'userId', order: 'ASCENDING' },
          { fieldPath: 'cocukId', order: 'ASCENDING' },
          { fieldPath: 'createdAt', order: 'DESCENDING' }
        ]
      });
      console.log('✅ test_sonuclari index oluşturuldu');
    } catch (error) {
      if (error.code === 'ALREADY_EXISTS') {
        console.log('ℹ️ test_sonuclari index zaten mevcut');
      } else {
        console.log('❌ test_sonuclari index hatası:', error.message);
      }
    }

    // 3. konular koleksiyonu için index
    console.log('\n📚 konular koleksiyonu index\'i oluşturuluyor...');
    try {
      await db.collection('konular').createIndex({
        fields: [
          { fieldPath: 'sinifAdi', order: 'ASCENDING' },
          { fieldPath: 'dersAdi', order: 'ASCENDING' }
        ]
      });
      console.log('✅ konular index oluşturuldu');
    } catch (error) {
      if (error.code === 'ALREADY_EXISTS') {
        console.log('ℹ️ konular index zaten mevcut');
      } else {
        console.log('❌ konular index hatası:', error.message);
      }
    }

    // 4. dersler koleksiyonu için index
    console.log('\n📖 dersler koleksiyonu index\'i oluşturuluyor...');
    try {
      await db.collection('dersler').createIndex({
        fields: [
          { fieldPath: 'sinifAdi', order: 'ASCENDING' }
        ]
      });
      console.log('✅ dersler index oluşturuldu');
    } catch (error) {
      if (error.code === 'ALREADY_EXISTS') {
        console.log('ℹ️ dersler index zaten mevcut');
      } else {
        console.log('❌ dersler index hatası:', error.message);
      }
    }

    console.log('\n🎉 Tüm index\'ler oluşturuldu!');
    console.log('\n📋 Oluşturulan Index\'ler:');
    console.log('   - testler: sinifAdi, dersAdi, konuAdi');
    console.log('   - test_sonuclari: userId, cocukId, createdAt');
    console.log('   - konular: sinifAdi, dersAdi');
    console.log('   - dersler: sinifAdi');

    console.log('\n⏱️ Index\'lerin aktif olması 1-5 dakika sürebilir.');
    console.log('Index\'ler hazır olduktan sonra Flutter uygulaması çalışacak.');

  } catch (error) {
    console.error('❌ Index oluşturma hatası:', error);
  } finally {
    process.exit(0);
  }
}

// Scripti çalıştır
createFirebaseIndexes(); 