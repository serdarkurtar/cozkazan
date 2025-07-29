const admin = require('firebase-admin');

// Firebase yapılandırması
const serviceAccount = require('./cozkazan-app-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkFirebaseData() {
  try {
    console.log('🔍 Firebase verilerini kontrol ediliyor...\n');

    // Testler koleksiyonunu kontrol et
    console.log('📚 TESTLER KOLEKSİYONU:');
    const testlerSnapshot = await db.collection('testler').get();
    console.log(`Toplam test sayısı: ${testlerSnapshot.docs.length}`);
    
    if (testlerSnapshot.docs.length > 0) {
      console.log('\nİlk 3 test:');
      testlerSnapshot.docs.slice(0, 3).forEach((doc, index) => {
        const data = doc.data();
        console.log(`  Test ${index + 1}:`);
        console.log(`    ID: ${doc.id}`);
        console.log(`    Ad: ${data.ad || 'YOK'}`);
        console.log(`    testAdi: ${data.testAdi || 'YOK'}`);
        console.log(`    Sınıf: ${data.sinifAdi || 'YOK'}`);
        console.log(`    Ders: ${data.dersAdi || 'YOK'}`);
        console.log(`    Konu: ${data.konuAdi || 'YOK'}`);
        console.log('');
      });
    }

    // Sorular koleksiyonunu kontrol et
    console.log('❓ SORULAR KOLEKSİYONU:');
    const sorularSnapshot = await db.collection('sorular').get();
    console.log(`Toplam soru sayısı: ${sorularSnapshot.docs.length}`);
    
    if (sorularSnapshot.docs.length > 0) {
      console.log('\nİlk 2 soru:');
      sorularSnapshot.docs.slice(0, 2).forEach((doc, index) => {
        const data = doc.data();
        console.log(`  Soru ${index + 1}:`);
        console.log(`    ID: ${doc.id}`);
        console.log(`    testId: ${data.testId || 'YOK'}`);
        console.log(`    Soru: ${data.soru || 'YOK'}`);
        console.log(`    Seçenekler: ${JSON.stringify(data.secenekler || [])}`);
        console.log(`    Doğru Cevap: ${data.dogruCevap || 'YOK'}`);
        console.log('');
      });
    }

    // Test sonuçları koleksiyonunu kontrol et
    console.log('📊 TEST SONUÇLARI KOLEKSİYONU:');
    const testSonuclariSnapshot = await db.collection('test_sonuclari').get();
    console.log(`Toplam test sonucu sayısı: ${testSonuclariSnapshot.docs.length}`);
    
    if (testSonuclariSnapshot.docs.length > 0) {
      console.log('\nİlk 2 test sonucu:');
      testSonuclariSnapshot.docs.slice(0, 2).forEach((doc, index) => {
        const data = doc.data();
        console.log(`  Test Sonucu ${index + 1}:`);
        console.log(`    ID: ${doc.id}`);
        console.log(`    userId: ${data.userId || 'YOK'}`);
        console.log(`    cocukId: ${data.cocukId || 'YOK'}`);
        console.log(`    Testler: ${JSON.stringify(data.testler || [])}`);
        console.log('');
      });
    }

    // Test havuzları koleksiyonunu kontrol et
    console.log('🏊 TEST HAVUZLARI KOLEKSİYONU:');
    const testHavuzlariSnapshot = await db.collection('test_havuzlari').get();
    console.log(`Toplam test havuzu sayısı: ${testHavuzlariSnapshot.docs.length}`);
    
    if (testHavuzlariSnapshot.docs.length > 0) {
      console.log('\nİlk 2 test havuzu:');
      testHavuzlariSnapshot.docs.slice(0, 2).forEach((doc, index) => {
        const data = doc.data();
        console.log(`  Test Havuzu ${index + 1}:`);
        console.log(`    ID: ${doc.id}`);
        console.log(`    userId: ${data.userId || 'YOK'}`);
        console.log(`    cocukId: ${data.cocukId || 'YOK'}`);
        console.log(`    Testler: ${JSON.stringify(data.testler || [])}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    process.exit(0);
  }
}

checkFirebaseData(); 