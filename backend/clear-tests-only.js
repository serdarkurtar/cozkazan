const admin = require('firebase-admin');

// Firebase Admin SDK yapılandırması
const serviceAccount = require('../cozkazan-app-firebase-adminsdk.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function clearTestsOnly() {
  try {
    console.log('🧪 Testler temizleniyor...');
    
    // Testler koleksiyonunu temizle
    const testlerSnapshot = await db.collection('testler').get();
    const testlerBatch = db.batch();
    
    testlerSnapshot.docs.forEach((doc) => {
      testlerBatch.delete(doc.ref);
    });
    
    await testlerBatch.commit();
    console.log(`✅ ${testlerSnapshot.size} test silindi`);
    
    // Sorular koleksiyonunu temizle
    const sorularSnapshot = await db.collection('sorular').get();
    const sorularBatch = db.batch();
    
    sorularSnapshot.docs.forEach((doc) => {
      sorularBatch.delete(doc.ref);
    });
    
    await sorularBatch.commit();
    console.log(`✅ ${sorularSnapshot.size} soru silindi`);
    
    // Test havuzları koleksiyonunu temizle
    const havuzlarSnapshot = await db.collection('test_havuzlari').get();
    const havuzlarBatch = db.batch();
    
    havuzlarSnapshot.docs.forEach((doc) => {
      havuzlarBatch.delete(doc.ref);
    });
    
    await havuzlarBatch.commit();
    console.log(`✅ ${havuzlarSnapshot.size} test havuzu silindi`);
    
    console.log('🎉 Testler, sorular ve test havuzları temizlendi!');
    console.log('📊 Kalan veriler:');
    console.log('   - Sınıflar');
    console.log('   - Dersler');
    console.log('   - Konular');
    console.log('   - Hikayeler');
    console.log('   - Kullanıcılar');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    process.exit(0);
  }
}

clearTestsOnly(); 