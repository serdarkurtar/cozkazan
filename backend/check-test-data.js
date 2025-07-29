const admin = require('firebase-admin');
const serviceAccount = require('../cozkazan-app-firebase-adminsdk.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function checkTestData() {
    try {
        console.log('🔍 Test verilerini kontrol ediliyor...\n');
        
        const testlerSnapshot = await db.collection('testler').get();
        
        console.log(`📊 Toplam ${testlerSnapshot.size} test bulundu\n`);
        
        testlerSnapshot.forEach((doc, index) => {
            const test = doc.data();
            console.log(`\n--- Test ${index + 1} ---`);
            console.log(`ID: ${doc.id}`);
            console.log(`Ad: ${test.ad || test.testAdi || 'İsimsiz'}`);
            console.log(`Açıklama: ${test.aciklama || 'Yok'}`);
            console.log(`Sınıf: ${test.sinifAdi || 'Yok'}`);
            console.log(`Ders: ${test.dersAdi || 'Yok'}`);
            console.log(`Konu: ${test.konuAdi || 'Yok'}`);
            
            if (test.sorular) {
                console.log(`Soru Sayısı: ${test.sorular.length}`);
                if (test.sorular.length > 0) {
                    console.log('İlk Soru Örneği:');
                    console.log(`  Soru: ${test.sorular[0].soru || 'Yok'}`);
                    console.log(`  Seçenekler: ${JSON.stringify(test.sorular[0].secenekler || [])}`);
                    console.log(`  Doğru Cevap: ${test.sorular[0].dogruCevap || 'Yok'}`);
                }
            } else {
                console.log('❌ Sorular alanı yok!');
            }
            
            console.log('---');
        });
        
    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        process.exit(0);
    }
}

checkTestData(); 